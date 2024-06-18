import {getAllUserClientes,updateUserClientes,deleteUserClientes,createUserClientes,updateClientes,existCodeClientes,getClientRecovery,updateRecovery,getAllRecargas} from '../controllers/usuario_cliente_controller.mjs'
import express from 'express';

const routerUserCliente = express.Router();

routerUserCliente.post('/user_cliente',createUserClientes)
routerUserCliente.delete('/user_cliente/:userClienteId',deleteUserClientes)
routerUserCliente.get('/user_cliente',getAllUserClientes)
routerUserCliente.put('/user_cliente/:userClienteId',updateUserClientes)
routerUserCliente.put('/cliente/:userClienteId',updateClientes)
routerUserCliente.post('/code_cliente',existCodeClientes)
routerUserCliente.post('/user_cliente/Recovery',getClientRecovery)
routerUserCliente.put('/user_cliente/Recovery/:userId',updateRecovery)
routerUserCliente.get('/cliente/recargas/:userClientId',getAllRecargas)

export default routerUserCliente;