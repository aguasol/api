import { db_pool } from "../config.mjs";

const modelAlmacen = {
  getAlmacen: async () => {
    try {
      const resultado = await db_pool.any(`
                SELECT * FROM ventas.almacen`);
      return resultado;
    } catch (error) {
      throw new Error(`Error query almacen ${error}`);
    }
  },
  getDemoInfo: async (id) => {
    try {
      const resultado = await db_pool.any(
        `
                SELECT 
            ru.id, 
            ru.latitud, 
            ru.longitud, 
            ru.direccion, 
            ru.distrito, 
            vz.nombre 
        FROM 
            relaciones.ubicacion AS ru 
        INNER JOIN 
            ventas.zona_trabajo AS vz 
        ON 
            ru.zona_trabajo_id = vz.id
        WHERE
            vz.id=$1 ORDER BY vz.id DESC LIMIT 8;`,
                [id]
      );
      return resultado;
    } catch (error) {
      throw new Error(`Error al obtener el demo para Flutter ${error}`);
    }
  },
};

export default modelAlmacen;
