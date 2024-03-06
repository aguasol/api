import {getAllUserEmpleados,createUserEmpleados,updateUserEmpleados,deleteUserEmpleados  } from "../controllers/usuario_empleado_controller.mjs";
import express from 'express';

const routerUserEmpleado = express.Router();

routerUserEmpleado.post('/user_empleado',createUserEmpleados)
routerUserEmpleado.delete('/user_empleado/:userEmpleadoId',deleteUserEmpleados)
routerUserEmpleado.get('/user_empleado',getAllUserEmpleados)
routerUserEmpleado.put('/user_empleado/:userEmpleadoId',updateUserEmpleados)



export default routerUserEmpleado;