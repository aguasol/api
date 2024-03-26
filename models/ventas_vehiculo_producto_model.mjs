import { db_pool } from "../config.mjs";
console.log("--------# 16.0 vehiculo producto")

const modelVehiculoProduct = {
    createVehiculoProduct: async (vehiculoproducto) => {
        try {
            const vehiculoproducto = await db_pool.one(`
            INSERT INTO vehiculo_producto (producto_id,vehiculo_id,stock_movil)
            VALUES($1,$2,$3) RETURNING *`, [vehiculoproducto.producto_id, vehiculoproducto.vehiculo_i, vehiculoproducto.stock_movil])
            return vehiculoproducto

        } catch (error) {
            throw new Error(`error query ${error}`)
        }

    },
    getVehiculoProduct: async () => {
        //  console.log("---dentro de get ---")
        try {
            const getVehiculoProductos = await db_pool.any(`
            SELECT * FROM ventas.vehiculo_producto;`)
            //select vvp.id, producto_id,stock_movil from ventas.vehiculo as vv inner join ventas.vehiculo_producto as vvp on vvp.vehiculo_id=vv.id where vehiculo_id=1
            // console.log("----vehiculo...prod")
            // console.log(getVehiculoProductos)
            return getVehiculoProductos

        } catch (error) {
            throw new Error(`error query ${error}`)
        }
    },
    getVehiculoProductVehiculo: async (idvehiculo) => {
        //  console.log("--cond vehiculo producto---")

        try {
            const getVPconductor = await db_pool.any(
                `select * from ventas.vehiculo_producto
                 where vehiculo_id =$1 order by id asc
                  ;`, [idvehiculo]
            )
            return getVPconductor
        } catch (error) {
            throw new Error(`error query ${error}`)
        }

    },
    getProductoVehiculo: async (vehiculoID) => {
        // console.log("---dentro de get ---")
        try {
            const getVehiculoProductos = await db_pool.any(`
            select vvp.id, producto_id,stock from ventas.vehiculo as vv inner join ventas.vehiculo_producto as vvp on vvp.vehiculo_id=vv.id where vehiculo_id=$1`, [vehiculoID])

            // console.log("----vehiculo...prod")
            // console.log(getVehiculoProductos)
            return getVehiculoProductos

        } catch (error) {
            throw new Error(`error query ${error}`)
        }
    },
    // update Empleado
    updateVehiculoProductoXEmpleado: async (idempleado,idproducto, idvehiculo, stock) => {
        //  console.log("updae x emple")
        try {
            const updateXempleado = await db_pool.manyOrNone(
                `UPDATE ventas.vehiculo_producto SET stock_movil_conductor = $1 
                WHERE producto_id = $2 and vehiculo_id = $3 RETURNING *`,
                [stock.stockproducto, idproducto, idvehiculo]
            )
            if (updateXempleado.length > 0) {
                const stock_movil_cond = updateXempleado[0].stock_movil_conductor
                

                const updateStockVehiculo = await db_pool.manyOrNone(
                    `UPDATE ventas.vehiculo_producto SET stock=stock + $1,stock_movil_conductor=0 WHERE producto_id = $2
                    AND vehiculo_id = $3 RETURNING *`, [stock_movil_cond, idproducto, idvehiculo]
                )
                console.log("updateStock vehiculo")
                console.log(updateStockVehiculo)
                console.log(updateStockVehiculo[0].stock)

                // CONSEGUIR LA ZONA DE TRABAJO DEL TRABAJADOR
                const zonaId = await db_pool.any(`SELECT pa.zona_trabajo_id FROM personal.empleado pe
                INNER JOIN personal.administrador pa ON pe.administrador_id=pa.id WHERE pe.id = $1`,
                [idempleado])
                console.log("zona")
                console.log(zona)
                console.log(zona[0].zona_trabajo_id)

                const stockPadre = zonaId[0].zona_trabajo_id

                // ACTUALIZAR LA PRODUCTO ZONA DE ACUERDO AL PEDIDO
                

                const updateSTOCKzona = await db_pool.manyOrNone(
                    `UPDATE ventas.producto_zona SET stock_padre = stock_padre - $1 WHERE producto_id = $2 AND 
                    zona_trabajo_id=$3`,[updateStockVehiculo[0].stock,idproducto,stockPadre]
                )
                return updateStockVehiculo
            }

            
        } catch (error) {
            throw new Error(`error query : ${error}`)
        }
    },

    updateVehiculoProductCond: async (id, stock) => {
        try {
            const updateVehiculoProduct = await db_pool.manyOrNone(`
            UPDATE ventas.vehiculo_producto SET stock_movil_conductor = $1  where  producto_id=$2 and vehiculo_id=$3 returning *`,
                [stock.stock_movil_conductor, stock.producto_id, id])
            //fer
            console.log(".....")
            console.log(updateVehiculoProduct)
            return updateVehiculoProduct

        } catch (error) {
            throw new Error(`error query ${error}`)
        }
    },

}
export default modelVehiculoProduct