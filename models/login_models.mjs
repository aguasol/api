
import { db_pool } from "../config.mjs";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
//console.log("--------# 1.0 login")

const modelLogin = {
    Login: async (credenciales) => {
        
        //console.log(credenciales)
        try {
                      
            
            const existUser = await db_pool.oneOrNone(`SELECT * FROM personal.usuario WHERE nickname = $1 OR telefono=$2 OR email = $3`,
            [credenciales.nickname,credenciales.nickname,credenciales.nickname])
           // console.log("Exist USER")
           console.log(existUser)
           // console.log(typeof existUser)
            if(existUser){
              //  console.log("Exist USER - Rol ID:", existUser.rol_id)
                if(existUser.rol_id==2){
                    const resultado = await db_pool.oneOrNone(
                        `SELECT * FROM personal.usuario 
                        INNER JOIN personal.empleado ON personal.usuario.id = personal.empleado.usuario_id 
                        WHERE personal.usuario.nickname = $1 OR personal.usuario.email = $2 OR personal.usuario.telefono=$3`,// AND contrasena=$2`,
                        [credenciales.nickname,credenciales.nickname,credenciales.nickname]
                    );
                    if (resultado && await bcrypt.compare(credenciales.contrasena, resultado.contrasena)) {
                        const token = jwt.sign({ id: resultado.id }, 'aguasol', { expiresIn: '30s' }); // Ajusta el tiempo de expiración según tus necesidades
                        console.log(token);
                        return {usuario:resultado,token}
                    }
                    else{
                        return {message:"credenciales invalidas"}
                    }
                }
                else if(existUser.rol_id==4){
                    const resultado = await db_pool.oneOrNone(
                        `SELECT * FROM personal.usuario 
                        INNER JOIN ventas.cliente ON personal.usuario.id = ventas.cliente.usuario_id 
                        WHERE personal.usuario.nickname = $1 OR personal.usuario.telefono=$2 OR personal.usuario.email = $3`,// AND contrasena=$2`,
                        [credenciales.nickname,credenciales.nickname,credenciales.nickname]
                    );
                    //console.log("flag-----------------");
                    //console.log(resultado);
                    if (resultado && await bcrypt.compare(credenciales.contrasena, resultado.contrasena)) {
                        //console.log("flag");
                        //console.log(resultado.id);
                        const token = jwt.sign({ id: resultado.id }, 'aguasol', { expiresIn: '30s' }); // Ajusta el tiempo de expiración según tus necesidades
                        //console.log(token);
                        //console.log("codigo--------------------------------------------");
                        
                        return {usuario:resultado,token}
                    }
                    else{
                        return {message:"credenciales invalidas"}
                    }
                }
                else if(existUser.rol_id==5){
                    const resultado = await db_pool.oneOrNone(
                        `SELECT * FROM personal.usuario 
                        INNER JOIN personal.conductor ON personal.usuario.id = personal.conductor.usuario_id 
                        WHERE personal.usuario.nickname = $1 OR personal.usuario.email = $2  OR personal.usuario.telefono=$3`,// AND contrasena=$2`,
                        [credenciales.nickname,credenciales.nickname,credenciales.nickname]
                    );
                    if (resultado && await bcrypt.compare(credenciales.contrasena, resultado.contrasena)) {
                        const token = jwt.sign({ id: resultado.id }, 'aguasol', { expiresIn: '1h' }); // Ajusta el tiempo de expiración según tus necesidades
                        //console.log(token);
                        return {usuario:resultado,token}
                    }
                    else{
                        return {message:"credenciales invalidas"}
                    }
                }
                else if(existUser.rol_id==3){
                    const resultado = await db_pool.oneOrNone(
                        `SELECT * FROM personal.usuario 
                        INNER JOIN personal.gerente ON personal.usuario.id = personal.gerente.usuario_id 
                        WHERE personal.usuario.nickname = $1 OR personal.usuario.email = $2 OR personal.usuario.telefono=$3`,// AND contrasena=$2`,
                        [credenciales.nickname,credenciales.nickname,credenciales.nickname]
                    );
                    if (resultado && await bcrypt.compare(credenciales.contrasena, resultado.contrasena)) {
                        const token = jwt.sign({ id: resultado.id }, 'aguasol', { expiresIn: '1h' }); // Ajusta el tiempo de expiración según tus necesidades
                        //console.log(token);
                        return {usuario:resultado,token}
                    }
                    else{
                        return {message:"credenciales invalidas"}
                    }
                }
                else if(existUser.rol_id==1){
                    const resultado = await db_pool.oneOrNone(
                        `SELECT * FROM personal.usuario 
                        INNER JOIN personal.administrador ON personal.usuario.id = personal.administrador.usuario_id 
                        WHERE personal.usuario.nickname = $1 OR personal.usuario.email = $2 OR personal.usuario.telefono=$3`,// AND contrasena=$2`,
                        [credenciales.nickname,credenciales.nickname,credenciales.nickname]
                    );
                    //console.log("--------------------------");
                    //console.log(resultado);
                    if (resultado && await bcrypt.compare(credenciales.contrasena, resultado.contrasena)) {
                        const token = jwt.sign({ id: resultado.id }, 'aguasol', { expiresIn: '1h' }); // Ajusta el tiempo de expiración según tus necesidades
                        //console.log(token);
                        return {usuario:resultado,token}
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

