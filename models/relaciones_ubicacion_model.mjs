import { db_pool } from "../config.mjs";

const modelUbicacion = { 
    createUbicacion :async(ubicacion) => {
        
        try {
            const ubicaciones = await db_pool.one('INSERT INTO relaciones.ubicacion(latitud,longitud,direccion,cliente_id,cliente_nr_id,distrito,zona_trabajo_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [ubicacion.latitud,ubicacion.longitud,ubicacion.direccion,ubicacion.cliente_id,ubicacion.cliente_nr_id,ubicacion.distrito,ubicacion.zona_trabajo_id])
            return ubicaciones

        } catch (error) {
            throw new Error(`Error de inserción : ${error}`)
        }
       

    },
    getUbicacion : async() => {
        try {
            const ubicaciones = await db_pool.any('SELECT * FROM relaciones.ubicacion')
            console.log("ubicaciones")
            console.log(ubicaciones)
            return ubicaciones
        } catch (error) {
            throw new Error(`Error conseguir ${error}`)
        }
    },
    getUbicacionesCliente : async(clienteID) => {
        console.log("----------LLEGO EL CLIENTE_ID----------------------------")
        try {
            const ubicaciones = await db_pool.any('SELECT * FROM relaciones.ubicacion WHERE cliente_id = $1',[clienteID])
            console.log("ubicaciones")
            console.log(ubicaciones)
            return ubicaciones
        } catch (error) {
            throw new Error(`Error conseguir ${error}`)
        }
    },
    getUbicacionesClienteNR : async(clienteNRID) => {
        try {
            const ubicacion = await db_pool.oneOrNone('SELECT id FROM relaciones.ubicacion WHERE cliente_nr_id = $1 ORDER BY id DESC LIMIT 1',[clienteNRID])
            return ubicacion
        } catch (error) {
            throw new Error(`Error conseguir id ${error}`)
        }
    }
}
export default modelUbicacion