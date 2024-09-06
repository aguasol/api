import { db_pool } from "../config.mjs";

const modelAlmacen = {
    getAlmacen : async () =>{
        try {
            const resultado = await db_pool.any(`
                SELECT * FROM ventas.almacen`)
            return resultado
        } catch (error) {
            throw new Error(`Error query almacen ${error}`)
        }
    }
}

export default modelAlmacen;