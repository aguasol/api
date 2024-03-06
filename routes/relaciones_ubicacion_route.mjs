import { getAllUbicaciones,getUbicacionesClienteNRS,createUbicacion ,getUbicacionesXCliente} from '../controllers/relaciones_ubicacion_controller.mjs';

import express from 'express';

const routerUbicacion= express.Router();

routerUbicacion.post('/ubicacion',createUbicacion)
routerUbicacion.get('/ubicacion',getAllUbicaciones)
routerUbicacion.get('/ubicacion/:clienteID',getUbicacionesXCliente)
routerUbicacion.get('/pedido_clientenr/:clienteNRID',getUbicacionesClienteNRS)

export default routerUbicacion