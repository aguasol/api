import { createClientesnr,getClienteNR,getLastClientesnr } from '../controllers/ventas_clientenr_controller.mjs';
import express from 'express';

const routerClienteNR = express.Router();

routerClienteNR.post('/clientenr',createClientesnr)
routerClienteNR.get('/clientenr',getClienteNR)

//Cambio para hallar el ultimo cliente NR, segun el empleado ID
routerClienteNR.get('/last_clientenr/:empleadoID',getLastClientesnr)




export default routerClienteNR;
