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
    updateVehiculoProductoXEmpleado : async (idproducto,idvehiculo,stock) => {
      //  console.log("updae x emple")
        try {
            const updateXempleado = await db_pool.manyOrNone(
                `UPDATE ventas.vehiculo_producto SET stock_movil_conductor = $1 
                WHERE producto_id = $2 and vehiculo_id = $3 RETURNING *`,
                [stock.stockproducto,idproducto,idvehiculo]
            )

            const stock_movil_cond = updateXempleado.stock_movil_conductor
            console.log("stock movil cond")
            console.log(stock_movil_cond)
            console.log("....")
            console.log(updateXempleado)

            const updateStockVehiculo = await db_pool.manyOrNone(
                `UPDATE ventas.vehiculo_producto SET stock=stock + $1 WHERE producto_id = $2
                AND vehiculo_id = $3 RETURNING *`,[stock_movil_cond,idproducto,idvehiculo]
            )
            return updateXempleado
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