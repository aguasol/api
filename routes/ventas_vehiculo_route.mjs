import { createVehiculos,getVehiculos,deleteVehiculosAdmins,getVhehiculoAadmins } from '../controllers/ventas_vehiculo_controller.mjs';
import express from 'express';

const routerVehiculo= express.Router();
routerVehiculo.post('/vehiculo',createVehiculos)
routerVehiculo.get('/vehiculo/:empleadoID',getVehiculos)
routerVehiculo.get('/vehiculoadmin/:adminID',getVhehiculoAadmins)
routerVehiculo.delete('/vehiculo/:vehiculoID',deleteVehiculosAdmins)
export default routerVehiculo;
