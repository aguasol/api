import { getAlmacenes } from "../controllers/ventas_almacen_controller.mjs";
import express from 'express';

const routerAlmacenes = express.Router();

routerAlmacenes.get('/almacenes',getAlmacenes)



export default routerAlmacenes;