import { db_pool } from "../config.mjs";
import { io } from '../index.mjs';



const modelProductoPromocion = {
    createProductoPromocion:async (relacion) => {
        try{
            // const io = await app_sol.get('io');
            const relaciones = await db_pool.one('INSERT INTO relaciones.producto_promocion (promocion_id,producto_id,cantidad) VALUES ($1,$2,$3) RETURNING *',
            [relacion.promocion_id,relacion.producto_id,relacion.cantidad]);
            // const io = app_sol.get(io);
            //EMITIR UN EVENTO
            io.emit('nuevaRelacion',relaciones)
            return relaciones
        }
        catch(e){
            throw new Error(`Error query create:${e}`)
        }
    },

    getProductoPromocion: async ()=> {
        console.log("id llego")
        try {
            const relaciones = await db_pool.any('SELECT id,promocion_id,producto_id,cantidad FROM relaciones.producto_promocion');
            return relaciones

        } catch (error) {
            throw new Error(`Error getting relacion producto-promocion: ${error}`)
        }
    },

    getUNProductoPromocion: async (promocion_id)=> {
        console.log("----------LLEGO LA PROMOCION_ID.----------------------------")
        try {
            const relaciones = await db_pool.any('SELECT promocion_id,producto_id,cantidad FROM relaciones.producto_promocion WHERE promocion_id=$1',[promocion_id]);
            return relaciones

        } catch (error) {
            throw new Error(`Error getting relacion producto-promocion: ${error}`)
        }
    },

    deleteProductoPromocion: async (id) => {
        try {
            const result = await db_pool.result('DELETE FROM relaciones.producto_promocion WHERE ID = $1', [id]);
            return result.rowCount === 1; // Devuelve true si se eliminó un registro, false si no se encontró el registro
        } catch (error) {
            throw new Error(`Error en la eliminación de la relacion producto-promocion: ${error.message}`);
        }
    },
    
    updateProductoPromocion: async (id, relacion) => {

        try {
            const result = await db_pool.oneOrNone('UPDATE relaciones.producto_promocion SET promocion_id=$1, producto_id=$2,cantidad=$3 WHERE id = $4 RETURNING *',
                [relacion.promocion_id,relacion.producto_id,relacion.cantidad,id]);

            if (!result) {
                throw new Error(`No se encontró una relacion producto-promocion con ID ${id}.`);
            }
            return { result }
        } catch (error) {
            throw new Error(`Error en la actualización de la relacion producto-promocion: ${error.message}`);
        }
    },
}

export default modelProductoPromocion;
