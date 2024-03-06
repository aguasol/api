import { createProductoPromociones,getProductoPromociones,getUNProductoPromociones,deleteProductoPromociones,updateProductoPromociones} from '../controllers/relacion_producto_promocion_controller.mjs';
import express from 'express';

const routerVentasProductoPromocion = express.Router();
routerVentasProductoPromocion.post('/prod_prom',createProductoPromociones)
routerVentasProductoPromocion.get('/prod_prom',getProductoPromociones)

routerVentasProductoPromocion.get('/prod_prom/:promocionID',getUNProductoPromociones)

routerVentasProductoPromocion.delete('/prod_prom/:relacionID',deleteProductoPromociones)
routerVentasProductoPromocion.put('/prod_prom/:relacionID',updateProductoPromociones)

export default routerVentasProductoPromocion;
