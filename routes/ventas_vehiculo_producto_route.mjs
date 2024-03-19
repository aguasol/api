import { getVPconductors,createVehiculoProductos,getVehiculosProductos,updateVehiculoProductosEmp,getProductosVehiculo,updateVehiculoProductsCond } from "../controllers/ventas_vehiculo_producto_controller.mjs";

import express from 'express';

const routerVehiculoProducto= express.Router();
routerVehiculoProducto.post('/vehiculo_producto',createVehiculoProductos)
routerVehiculoProducto.get('/vehiculo_producto',getVehiculosProductos)
routerVehiculoProducto.get('/vehiculo_producto/:vehiculoID',getProductosVehiculo)
routerVehiculoProducto.put('/vehiculo_producto_empleado/:vehiculoID',updateVehiculoProductosEmp)
routerVehiculoProducto.put('/vehiculo_producto_conductor/:vehiculoID',updateVehiculoProductsCond)
routerVehiculoProducto.get('/vehiculo_producto_conductor/:conductorID',getVPconductors)
export default routerVehiculoProducto;
