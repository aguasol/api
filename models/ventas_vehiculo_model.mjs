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
    getVehiculo: async (id) => {
        try {

            // PRIMERO DEBEMOS TRAER EL ADMIN DEL EMPLEADO QUE SE ESTÁ REGISTRANDO
            const adminEmpleado = await db_pool.one(`
            SELECT administrador_id FROM personal.empleado WHERE id = $1`,[id])

            const getvehiculos = await db_pool.any(`
            SELECT * FROM ventas.vehiculo WHERE administrador_id = $1;
            `,[adminEmpleado])
            return getvehiculos
        } catch (error) {
            throw new Error(`error query ${error}`)
        }
    },
   
}

export default modelVehiculo;