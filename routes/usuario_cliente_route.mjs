import {getAllUserClientes,updateUserClientes,deleteUserClientes,createUserClientes, existCodeClientes} from '../controllers/usuario_cliente_controller.mjs'
import express from 'express';

const routerUserCliente = express.Router();

routerUserCliente.post('/user_cliente',createUserClientes)
routerUserCliente.delete('/user_cliente/:userClienteId',deleteUserClientes)
routerUserCliente.get('/user_cliente',getAllUserClientes)
routerUserCliente.put('/user_cliente/:userClienteId',updateUserClientes)
routerUserCliente.post('/code_cliente',existCodeClientes)



export default routerUserCliente;