import { db_pool } from "../config.mjs";

const modelZonaTrabajo = { 
    createZona :async(zona) => {
        
        try {
            const ubicaciones = await db_pool.one('INSERT INTO ventas.zona_trabajo(nombre,ubicacion,poligono,departamento,provincia) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [zona.nombre,zona.ubicacion,zona.poligono,zona.departamento,zona.provincia])
            return ubicaciones

        } catch (error) {
            throw new Error(`Error de inserción : ${error}`)
        }
       

    },
    getZona : async() => {
        try {
            const zona = await db_pool.any('SELECT * FROM ventas.zona_trabajo')
            console.log("zonas")
            console.log(zona)
            return zona
        } catch (error) {
            throw new Error(`Error conseguir ${error}`)
        }
    },
}
export default modelZonaTrabajo