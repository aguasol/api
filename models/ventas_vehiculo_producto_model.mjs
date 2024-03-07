import { db_pool } from "../config.mjs";

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
    getProductoVehiculo: async (vehiculoID) => {
        console.log("---dentro de get ---")
        try {
            const getVehiculoProductos = await db_pool.any(`
            select vvp.id, producto_id,stock from ventas.vehiculo as vv inner join ventas.vehiculo_producto as vvp on vvp.vehiculo_id=vv.id where vehiculo_id=$1`,[vehiculoID])
            
            console.log("----vehiculo...prod")
            console.log(getVehiculoProductos)
            return getVehiculoProductos

        } catch (error) {
            throw new Error(`error query ${error}`)
        }
    },
    updateVehiculoProduct: async (id, stock) => {
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
        WHERE vehiculo_id = $6 RETURNING *`,
         [stock.stock1, stock.stock2, stock.stock3, stock.stock4,stock.stock5, id])
         console.log(".....")
         console.log(updateVehiculoProduct)
            return updateVehiculoProduct

        } catch (error) {
            throw new Error(`error query ${error}`)
        }
    },
    updateVehiculoProductCond: async (id, stock) => {
        try {
            const updateVehiculoProduct = await db_pool.manyOrNone(`
        UPDATE ventas.vehiculo_producto SET stock_movil_conductor =
         CASE 
         WHEN producto_id = 1 THEN $1
          WHEN producto_id = 2 THEN $2
          WHEN producto_id = 3 THEN $3
          WHEN producto_id = 4 THEN $4
          WHEN producto_id = 5 THEN $5
          HEN producto_id = 6 THEN $6

        ELSE stock_movil_conductor
        END
        WHERE vehiculo_id = $7 RETURNING *`,
         [stock.stock1, stock.stock2, stock.stock3, stock.stock4,stock.stock5,stock.stock6, id])
         console.log(".....")
         console.log(updateVehiculoProduct)
            return updateVehiculoProduct

        } catch (error) {
            throw new Error(`error query ${error}`)
        }
    },

}
export default modelVehiculoProduct