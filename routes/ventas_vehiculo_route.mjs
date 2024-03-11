import { createVehiculos,getVehiculos,getVhehiculoAadmins } from '../controllers/ventas_vehiculo_controller.mjs';
import express from 'express';

const routerVehiculo= express.Router();
routerVehiculo.post('/vehiculo',createVehiculos)
routerVehiculo.get('/vehiculo/:empleadoID',getVehiculos)
routerVehiculo.get('/vehiculoadmin/:adminID',getVhehiculoAadmins)
export default routerVehiculo;
