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
        console.log("---dentro de get ---")
        try {
            const getVehiculoProductos = await db_pool.any(`
            SELECT * FROM ventas.vehiculo_producto;`)
            //select vvp.id, producto_id,stock_movil from ventas.vehiculo as vv inner join ventas.vehiculo_producto as vvp on vvp.vehiculo_id=vv.id where vehiculo_id=1
            console.log("----vehiculo...prod")
            console.log(getVehiculoProductos)
            return getVehiculoProductos

        } catch (error) {
            throw new Error(`error query ${error}`)
        }
    },
    getVehiculoProductConductor: async (idconductor) => {
        console.log("--cond vehiculo producto---")

        try {
            const getVPconductor = await db_pool.any(
                `select * from ventas.vehiculo_producto
                 where vehiculo_id =
                  (select vehiculo_id from ventas.ruta where conductor_id= $1
                     order by id desc limit 1
                    );`, [idconductor]
            )
            return getVPconductor
        } catch (error) {
            throw new Error(`error query ${error}`)
        }

    },
    getProductoVehiculo: async (vehiculoID) => {
        console.log("---dentro de get ---")
        try {
            const getVehiculoProductos = await db_pool.any(`
            select vvp.id, producto_id,stock from ventas.vehiculo as vv inner join ventas.vehiculo_producto as vvp on vvp.vehiculo_id=vv.id where vehiculo_id=$1`, [vehiculoID])

            console.log("----vehiculo...prod")
            console.log(getVehiculoProductos)
            return getVehiculoProductos

        } catch (error) {
            throw new Error(`error query ${error}`)
        }
    },
    updateVehiculoProductStocks: async (id, stock) => {
        // SUBCONSULTA DEL SELECT HACIA EL UPDATE
        // DONDE DEVOLVERA EL ULTIMO VEHICULO Q SE LE ASIGNO A ESE
        // CONDUCTOR
        try {
            const updateVehiculoProduct = await db_pool.manyOrNone(`
        UPDATE ventas.vehiculo_producto SET stock =
         CASE 
         WHEN producto_id = 1 THEN $1
          WHEN producto_id = 2 THEN $2
          WHEN producto_id = 3 THEN $3
          WHEN producto_id = 4 THEN $4
          WHEN producto_id = 5 THEN $5

        ELSE stock
        END
        WHERE vehiculo_id = (
            SELECT vehiculo_id FROM ventas.ruta WHERE 
            conductor_id = $6 ORDER BY id DESC LIMIT 1
        )`,
                [
                    stock.stock1,
                    stock.stock2,
                    stock.stock3,
                    stock.stock4,
                    stock.stock5,
                    id])
            console.log(".....")
            console.log(updateVehiculoProduct)
            return updateVehiculoProduct

        } catch (error) {
            throw new Error(`error query ${error}`)
        }
    },
    updateVehiculoStockEmpleado:async (id,stock)=>{
        try {
            const updateVSE = await db_pool.manyOrNone(
            ` UPDATE ventas.vehiculo_producto SET stock_movil_conductor =
            CASE 
            WHEN producto_id = 1 THEN $1
             WHEN producto_id = 2 THEN $2
             WHEN producto_id = 3 THEN $3
             WHEN producto_id = 4 THEN $4
             WHEN producto_id = 5 THEN $5
   
           ELSE stock_movil_conductor
           END
           WHERE vehiculo_id = $1`, [
            stock.stock1,
            stock.stock2,
            stock.stock3,
            stock.stock4,
            stock.stock5,
            id])
            return updateVSE

            
        } catch (error) {
            throw new Error (`error query ${error}`)
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