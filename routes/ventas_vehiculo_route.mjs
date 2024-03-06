import { createVehiculos,getVehiculos } from '../controllers/ventas_vehiculo_controller.mjs';
import express from 'express';

const routerVehiculo= express.Router();
routerVehiculo.post('/vehiculo',createVehiculos)
routerVehiculo.get('/vehiculo',getVehiculos)

export default routerVehiculo;
