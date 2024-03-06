import { db_pool } from "../config.mjs";
import { io } from '../index.mjs';



const modelPromocion = {
    createPromocion:async (promocion) => {
        try{
            // const io = await app_sol.get('io');
            const promociones = await db_pool.one('INSERT INTO ventas.promocion (nombre,precio,descripcion,fecha_inicio,fecha_limite,foto) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            [promocion.nombre,promocion.precio,promocion.descripcion,promocion.fecha_inicio,promocion.fecha_limite,promocion.foto]);
            // const io = app_sol.get(io);
            //EMITIR UN EVENTO
            io.emit('nuevaPromocion',promociones)
            return promociones
        }
        catch(e){
            throw new Error(`Error query create:${e}`)
        }
    },

    getPromocion: async ()=> {
        console.log("id llego")
        try {
            const promociones = await db_pool.any('SELECT id,nombre,precio,descripcion,fecha_inicio,fecha_limite,foto FROM ventas.promocion');
            return promociones

        } catch (error) {
            throw new Error(`Error getting promocion: ${error}`)
        }
    },

    deletePromocion: async (id) => {
        try {
            const result = await db_pool.result('DELETE FROM ventas.promocion WHERE ID = $1', [id]);
            return result.rowCount === 1; // Devuelve true si se eliminó un registro, false si no se encontró el registro
        } catch (error) {
            throw new Error(`Error en la eliminación de la promocion: ${error.message}`);
        }
    },
    
    updatePromocion: async (id, promocion) => {

        try {
            const result = await db_pool.oneOrNone('UPDATE ventas.promocion SET nombre=$1, precio=$2,descripcion=$3,fecha_inicio=$4,fecha_limite=$5, foto=$6 WHERE id = $7 RETURNING *',
                [promocion.nombre,promocion.precio,promocion.descripcion,promocion.fecha_inicio,promocion.fecha_limite,promocion.foto,id]);

            if (!result) {
                throw new Error(`No se encontró una promocion con ID ${id}.`);
            }
            return { result }
        } catch (error) {
            throw new Error(`Error en la actualización de la promocion: ${error.message}`);
        }
    },
}

export default modelPromocion;
