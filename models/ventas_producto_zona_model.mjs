import { db_pool } from "../config.mjs";

console.log("--------# 12.0 producto zona")

const modelProductoZona = {
    createProductoZona:async (productozona) => {
        console.log("Sasdfasdfasd")

        try{
            const ProductoZone = await db_pool.oneOrNone(
                `INSERT INTO ventas.producto_zona (zona_trabajo_id,producto_id,stock_padre)
            VALUES($1,$2,$3) RETURNING *`,
                [productozona.zona_trabajo_id,productozona.producto_id,productozona.stock_padre])
           
            console.log("---producto zone---")
            console.log(ProductoZone)
            return ProductoZone
          
           
        }
        catch(e){
            throw new Error(`Error query create:${e}`)
        }
    },
    getProductoZona:async () => {
        try {
            const getProductZone = await db_pool.any(`
            SELECT * FROM ventas.producto_zona`)
            return getProductZone
        } catch (error) {
            throw new Error(`Error query get ${error}`)
        }
    },
    getProductoPorZona:async (empleadoID) => {
        try {
            const getProductZone = await db_pool.any(`
            SELECT vpz.id, vpz.zona_trabajo_id, vpz.producto_id, vpz.stock_padre FROM ventas.producto_zona as vpz  inner join personal.administrador as pa on pa.zona_trabajo_id= vpz.zona_trabajo_id inner join personal.empleado as pe on pe.administrador_id=pa.id where pe.id=$1`,[empleadoID])
            return getProductZone
        } catch (error) {
            throw new Error(`Error query get ${error}`)
        }
    }
}
export default modelProductoZona;