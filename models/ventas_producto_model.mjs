import { db_pool } from "../config.mjs";

const modelProduct = {
    geAlltProduct:async () => {
        try{
            const product = await db_pool.any('select id,nombre,precio,descripcion,foto from ventas.producto');
            return product;
        }
        catch(e){
            throw new Error(`Error query create:${e}`);
        }
    },

    getONEProduct:async (productID) => {
        try{
            const product = await db_pool.any('SELECT id,nombre,descripcion FROM ventas.producto WHERE id=$1',[productID]);
            return product;
        }
        catch(e){
            throw new Error(`Error query create:${e}`);
        }
    },

    //UPDATE DE SARA AH
    getProductsPorPromo:async (promocionId) => {
        try{
            const product = await db_pool.any('SELECT promocion_id, producto_id,cantidad,vprod.nombre FROM relaciones.producto_promocion AS vpp INNER JOIN ventas.promocion AS vprom ON vprom.id = vpp.promocion_id INNER JOIN ventas.producto AS vprod ON vpp.producto_id=vprod.id WHERE vprom.id=$1',[promocionId]);
            return product;
        }
        catch(e){
            throw new Error(`Error query create:${e}`);
        }
    },
}

export default modelProduct;
