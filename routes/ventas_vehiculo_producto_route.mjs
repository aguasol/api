import { createVehiculoProductos,getVehiculosProductos,updateVehiculoProductos,getProductosVehiculo } from "../controllers/ventas_vehiculo_producto_controller.mjs";

import express from 'express';

const routerVehiculoProducto= express.Router();
routerVehiculoProducto.post('/vehiculo_producto',createVehiculoProductos)
routerVehiculoProducto.get('/vehiculo_producto',getVehiculosProductos)
routerVehiculoProducto.get('/vehiculo_producto/:vehiculoID',getProductosVehiculo)
routerVehiculoProducto.put('/vehiculo_producto/:vehiculoID',updateVehiculoProductos)

export default routerVehiculoProducto;
