import { getVPvehiculos,createVehiculoProductos,getVehiculosProductos,getProductosVehiculo,updateVehiculoProductsCond, updateXEmpleado,updateVehiculosProductosStocks,getProductosVehiculosStock,updateProductoZonaStocks,getProductoStocksPadre,getIdZonaPadreStocks } from "../controllers/ventas_vehiculo_producto_controller.mjs";

import express from 'express';

const routerVehiculoProducto= express.Router();
routerVehiculoProducto.post('/vehiculo_producto',createVehiculoProductos)
routerVehiculoProducto.get('/vehiculo_producto',getVehiculosProductos)
routerVehiculoProducto.get('/vehiculo_producto/:vehiculoID',getProductosVehiculo)
//routerVehiculoProducto.put('/vehiculo_producto_stock/:vehiculoID',updateVehiculoProductosStock)
routerVehiculoProducto.put('/vehiculo_producto_conductor/:vehiculoID',updateVehiculoProductsCond)
routerVehiculoProducto.get('/vp_vehiculo/:vehiculoID',getVPvehiculos)
routerVehiculoProducto.put('/vehiculoXempleado/:vehiculoID/:productoID/:empleadoID',updateXEmpleado)
routerVehiculoProducto.put('/vehiculo_producto_stock/:vehiculoID',updateVehiculosProductosStocks)
routerVehiculoProducto.get('/vehiculo_producto_stock/:vehiculoID',getProductosVehiculosStock)
routerVehiculoProducto.put('/vehiculo_producto_stock_padre/:zonaTrabajoID',updateProductoZonaStocks)
routerVehiculoProducto.get('/vehiculo_producto_stock_padre/:zonaTrabajoId/:productoId', getProductoStocksPadre)
routerVehiculoProducto.get('/vehiculo_producto_stock_padre/:empleadoID', getIdZonaPadreStocks)
export default routerVehiculoProducto;
