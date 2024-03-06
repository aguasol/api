import { createRutas, getLastRutas } from "../controllers/ventas_ruta_controller.mjs"; 
import express from 'express';
const routerVentasRuta = express.Router();
routerVentasRuta.post('/ruta',createRutas)
routerVentasRuta.get('/rutalast/:empleadoId',getLastRutas)

export default routerVentasRuta;
