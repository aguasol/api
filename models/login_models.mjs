import { json } from "express";
import { db_pool } from "../config.mjs";
import bcrypt from 'bcrypt';

const modelLogin = {
    Login: async (credenciales) => {
        console.log("credenciales")
        console.log(credenciales)
        try {
            const tiposUsuarios = [
                { tipo: 'cliente', consulta: 'ventas.cliente' },
                { tipo: 'conductor', consulta: 'personal.conductor' },
                { tipo: 'empleado', consulta: 'personal.empleado' },
                { tipo: 'gerente', consulta: 'personal.gerente' },
                { tipo: 'administrador', consulta: 'personal.administrador' },
            ];
            
            
            const existUser = await db_pool.oneOrNone(`SELECT * FROM personal.usuario WHERE nickname = $1`,
            [credenciales.nickname])
            console.log("Exist USER")
            console.log(existUser)
            console.log(typeof existUser)
            if(existUser){
                console.log("Exist USER - Rol ID:", existUser.rol_id)
                if(existUser.rol_id==2){
                    const resultado = await db_pool.oneOrNone(
                        `SELECT * FROM personal.usuario 
                        INNER JOIN personal.empleado ON personal.usuario.id = personal.empleado.usuario_id 
                        WHERE nickname=$1`,// AND contrasena=$2`,
                        [credenciales.nickname]
                    );
                    if (resultado && await bcrypt.compare(credenciales.contrasena, resultado.contrasena)) {
                        
                        
                        return {usuario:resultado}
                    }
                    else{
                        return {message:"credenciales invalidas"}
                    }
                }
                else if(existUser.rol_id==4){
                    const resultado = await db_pool.oneOrNone(
                        `SELECT * FROM personal.usuario 
                        INNER JOIN ventas.cliente ON personal.usuario.id = ventas.cliente.usuario_id 
                        WHERE nickname=$1`,// AND contrasena=$2`,
                        [credenciales.nickname]
                    );
                    if (resultado && await bcrypt.compare(credenciales.contrasena, resultado.contrasena)) {
                       
                        
                        return {usuario:resultado}
                    }
                    else{
                        return {message:"credenciales invalidas"}
                    }
                }
                else if(existUser.rol_id==5){
                    const resultado = await db_pool.oneOrNone(
                        `SELECT * FROM personal.usuario 
                        INNER JOIN personal.conductor ON personal.usuario.id = personal.conductor.usuario_id 
                        WHERE nickname=$1`,// AND contrasena=$2`,
                        [credenciales.nickname]
                    );
                    if (resultado && await bcrypt.compare(credenciales.contrasena, resultado.contrasena)) {
                        
                        
                        return {usuario:resultado}
                    }
                    else{
                        return {message:"credenciales invalidas"}
                    }
                }
                else if(existUser.rol_id==3){
                    const resultado = await db_pool.oneOrNone(
                        `SELECT * FROM personal.usuario 
                        INNER JOIN personal.gerente ON personal.usuario.id = personal.gerente.usuario_id 
                        WHERE nickname=$1`,// AND contrasena=$2`,
                        [credenciales.nickname]
                    );
                    if (resultado && await bcrypt.compare(credenciales.contrasena, resultado.contrasena)) {
                        
                        
                        return {usuario:resultado}
                    }
                    else{
                        return {message:"credenciales invalidas"}
                    }
                }
                else if(existUser.rol_id==1){
                    const resultado = await db_pool.oneOrNone(
                        `SELECT * FROM personal.usuario 
                        INNER JOIN personal.administrador ON personal.usuario.id = personal.administrador.usuario_id 
                        WHERE nickname=$1`,// AND contrasena=$2`,
                        [credenciales.nickname]
                    );
                    if (resultado && await bcrypt.compare(credenciales.contrasena, resultado.contrasena)) {
                        
                        
                        return {usuario:resultado}
                    }
                    else{
                        return {message:"credenciales invalidas"}
                    }
                }

            }

            // Si no se encuentra en ninguna consulta
            return {message:"Usuario no encontrado ni asociado"};
        } catch (e) {
            throw new Error(`Error en la consulta de inicio de sesión: ${e}`);
        }
    },
}

export default modelLogin;

