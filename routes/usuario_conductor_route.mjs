import {getAllUsersConductores,updateConductorEstado,createconductorpedidos,getAllUserConductores,getPedidosPorConductores,createUserConductores,updateUserConductores,deleteUserConductores, getconductorrutas, getConductorAdmines} from '../controllers/usuario_conductor_controller.mjs'
import express from 'express';

const routerUserConductor = express.Router();

routerUserConductor.post('/user_conductor',createUserConductores)
routerUserConductor.delete('/user_conductor/:userConductorId',deleteUserConductores)
routerUserConductor.get('/user_conductor/:idEmpleado',getAllUserConductores)
routerUserConductor.get('/conductorPedidos/:conductorID/:empleadoID',getPedidosPorConductores)
routerUserConductor.put('/user_conductor/:userConductorId',updateUserConductores)
routerUserConductor.get('/conductor_ruta/:empleadoID',getconductorrutas)
routerUserConductor.get('/conductor_admin/:idAdmin',getConductorAdmines)
// cambios pato
routerUserConductor.get('/user_conductores', getAllUsersConductores)
routerUserConductor.put('/conductor/:userConductorId', updateConductorEstado);
routerUserConductor.post('/aceptarpedido',createconductorpedidos)
export default routerUserConductor;