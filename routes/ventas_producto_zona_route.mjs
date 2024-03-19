import { createProductoZonas,getProductosZonas, getProductoPorZonas} from '../controllers/ventas_producto_zona_controller.mjs';
import express from 'express';

const routerProductoZona = express.Router();
routerProductoZona.post('/producto_zona',createProductoZonas)
routerProductoZona.get('/producto_zona',getProductosZonas)
routerProductoZona.get('/producto_zona/:empleadoID',getProductoPorZonas)

export default routerProductoZona;
