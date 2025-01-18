import { db_pool } from "../config.mjs";
import { io } from '../index.mjs';
import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://guest:guest@rabbitmq:5672';
const EXCHANGE_NAME = 'pedidos_exchange';
const MAIN_QUEUE = 'pedidos_queue';
const BACKUP_QUEUE = 'pedidos_backup';

let channel = null;
let connection = null;

async function initRabbitMQ() {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        
        await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: true });
        await channel.assertQueue(MAIN_QUEUE, { durable: true });
        await channel.assertQueue(BACKUP_QUEUE, { durable: true });
        
        await channel.bindQueue(MAIN_QUEUE, EXCHANGE_NAME, '');
        await channel.bindQueue(BACKUP_QUEUE, EXCHANGE_NAME, '');
        
        console.log('RabbitMQ configurado correctamente');
        setupSocketListeners();
        return true;
    } catch (error) {
        console.error('Error configurando RabbitMQ:', error);
        return false;
    }
}


function setupSocketListeners() {
    io.on('connection', async (socket) => {
        console.log('Cliente conectado');

        socket.on('requestBackupMessages', async () => {
            console.log('Solicitando mensajes de backup...');
            try {
                const messages = await getAllBackupMessages();
                console.log(`Enviando ${messages.length} mensajes al cliente`);
                if (messages.length > 0) {
                    socket.emit('backupMessages', messages);
                }
            } catch (error) {
                console.error('Error:', error);
                socket.emit('error', { message: 'Error al obtener mensajes de backup' });
            }
        });

        socket.on('pedido_aceptado', async (data) => {
            try {
                const { pedidoId, conductorId } = data;
                await handlePedidoAceptado(pedidoId, conductorId);
            } catch (error) {
                socket.emit('error', { message: 'Error al procesar el pedido', error: error.message });
            }
        });
        socket.on('pedidoTomado', async (data) => {
            try {
                const { pedidoId, conductorId } = data;
                const result = await modelUbicacion.handlePedidoAceptado(pedidoId, conductorId);
                
                // Enviar confirmación al cliente que tomó el pedido
                socket.emit('pedidoTomadoConfirmacion', {
                    success: true,
                    pedidoId: pedidoId,
                    conductorId: conductorId
                });
            } catch (error) {
                console.error('Error en pedidoTomado:', error);
                socket.emit('pedidoTomadoError', {
                    success: false,
                    error: error.message,
                    pedidoId: data.pedidoId
                });
            }
        });
    });
}

async function getAllBackupMessages() {
    if (!channel) {
        console.log('Canal no inicializado');
        return [];
    }
    
    const messages = [];
    try {
        // Obtener información de la cola
        const queueInfo = await channel.checkQueue(BACKUP_QUEUE);
        console.log(`Mensajes en cola de backup: ${queueInfo.messageCount}`);
        
        // Consumir mensajes una sola vez
        const consumer = await channel.consume(BACKUP_QUEUE, (msg) => {
            if (msg !== null) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    messages.push({
                        id: content.id,
                        data: content
                    });
                    
                    // Volver a publicar el mensaje
                    channel.sendToQueue(BACKUP_QUEUE, msg.content, {
                        persistent: true
                    });
                    
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error procesando mensaje:', error);
                    channel.ack(msg);
                }
            }
        }, { noAck: false });
        
        // Esperar un momento para asegurar que todos los mensajes sean procesados
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Cancelar el consumidor
        if (consumer && consumer.consumerTag) {
            await channel.cancel(consumer.consumerTag);
        }
        
        console.log(`Mensajes recuperados: ${messages.length}`);
        return messages;
    } catch (error) {
        console.error('Error obteniendo mensajes de backup:', error);
        return [];
    }
}


async function deletePedidoFromQueue(pedidoId, queueName) {
    if (!channel) return false;
    
    const messages = [];
    try {
        // Consumir todos los mensajes de la cola
        while (true) {
            const msg = await channel.get(queueName, { noAck: false });
            if (msg === false) break;
            
            const content = JSON.parse(msg.content.toString());
            
            // Si es el mensaje que queremos eliminar, solo lo acknowledgeamos
            if (content.id.toString() === pedidoId.toString()) {
                channel.ack(msg);
                continue;
            }
            
            // Si no es el mensaje a eliminar, lo guardamos para republicarlo
            messages.push({
                content: msg.content,
                properties: msg.properties
            });
            channel.ack(msg);
        }
        
        // Republicar los mensajes que no fueron eliminados
        for (const msg of messages) {
            await channel.sendToQueue(queueName, msg.content, {
                ...msg.properties,
                persistent: true
            });
        }
        
        return true;
    } catch (error) {
        console.error(`Error eliminando mensaje de ${queueName}:`, error);
        return false;
    }
}



//console.log("--------# 4.0 ubicacion")
const modelUbicacion = { 
    createUbicacion :async(ubicacion) => {
        
        try {
            const ubicaciones = await db_pool.one('INSERT INTO relaciones.ubicacion(latitud,longitud,direccion,cliente_id,cliente_nr_id,distrito,zona_trabajo_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [ubicacion.latitud,ubicacion.longitud,ubicacion.direccion,ubicacion.cliente_id,ubicacion.cliente_nr_id,ubicacion.distrito,ubicacion.zona_trabajo_id])
            if (channel) {
                const message = {
                    id: ubicaciones.id,
                    data: ubicaciones,
                    timestamp: new Date().toISOString()
                };

                // Publish to fanout exchange for both queues
                channel.publish(
                    EXCHANGE_NAME,
                    '',
                    Buffer.from(JSON.stringify(message)),
                    { persistent: true }
                );

                // Emit to connected clients immediately
                io.emit('nuevoPedido', {
                    data: ubicaciones,
                    messageId: Date.now().toString()
                });
            }

            return ubicaciones;
        } catch (error) {
            throw new Error(`Error de inserción : ${error}`)
        }
    },
    getUbicacion : async() => {
        try {
            const ubicaciones = await db_pool.any('SELECT * FROM relaciones.ubicacion')
           // console.log("ubicaciones")
         //   console.log(ubicaciones)
            return ubicaciones
        } catch (error) {
            throw new Error(`Error conseguir ${error}`)
        }
    },
    getUbicacionesCliente : async(clienteID) => {
      //  console.log("----------LLEGO EL CLIENTE_ID----------------------------")
        try {
            const ubicaciones = await db_pool.any('SELECT * FROM relaciones.ubicacion WHERE cliente_id = $1',[clienteID])
           // console.log("ubicaciones")
           // console.log(ubicaciones)
            return ubicaciones
        } catch (error) {
            throw new Error(`Error conseguir ${error}`)
        }
    },
    /*
    SELECT id FROM relaciones.ubicacion WHERE cliente_nr_id = 19 ORDER BY id DESC LIMIT 1
    SELECT zona_trabajo_id FROM personal.administrador as pa inner join personal.empleado as pe on pa.id=pe.administrador_id where pe.id=18
    select * from relaciones.ubicacion where cliente_nr_id=19
    update relaciones.ubicacion set zona_trabajo_id=$1 where id=181 --zona_trabajo_id aqui le paso la zona id, sería de la primera consulta el id=181 
    */
    getUbicacionesClienteNR : async(clienteNRID) => {
        try {
            const ubicacion = await db_pool.oneOrNone('SELECT id FROM relaciones.ubicacion WHERE cliente_nr_id = $1 ORDER BY id DESC LIMIT 1',[clienteNRID])
            return ubicacion
        } catch (error) {
            throw new Error(`Error conseguir id ${error}`)
        }
    },


    updateRelacionesUbicacion : async(empleadoID,idRelacionUbicacion) => {
        try{
            //Este endpoint es para actualizar los pedidos para clientes no Registrados
            const zonatrabajoid = await db_pool.one(`SELECT zona_trabajo_id FROM personal.administrador AS pa
                INNER JOIN personal.empleado AS pe ON pa.id=pe.administrador_id WHERE pe.id=$1`,[empleadoID])//sacamos el zona_trabajo_id de empleado
            //console.log("Esta es Zona de Trabajo Empleado")
            //console.log(zonatrabajoid)
            const ubicacion = await db_pool.one(`UPDATE relaciones.ubicacion SET zona_trabajo_id=$1 
                WHERE id=$2 RETURNING *`,[zonatrabajoid.zona_trabajo_id,idRelacionUbicacion])//Aca se le esta pasando id de la relacion de ubicacion para actualizar el campo zona de trabajo
            //console.log("Esta es la zona de trabajo actualizada")
            //console.log(ubicacion)
            return ubicacion

        }catch(error){
            throw new Error(`Error update ${error}`)
        }
    },
    deleteRelacionesUbicacion : async(idUbicacion) =>{
        try {
            const resultado = await db_pool.result(`DELETE FROM relaciones.ubicacion WHERE id = $1`,[idUbicacion])
            return resultado.rowCount === 1
        } catch (error) {
            throw new Error(`Error en la eliminacion de ubicacion: ${error.message}`)
        }
    },
    handlePedidoAceptado: async (pedidoId, conductorId) => {
        try {
            // 1. Eliminar de ambas colas
            if (channel) {
                // Eliminar de la cola principal
                await deletePedidoFromQueue(pedidoId, MAIN_QUEUE);
                // Eliminar de la cola de backup
                await deletePedidoFromQueue(pedidoId, BACKUP_QUEUE);
            }

            // 2. Notificar a todos los clientes conectados
            io.emit('pedidoTomado', {
                pedidoId: pedidoId,
                conductorId: conductorId,
                success: true
            });

            return { success: true };
        } catch (error) {
            console.error('Error al manejar pedido aceptado:', error);
            // Notificar error a los clientes
            io.emit('pedidoTomadoError', {
                pedidoId: pedidoId,
                error: error.message
            });
            throw error;
        }
    }
};


initRabbitMQ();

export default modelUbicacion
export { initRabbitMQ, getAllBackupMessages };
