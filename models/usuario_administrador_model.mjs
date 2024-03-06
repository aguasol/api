import { db_pool } from "../config.mjs";
import bcrypt from 'bcrypt';

const modelUserAdmin = {
    createUserAdmin:async (admin) => {
        const adminer =  await db_pool.connect();

        try{
            const UsuarioExistente = await db_pool.oneOrNone(`SELECT * FROM personal.usuario WHERE nickname=$1`,
                [admin.nickname])
            console.log("usuarioexistente")
            console.log(UsuarioExistente)
            if (UsuarioExistente) {
                return { "message": "Usuario ya existente, intente otro por favor. " }
            }
            else{
                
                const hashedPassword = await bcrypt.hash(admin.contrasena, 10);
                // Inicia una transacción
                const result = await adminer.tx(async (t) => {
                    const usuario = await t.one('INSERT INTO personal.usuario (rol_id, nickname, contrasena, email) VALUES ($1, $2, $3, $4) RETURNING *',
                        [admin.rol_id, admin.nickname, hashedPassword, admin.email]);
                    console.log("id conductor")
                    console.log(usuario.id)
                    

                    const administradores = await t.one('INSERT INTO personal.administrador(usuario_id,nombres,apellidos,dni,fecha_nacimiento,zona_trabajo_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
                    [usuario.id,admin.nombres,admin.apellidos,admin.dni,admin.fecha_nacimiento,admin.zona_trabajo_id]);
        

                    console.log("administradores+-++++");
                    console.log(administradores);

                    return { usuario, administradores } 
                });
                return result
            }
          
           
        }
        catch(e){
            throw new Error(`Error query create:${e}`)
        } finally {
            // Asegúrate de liberar la conexión al finalizar
            adminer.done();
        }
        /*try{
            const usuario = await db_pool.one('INSERT INTO personal.usuario (rol_id,nickname, contrasena, email) VALUES ($1,$2,$3,$4) RETURNING *',
            [admin.rol_id,admin.nickname,admin.contrasena,admin.email]);
            
            const administradores = await db_pool.one('INSERT INTO personal.administrador(usuario_id,nombres,apellidos,dni,fecha_nacimiento) VALUES($1,$2,$3,$4,$5) RETURNING *',
            [usuario.id,admin.nombres,admin.apellidos,admin.dni,admin.fecha_nacimiento]);

            return administradores

        }
        catch(e){
            throw new Error(`Error query create:${e}`)
        }*/
    },
    updateUserAdmin: async (id,admin) => {
        console.log("---dentro de models",id)
        console.log(admin)
        try {
            const usuario = await db_pool.oneOrNone('UPDATE personal.usuario SET rol_id = $1, nickname = $2, contrasena = $3, email = $4 WHERE id = $5 RETURNING *',
                [admin.rol_id, admin.nickname, admin.contrasena, admin.email,id]);

            if (!usuario) {
                throw new Error(`No se encontró un usuario con ID ${id}.`);
            }

            const administrador = await db_pool.one('UPDATE personal.administrador SET nombres = $1, apellidos = $2, dni = $3, fecha_nacimiento = $4 WHERE usuario_id = $5 RETURNING *',
                [admin.nombres, admin.apellidos, admin.dni, admin.fecha_nacimiento,id]);
            console.log("dentro de model 2do update",id)
            return {usuario,administrador}
        } catch (error) {
            throw new Error(`Error en la actualización del administrador: ${error.message}`);
        }
    },
    getUsersAdmins:async () => {
        try{
            const userAdmins = await db_pool.any('SELECT * FROM personal.usuario INNER JOIN personal.administrador ON personal.usuario.id = personal.administrador.usuario_id')
            return userAdmins
        }catch(e){
            throw new Error(`Error query administradores: ${err}`);
        }
    },
    deleteUserAdmin: async (id) => {
        try {
            const result = await db_pool.result('DELETE FROM personal.usuario WHERE ID = $1', [id]);
            return result.rowCount === 1; // Devuelve true si se eliminó un registro, false si no se encontró el registro
        } catch (error) {
            throw new Error(`Error en la eliminación del cliente: ${error.message}`);
        }
    },
}
export default modelUserAdmin;