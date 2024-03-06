import { createUserAdmins,deleteUserAdmins,getAllUsersAdmins,updateUserAdmins } from "../controllers/usuario_administrador_controller.mjs";
import express from 'express';

const routerUserAdmin = express.Router();

routerUserAdmin.post('/user_admin',createUserAdmins)
routerUserAdmin.delete('/user_admin/:userAdminId',deleteUserAdmins)
routerUserAdmin.get('/user_admin',getAllUsersAdmins)
routerUserAdmin.put('/user_admin/:userAdminId',updateUserAdmins)



export default routerUserAdmin;