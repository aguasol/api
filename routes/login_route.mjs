import { getUsers } from '../controllers/login_controller.mjs';
import express from 'express';

const routerLogin = express.Router();

routerLogin.post('/login',getUsers)


export default routerLogin;