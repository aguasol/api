import { db_pool } from "../config.mjs";
console.log("--------# 15.0 vehiculo")


const modelVehiculo = {

    createVehiculo: async (vehiculo) => {
        try {
            console.log("vehiculo");
            console.log(vehiculo);
            const result = await db_pool.one(`
                INSERT INTO ventas.vehiculo 
                (nombre_modelo, placa, administrador_id)
                VALUES ($1, $2, $3)
                RETURNING *`,
                [vehiculo.nombre_modelo, vehiculo.placa, vehiculo.administrador_id]);
            // 
            console.log("---vehiculos---")
            console.log(result)
            const vehiculo_productos = await db_pool.manyOrNone(`
                INSERT INTO ventas.vehiculo_producto
                (producto_id, vehiculo_id, stock, stock_movil_conductor, stock_movil_empleado)
                VALUES 
                ($1, $2, $3, $4, $5),
                ($6, $7, $8, $9, $10),
                ($11, $12, $13, $14, $15),
                ($16, $17, $18, $19, $20),
                ($21, $22, $23, $24, $25)
                RETURNING *`,
                [
                    1, result.id, 0, 0, 0,
                    2, result.id, 0, 0, 0,
                    3, result.id, 0, 0, 0,
                    4, result.id, 0, 0, 0,
                    5, result.id, 0, 0, 0
                ]);
            
            console.log("-%%%%%%%%%%%%%%%%%%%%%%%%%%%-")
            console.log("----------salida creacion");

            console.log(vehiculo);
            console.log("------vehiculos_productos")
            return result;
        } catch (error) {
            throw new Error(`error query ${error}`);
        }
    },
    getVehiculo: async (id) => {
        try {
            console.log(id)
            // PRIMERO DEBEMOS TRAER EL ADMIN DEL EMPLEADO QUE SE ESTÁ REGISTRANDO
            const adminEmpleado = await db_pool.one(`
            SELECT administrador_id FROM personal.empleado WHERE id = $1`, [id])
            console.log("-----admin Empleado ")
            console.log(adminEmpleado)

            const getvehiculos = await db_pool.any(`
            SELECT * FROM ventas.vehiculo WHERE administrador_id = $1;
            `, [adminEmpleado.administrador_id])

            console.log("getvehiculos")
            console.log(getvehiculos)
            return getvehiculos
        } catch (error) {
            throw new Error(`error query ${error}`)
        }
    },
    getVehiculoAdmin: async (idadmin) => {
        try {
            console.log("get vehiculos admin", idadmin)
            const vehiculoAdmin = await db_pool.any(`
            SELECT * FROM ventas.vehiculo WHERE administrador_id =$1`,
                [idadmin])

            return vehiculoAdmin
        } catch (error) {
            throw new Error(`error query ${error}`)
        }
    },
    deleteVehiculoAdmin: async (id) => {
        try {
            const result = await db_pool.result(`
            DELETE FROM ventas.vehiculo WHERE ID = $1`,
                [id])
            return result.rowCount === 1;
        } catch (error) {
            throw new Error(`Error en la eliminación del vehiculo ${error}`)
        }
    }

}

export default modelVehiculo;