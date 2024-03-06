import { db_pool } from "../config.mjs";


const modelVehiculo = {

    createVehiculo: async (vehiculo) => {
        try {
            const vehiculo = await db_pool.one(`
            INSERT INTO ventas.vehiculo 
            (nombre_modelo,placa,administrador_id)
             VALUES($1,$2,$3) RETURNING *`,
                [vehiculo.nombre_modelo, vehiculo.placa,])
            return vehiculo

        } catch (error) {
            throw new Error(`error query ${error}`)
        }
    },
    getVehiculo: async () => {
        try {
            const getvehiculos = await db_pool.any(`
            SELECT * FROM ventas.vehiculo;
            `)
            return getvehiculos
        } catch (error) {
            throw new Error(`error query ${error}`)
        }
    },
   
}

export default modelVehiculo;