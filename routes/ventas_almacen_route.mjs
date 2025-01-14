import { getAlmacenes,getDemosInfo } from "../controllers/ventas_almacen_controller.mjs";
import express from 'express';

const routerAlmacenes = express.Router();

routerAlmacenes.get('/almacenes',getAlmacenes)
routerAlmacenes.get('/demoInfo/:id',getDemosInfo)



export default routerAlmacenes;