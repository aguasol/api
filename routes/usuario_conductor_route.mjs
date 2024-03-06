import {getAllUserConductores,getPedidosPorConductores,createUserConductores,updateUserConductores,deleteUserConductores, getconductorrutas} from '../controllers/usuario_conductor_controller.mjs'
import express from 'express';

const routerUserConductor = express.Router();

routerUserConductor.post('/user_conductor',createUserConductores)
routerUserConductor.delete('/user_conductor/:userConductorId',deleteUserConductores)
routerUserConductor.get('/user_conductor',getAllUserConductores)
routerUserConductor.get('/conductorPedidos/:conductorID',getPedidosPorConductores)
routerUserConductor.put('/user_conductor/:userConductorId',updateUserConductores)
routerUserConductor.get('/conductor_ruta',getconductorrutas)


export default routerUserConductor;