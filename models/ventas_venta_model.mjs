import { request } from "express";
import { db_pool } from "../config.mjs";


const modelVenta = {
  
    createVenta:async (archivo) => {
        try {
           
            await db_pool.one('INSERT INTO ventas.venta(foto) VALUES($1) RETURNING *',
            [archivo])

            return "foto subida exitosamente !"

        } catch (error) {
            throw new Error(`No se encontró registro con ese ID:${error}`)
        }
    }
}

export default modelVenta;