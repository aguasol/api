import { db_pool } from "../config.mjs";
import bcrypt from 'bcrypt';

//console.log("--------# 6.0 cliente")
const modelUserCliente = {
    createUserCliente: async (cliente) => {
        // const client = await db_pool.connect();
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
        try {
            //  console.log("cliente")
            // console.log(cliente)

            const UsuarioExistente = await db_pool.oneOrNone(`SELECT * FROM personal.usuario WHERE nickname=$1`,
                [cliente.nickname])
            //console.log("usuarioexistente")
            //console.log(UsuarioExistente)

            if (UsuarioExistente) {
                return { "message": "Usuario ya existente, intente otro por favor. " }
            }
            else {
                console.log("usuario nuevo")

                const hashedPassword = await bcrypt.hash(cliente.contrasena, 10);
                // Inicia una transacción
                // const result = await client.tx(async (t) => {
                const usuario = await db_pool.one('INSERT INTO personal.usuario (rol_id, nickname, contrasena, email, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                    [cliente.rol_id, cliente.nickname, hashedPassword, cliente.email, cliente.telefono]);

                //  console.log("usuario");
                // console.log(usuario);
                //  console.log("id usuario");
                // console.log(usuario.id);

                let code = '';

                for (let i = 0; i < 5; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    code += characters.charAt(randomIndex);
                }

                //   console.log("codigo....");
                //   console.log(code);


                const clientes = await db_pool.one('INSERT INTO ventas.cliente (usuario_id, nombre, apellidos, fecha_nacimiento, sexo, direccion, dni, codigo, saldo_beneficios, telefono, direccion_empresa, suscripcion, RUC, nombre_empresa, frecuencia,fecha_creacion_cuenta, quiereretirar, medio_retiro, banco_retiro, numero_cuenta) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *',
                    [usuario.id, cliente.nombre, cliente.apellidos, cliente.fecha_nacimiento, cliente.sexo, cliente.direccion, cliente.dni, code, 0.0, cliente.telefono, cliente.direccion_empresa, cliente.suscripcion, cliente.RUC, cliente.nombre_empresa, cliente.frecuencia, cliente.fecha_creacion_cuenta,
                    cliente.quiereretirar,
                    cliente.medio_retiro, cliente.banco_retiro, cliente.numero_cuenta]);

                //console.log("cliente");
                //console.log(clientes);

                return { usuario, clientes }
                // });
                // return result
            }
        }
        catch (e) {
            throw new Error(`Error query create:${e}`)
        }
    },
    updateUserCliente: async (id, cliente) => {

        try {
            const usuario = await db_pool.oneOrNone('UPDATE personal.usuario SET rol_id = $1, nickname = $2, contrasena = $3, email = $4 WHERE id = $5 RETURNING *',
                [cliente.rol_id, cliente.nickname, cliente.contrasena, cliente.email, id]);

            if (!usuario) {
                throw new Error(`No se encontró un usuario con ID ${id}.`);
            }

            const cliente1 = await db_pool.one('UPDATE ventas.cliente SET saldo_beneficios=$1, suscripcion=$2, frecuencia=$3, quiereretirar=$4 WHERE usuario_id = $5 RETURNING *',
                [cliente.saldo_beneficios, cliente.suscripcion, cliente.frecuencia, cliente.quiereretirar, id]);
            // console.log("dentro de model 2do update", id)
            return { usuario, administrador }
        } catch (error) {
            throw new Error(`Error en la actualización del administrador: ${error.message}`);
        }
    },
    updateCliente: async (id, cliente) => {
        try {
            const cliente1 = await db_pool.one('UPDATE ventas.cliente SET saldo_beneficios=$1, suscripcion=$2, frecuencia=$3, quiereretirar=$4, medio_retiro=$5, banco_retiro=$6, numero_cuenta=$7 WHERE id = $8 RETURNING *',
                [cliente.saldo_beneficios, cliente.suscripcion, cliente.frecuencia, cliente.quiereretirar, cliente.medio_retiro, cliente.banco_retiro, cliente.numero_cuenta, id]);
            //console.log("dentro de model 2do update", cliente1)
            return { cliente1 }
        } catch (error) {
            throw new Error(`Error en la actualización del administrador: ${error.message}`);
        }
    },
    //CLIENTES RECIENTES CAMBIO PATO
    getUsersCliente: async () => {
        try {
            const userClients = await db_pool.any(`select * from personal.usuario
                 inner join ventas.cliente on personal.usuario.id = ventas.cliente.usuario_id
                  order by personal.usuario.id desc;`)
            //console.log("show codigo---------------------------------");
            //console.log(userClients.codigo);
            return userClients
        } catch (e) {
            throw new Error(`Error query clients: ${e}`);
        }
    },
    getUsersClienteSaldo: async () => {
        //IMPLEMENTACION DE VISUALIZACION DE CLIENTES DE BILLETERA SOL
        try {
            const userClients = await db_pool.any(`SELECT
        ventas.cliente.id,
        ventas.cliente.nombre,
        ventas.cliente.apellidos,
        ventas.cliente.telefono,
        ventas.cliente.saldo_beneficios,
        ventas.cliente.quiereretirar,
        ventas.cliente.banco_retiro,
        ventas.cliente.numero_cuenta
    FROM
        ventas.cliente
    WHERE
        ventas.cliente.saldo_beneficios > 0;`)
            //console.log("show codigo---------------------------------");
            //console.log(userClients.codigo);
            return userClients
        } catch (e) {
            throw new Error(`Error query clients: ${e}`);
        }
    },
    //saldo cliente cambio
    updateSaldoCliente: async (id, cliente) => {
        try {
            //console.log(id,"ID")
            //console.log(cliente, "cliente")
            const result = await db_pool.one(`UPDATE ventas.cliente
                    SET saldo_beneficios = $1,
                    quiereretirar = $2 WHERE id= $3 RETURNING *`,
                [cliente.saldo_beneficios, cliente.quiereretirar, id]);
            //console.log("----------------------------")
            //console.log(result)
            return { result }
        } catch (error) {
            throw new Error(`Error en la actualización del cliente: ${error.message}`);
        }
    },


    deleteUserCliente: async (id) => {
        try {
            const result = await db_pool.result('DELETE FROM personal.usuario WHERE ID = $1', [id]);
            return result.rowCount === 1; // Devuelve true si se eliminó un registro, false si no se encontró el registro
        } catch (error) {
            throw new Error(`Error en la eliminación del cliente: ${error.message}`);
        }
    },
    existCodeCliente: async (codigo) => {
        // console.log("entro a EXISTTTT")
        try {
            const existCodigo = await db_pool.oneOrNone(`SELECT codigo, id, fecha_creacion_cuenta  FROM ventas.cliente WHERE codigo=$1`,
                [codigo.codigo]);
            // console.log(existCodigo.codigo)
            if (existCodigo) {
                //  console.log('si existe')
                existCodigo['existe'] = true
                return existCodigo
            }
            else {
                existCodigo['existe'] = false
                // console.log('no esistee')
                return existCodigo
            }

        } catch (error) {
            throw new Error(`Error query verify code ${error}`)
        }
    },
    getClienteRecuperacion: async (dato) => {
        //console.log("dentro model");
        try {
            const userClients = await db_pool.one(`SELECT * FROM personal.usuario WHERE email=$1 OR nickname=$2 OR telefono=$3`, [dato.info, dato.info, dato.info]);
            //console.log("dentro de recovery");
            //console.log(userClients);
            return userClients;
            /*
            if (userClients != null){
                
            } else{
                return {message:"Usuario no encontrado ni asociado"};
            }*/
        } catch (e) {
            throw new Error(`Error query clients recovery: ${e}`);
        }
    },
    updatePassword: async (clave, id) => {
        try {
            const hashedPassword = await bcrypt.hash(clave.clave, 10);
            const actual = await db_pool.one(`UPDATE personal.usuario SET contrasena=$1 WHERE id=$2 RETURNING *`, [hashedPassword, id]);
            //console.log(actual);
            return actual;
        } catch (e) {
            throw new Error(`Error recovery: ${e}`);
        }
    },
    getRecargas: async (id) => {
        try {
            const Recargas = await db_pool.oneOrNone(`select ventas.pedido.cliente_id,SUM(relaciones.detalle_pedido.cantidad) as recargas from relaciones.detalle_pedido 
            inner join ventas.pedido on relaciones.detalle_pedido.pedido_id = ventas.pedido.id where relaciones.detalle_pedido.producto_id = 2 and ventas.pedido.cliente_id = $1
            GROUP BY ventas.pedido.cliente_id`, [id])
            return Recargas
        } catch (e) {
            throw new Error(`Error recargas: ${e}`);
        }
    },
    getBidonNuevo: async (id) => {
        try {
            const getBidon = await db_pool.oneOrNone(`
                select vp.cliente_id as cliente,SUM(rdp.cantidad) as bidones from ventas.pedido as vp
                inner join relaciones.detalle_pedido as rdp on rdp.pedido_id=vp.id
                where rdp.producto_id = 1 and vp.cliente_id = $1 GROUP BY cliente;`, [id])
            return getBidon
        } catch (error) {
            throw new Error(`Error Bidones: ${e}`);
        }
    }
}
export default modelUserCliente;
