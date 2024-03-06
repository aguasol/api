import { Socket } from "socket.io";
import { db_pool } from "../config.mjs";
import { io } from '../index.mjs';



const modelPedido = {
    createPedido: async (pedido) => {
        const paquete = await db_pool.connect();

        try {
            //  console.log("-----PEDIDOO recibidoooo------")
            // console.log(pedido)
            // const io = await app_sol.get('io');
            console.log("-----PEDIDO INSERTADO-------")
            if (pedido.cliente_id) {
                // Si cliente_id existe, es un cliente registrado
                const resultado = await paquete.tx(async (t) => {
                    const pedidos_cr = await t.one(`INSERT INTO ventas.pedido (cliente_id, subtotal,descuento,total, fecha, tipo, estado,ubicacion_id,observacion)
                        VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9)
                        RETURNING *
                        `, [pedido.cliente_id, pedido.subtotal, pedido.descuento, pedido.total, pedido.fecha, pedido.tipo, pedido.estado, pedido.ubicacion_id, pedido.observacion]);

                    console.log("pedidos cr");
                    console.log(pedidos_cr);
                    console.log(pedidos_cr.id);

                    const pedidoss = await t.one(`SELECT vp.id, vp.subtotal, vp.descuento, vp.total, vp.ruta_id, vp.fecha, vp.estado, vp.tipo, vp.observacion,
                        vc.nombre, vc.apellidos, vc.telefono, rub.latitud, rub.longitud, rub.distrito
                        FROM ventas.pedido as vp
                        FULL JOIN ventas.cliente as vc ON vp.cliente_id = vc.id
                        FULL JOIN relaciones.ubicacion as rub ON vp.ubicacion_id = rub.id
                        WHERE estado = \'pendiente\' AND vp.id = $1;
                        `, [pedidos_cr.id]);

                    // PEDIDOS SOCKET
                    console.log('nuevoPedido Emitido');
                    io.emit('nuevoPedido', pedidoss);

                    return pedidoss;

                })
                const existCodigo = await db_pool.oneOrNone(`SELECT codigo FROM ventas.cliente WHERE codigo=$1`, [pedido.codigo]);
                console.log(existCodigo.codigo)
                if (existCodigo.codigo) {
                    console.log('si existe')
                    const saldo = await db_pool.oneOrNone(`SELECT saldo_beneficios FROM ventas.cliente WHERE codigo=$1`, [
                        existCodigo.codigo
                    ])
                    const nuevoSaldo = saldo.saldo_beneficios + (3 * pedido.cantidad_bidones)

                    await db_pool.oneOrNone(`UPDATE ventas.cliente SET saldo_beneficios= $1 WHERE codigo = $2`, [nuevoSaldo, existCodigo.codigo])

                }

                console.log(resultado)
                return resultado


            } else {
                const resultado = await paquete.tx(async (t) => {
                    // Si cliente_id es nulo, es un cliente no registrado
                    const pedidos_nr = await t.one(`INSERT INTO ventas.pedido (cliente_nr_id, subtotal,descuento,total, fecha, tipo, estado,observacion, ubicacion_id)
                        VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9)
                        RETURNING *`,
                        [pedido.cliente_nr_id, pedido.subtotal, pedido.descuento, pedido.total, pedido.fecha, pedido.tipo, pedido.estado, pedido.observacion, pedido.ubicacion_id]);
                    console.log("pedidos nr");
                    console.log(pedidos_nr);

                    const pedidoss = await t.one(`SELECT vp.id,vp.subtotal,vp.descuento,vp.total,vp.ruta_id,vp.fecha,vp.estado,vp.tipo,vp.observacion,vcnr.nombre,vcnr.apellidos,vcnr.telefono,rub.latitud,rub.longitud,rub.distrito
                        FROM ventas.pedido as vp
                        FULL JOIN ventas.cliente_noregistrado as vcnr ON vp.cliente_nr_id = vcnr.id
                        FULL JOIN relaciones.ubicacion as rub ON vp.ubicacion_id = rub.id
                        WHERE estado =  \'pendiente\' and vp.id=$1`, [pedidos_nr.id]);

                    // PEDIDOS SOCKET
                    io.emit('nuevoPedido', pedidoss)
                    return pedidoss
                })
                return resultado

            }


        }
        catch (e) {
            throw new Error(`Error query create:${e}`)
        }
    },
    getLastPedido: async (id) => {
        try {
            const lastPedido = await db_pool.one('SELECT id FROM ventas.pedido WHERE cliente_id=$1 ORDER BY id DESC LIMIT 1', [id]);
            return lastPedido;
        } catch (e) {
            throw new Error(`Error getting last pedido: ${e}`);
        }
    },

    getPedido: async () => {
        console.log("dentro de get para conductores")

        try {
            const pedidos = await db_pool.any(`
            SELECT
                vp.id,
                vp.subtotal,
                vp.descuento,
                vp.total,
                vp.ruta_id,
                vp.fecha,
                vp.estado,
                vp.tipo,
                vp.observacion,
                rub.latitud,
				rub.longitud,
                rub.distrito,
                COALESCE(vc.nombre, vcnr.nombre) as nombre,
                COALESCE(vc.apellidos, vcnr.apellidos) as apellidos,
                COALESCE(vc.telefono, vcnr.telefono) as telefono
                
            FROM
                ventas.pedido as vp
            LEFT JOIN ventas.cliente as vc ON vp.cliente_id = vc.id
            LEFT JOIN ventas.cliente_noregistrado as vcnr ON vp.cliente_nr_id = vcnr.id
            LEFT JOIN relaciones.ubicacion as rub ON vp.ubicacion_id = rub.id
            WHERE estado = \'pendiente\' ORDER BY vp.id ASC;`);

            console.log(pedidos)
            return pedidos


        } catch (error) {
            throw new Error(`Error getting pedido: ${error}`)
        }
    },

    getPedidoEmpleado: async (empleadoID) => {
        try {
            console.log("empleado id")
            console.log(empleadoID)
            const pedidos = await db_pool.any(`select
            vr.id as idruta,
            vp.id as npedido,
            vp.estado,
            vp.tipo,
            vp.fecha,
            vp.total,
            pc.nombres,
            vv.nombre_modelo as vehiculo
            from ventas.ruta as vr
            inner join ventas.pedido as vp on vr.id=vp.ruta_id
            inner join ventas.vehiculo as vv on vr.vehiculo_id=vv.id
            inner join personal.conductor as pc on vr.conductor_id = pc.id
            inner join personal.empleado as pe on vr.empleado_id = pe.id
            where pe.id=$1`, [empleadoID])
            console.log("pedidos")
            console.log(pedidos)
            return pedidos
        } catch (error) {
            throw new Error(`Error getting pedido ${error}`)
        }
    },

    getPedidoConductor: async (rutaID, conductorID) => {
        console.log("dentro de get Pedidos para Conductores....")

        try {
            const pedidos = await db_pool.any(`
            SELECT 
            vp.id, 
            vp.tipo_pago,
            vp.total, 
            vp.fecha, 
            vp.estado,
            vp.tipo, 
            vp.observacion, 
            COALESCE(vc.nombre, vcnr.nombre) as nombre,
            COALESCE(vc.apellidos, vcnr.apellidos) as apellidos,
            COALESCE(vc.telefono, vcnr.telefono) as telefono,
            rub.latitud,
			rub.longitud,
            rub.direccion
            FROM ventas.ruta as vr
            INNER JOIN ventas.pedido as vp ON vr.id = vp.ruta_id
            LEFT JOIN ventas.cliente as vc ON vp.cliente_id = vc.id
            LEFT JOIN ventas.cliente_noregistrado as vcnr ON vp.cliente_nr_id = vcnr.id
            LEFT JOIN relaciones.ubicacion as rub ON vp.ubicacion_id = rub.id
                WHERE ruta_id=$1 and conductor_id=$2`, [rutaID, conductorID]);
            console.log(pedidos)
            return pedidos

        } catch (error) {
            throw new Error(`Error getting pedido: ${error}`)
        }
    },
    getPedidosCliente: async (clienteID) => {
        console.log("dentro de get Pedidos para Clientes....")

        try {
            const pedidos = await db_pool.any(`SELECT vp.id, vp.estado, vp.subtotal,  vp.descuento, vp.total, vp.tipo_pago, vp.tipo, vp.fecha, rub.direccion, rub.distrito FROM ventas.pedido as vp INNER JOIN relaciones.ubicacion AS rub ON rub.id=vp.ubicacion_id WHERE vp.cliente_id=$1`, [clienteID]);
            console.log(pedidos)
            return pedidos

        } catch (error) {
            throw new Error(`Error getting pedido: ${error}`)
        }
    },

    deletePedido: async (id) => {
        try {
            const result = await db_pool.result('DELETE FROM ventas.pedido WHERE ID = $1', [id]);
            return result.rowCount === 1; // Devuelve true si se eliminó un registro, false si no se encontró el registro
        } catch (error) {
            throw new Error(`Error en la eliminación del pedido: ${error.message}`);
        }
    },

    updateEstadoPedido: async (pedidoID, newDatos) => {

        try {
            console.log('entro a update')
            const result = await db_pool.oneOrNone('UPDATE ventas.pedido SET estado = $1,foto=$2,observacion=$3,tipo_pago=$4 WHERE id = $5 RETURNING *',
                [newDatos.estado, newDatos.foto, newDatos.observacion, newDatos.tipo_pago, pedidoID]);

            if (!result) {
                throw new Error(`No se encontró un pedido con ID ${id}.`);
            }
            return result
        } catch (error) {
            throw new Error(`Error en la actualización del pedido: ${error.message}`);
        }
    },
    updateRutaPedido: async (id, ruta) => {
        try {
            const result = await db_pool.oneOrNone('UPDATE ventas.pedido SET ruta_id = $1,estado = $2 WHERE id = $3 RETURNING *',
                [ruta.ruta_id, ruta.estado, id]);
            if (!result) {
                return { "Message": "No se encontró un pedido con ese ID" }
            }
            io.emit("ruteando", true)
            return { result }

        } catch (error) {
            throw new Error(`Error en la actualización del pedido: ${error.message}`)
        }
    },

}

export default modelPedido;
