import { db_pool } from "../config.mjs";
import { io } from '../index.mjs';

console.log("--------# 14.0 ruta")


const modelRuta = {
    getAllRutaEmpleado: async (empleado_id) => {
        try {

            // Obtener la fecha actual en la zona horaria local del servidor
            const now = new Date();
            console.log('Fecha actual en servidor:', now);

            const allrutas = await db_pool.any(`
                SELECT vr.id,pc.nombres,vv.nombre_modelo,vr.fecha_creacion
FROM ventas.ruta AS vr
inner join personal.conductor as pc on vr.conductor_id = pc.id
inner join ventas.vehiculo as vv on vr.vehiculo_id = vv.id
WHERE DATE(fecha_creacion) = CURRENT_DATE and vr.empleado_id = $1`,
                [empleado_id])
            //console.log(allrutas)
            if (allrutas.length === 0) {
                //  console.log("aqui")
                return { message: 'No hay rutas de este empleado' }
            }
            else {
                //  console.log("todavia")
                return { data: allrutas }
            }
        } catch (error) {
            throw new Error(`Error conseguir rutas empleado ${error}`)
        }
    },
    getAllRutaEmpleadoDesktop: async () => {
        try {

            // Obtener la fecha actual en la zona horaria local del servidor
            const now = new Date();
            console.log('Fecha actual en servidor:', now);

            const allrutas = await db_pool.any(`
               SELECT *
FROM ventas.ruta AS vr
WHERE DATE(fecha_creacion) = CURRENT_DATE`
            )
            //console.log(allrutas)
            if (allrutas.length === 0) {
                //  console.log("aqui")
                return { message: 'No hay rutas de este empleado' }
            }
            else {
                //  console.log("todavia")
                return { data: allrutas }
            }
        } catch (error) {
            throw new Error(`Error conseguir rutas empleado ${error}`)
        }
    },

    getPedidosByruta: async (ruta_id) => {
        try {

            //console.log("---HOLAAA DENTRO DE Pruta->>>", ruta_id)
            const pedidos = await db_pool.any(`
                SELECT 
                    p.id AS pedido_id,
                    p.ruta_id,
                    COALESCE(c.nombre, cnr.nombre) AS nombre_cliente,
                    COALESCE(c.apellidos, cnr.apellidos) AS apellidos_cliente,
                    COALESCE(c.telefono, cnr.telefono) AS telefono_cliente,
                    p.total,
                    p.fecha,
                    p.tipo,
                    p.estado,
                    rub.distrito,
                    rub.direccion,
                    rub.latitud,
                    rub.longitud
                FROM 
                    ventas.pedido p
                LEFT JOIN 
                    ventas.cliente c ON p.cliente_id = c.id
                LEFT JOIN 
                    ventas.cliente_noregistrado cnr ON p.cliente_nr_id = cnr.id
                LEFT JOIN
                    relaciones.ubicacion rub ON p.ubicacion_id= rub.id
                WHERE 
                    p.ruta_id = $1
                ORDER BY 
                p.id ASC;`,
                [ruta_id]);
            //  console.log("ultima ruta")
            // console.log(lastRuta)
            return pedidos
        } catch (error) {
            throw new Error(`Error al conseguir pedidos ruta ${error}`)
        }
    },


    createRuta: async (ruta) => {
        try {


            const rutas = await db_pool.one('INSERT INTO ventas.ruta (conductor_id,vehiculo_id,empleado_id,distancia_km,tiempo_ruta,fecha_creacion) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
                [ruta.conductor_id, ruta.vehiculo_id, ruta.empleado_id, ruta.distancia_km, ruta.tiempo_ruta, ruta.fecha_creacion]);
            

            //EMITIR UN EVENTO
            io.emit('creadoRuta', rutas)

            return rutas

        }
        catch (e) {
            throw new Error(`Error query create:${e}`)
        }
    },



    getLastRuta: async (empleado_id) => {
        try {
            const lastRuta = await db_pool.one('SELECT id FROM ventas.ruta WHERE empleado_id = $1 ORDER BY id  DESC LIMIT 1',
                [empleado_id])
            //  console.log("ultima ruta")
            // console.log(lastRuta)
            return lastRuta
        } catch (error) {
            throw new Error(`Error query create:${error}`)
        }
    },
    getLastRutaAll: async () => {
        try {
            const lastRuta = await db_pool.one('SELECT id FROM ventas.ruta ORDER BY id  DESC LIMIT 1')
            //  console.log("ultima ruta")
            // console.log(lastRuta)
            return lastRuta
        } catch (error) {
            throw new Error(`Error query create:${error}`)
        }
    },
    getLastRutaConductor: async (conductor_id) => {
        try {
            const lastRuta = await db_pool.one(`SELECT vr.id, vr.conductor_id,
             vr.vehiculo_id, vr.empleado_id, vv.administrador_id,
              vr.fecha_creacion, vv.nombre_modelo, vv.placa
               FROM ventas.ruta as vr 
               inner join ventas.vehiculo as vv on vr.vehiculo_id=vv.id WHERE conductor_id = $1 ORDER BY vr.id  DESC LIMIT 1`,
                [conductor_id])
            return lastRuta
        } catch (error) {
            throw new Error(`Error query create:${error}`)
        }
    },
    getpedidosfecharuta: async (conductor, fecha) => {
        try {
            const consulta = await db_pool.any(`
                SELECT vp.id,vp.ruta_id,
                vp.subtotal,vp.descuento,vp.total,
                vp.fecha,vp.tipo,vp.estado,
                vp.observacion,vp.tipo_pago
                 FROM ventas.pedido as vp inner join ventas.ruta as vr on vp.ruta_id = vr.id
                WHERE conductor_id = $1 AND DATE(fecha_creacion) = $2
                ORDER BY vp.id ASC`, [conductor, fecha.fecha_ruta])
            console.log(consulta)
            return consulta
        } catch (error) {
            throw new Error(`Error query ${error}`)
        }
    }


}
export default modelRuta;