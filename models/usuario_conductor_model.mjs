import { db_pool } from "../config.mjs";
import bcrypt from 'bcrypt';

const modelUserConductor = {
    createUserConductor:async (conductor) => {
        const driver =  await db_pool.connect();

        try{
            const UsuarioExistente = await db_pool.oneOrNone(`SELECT * FROM personal.usuario WHERE nickname=$1`,
                [conductor.nickname])
            console.log("usuarioexistente")
            console.log(UsuarioExistente)
            if (UsuarioExistente) {
                return {message:"Usuario ya existente, intente otro por favor."}
            }
            else{
                
                const hashedPassword = await bcrypt.hash(conductor.contrasena, 10);
                // Inicia una transacción
                const result = await driver.tx(async (t) => {
                    const usuario = await t.one('INSERT INTO personal.usuario (rol_id, nickname, contrasena, email) VALUES ($1, $2, $3, $4) RETURNING *',
                        [conductor.rol_id, conductor.nickname, hashedPassword, conductor.email]);
                    console.log("id conductor")
                    console.log(usuario.id)
                    

                    const conductores = await t.one('INSERT INTO personal.conductor (usuario_id, nombres, apellidos, licencia, dni, fecha_nacimiento,administrador_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
                    [usuario.id, conductor.nombres, conductor.apellidos, conductor.licencia, conductor.dni, conductor.fecha_nacimiento,conductor.administrador_id]);
        

                    console.log("conductores+-++++");
                    console.log(conductores);

                    return { usuario, conductores } 
                });
                return {resultado:result}
            }
          
           
        }
        catch(e){
            throw new Error(`Error query create:${e}`)
        } finally {
            // Asegúrate de liberar la conexión al finalizar
            driver.done();
        }
    },
    updateUserConductor: async (id,conductor) => {
      
        try {
            const usuario = await db_pool.oneOrNone('UPDATE personal.usuario SET rol_id = $1, nickname = $2, contrasena = $3, email = $4 WHERE id = $5 RETURNING *',
                [conductor.rol_id,conductor.nickname, conductor.contrasena, conductor.email,id]);

            if (!usuario) {
                throw new Error(`No se encontró un usuario con ID ${id}.`);
            }

            const conductor = await db_pool.one('UPDATE personal.conductor SET nombres=$1, apellidos=$2, licencia=$3, dni=$4, fecha_nacimiento=$5 WHERE usuario_id = $6 RETURNING *',
                [conductor.nombres,conductor.apellidos,conductor.licencia,conductor.dni,conductor.fecha_nacimiento,id]);
            console.log("dentro de model 2do update",id)
            return {usuario,administrador}
        } catch (error) {
            throw new Error(`Error en la actualización del conductor: ${error.message}`);
        }
    },
    getUsersConductor:async () => {
        try{
            const userConductores = await db_pool.any('select * from personal.usuario inner join personal.conductor on personal.usuario.id = personal.conductor.usuario_id')
            return userConductores
        }catch(e){
            throw new Error(`Error query clients: ${err}`);
        }
    },
    getconductorruta:async() =>{
        try {
            const conductorruta= await db_pool.any(`
            WITH ConductorDatosOrdenados AS (
                SELECT
                    pc.id AS conductor_id,
                    pc.nombres,
                    pc.apellidos,
                    pc.licencia,
                    pc.dni,
                    pc.fecha_nacimiento,
                    vr.id AS ruta_id,
                    ROW_NUMBER() OVER (PARTITION BY pc.id ORDER BY vr.id DESC) AS rn
                FROM
                    personal.conductor pc
                    INNER JOIN ventas.ruta vr ON pc.id = vr.conductor_id
            )
            SELECT
                conductor_id AS id,
                nombres,
                apellidos,
                licencia,
                dni,
                fecha_nacimiento,
                ruta_id AS ruta
            FROM
                ConductorDatosOrdenados
            WHERE
                rn = 1;`)
            return conductorruta
        } catch (error) {
            throw new Error(`Error query drivers: ${err}`);
        }
    },
    getPedidosPorConductor:async (conductorID) => {
        try{
            console.log("este es el conductor recibido")
            console.log(conductorID)
            const lastRuta = await db_pool.oneOrNone(`select vr.id from personal.conductor 
            as pc inner join ventas.ruta as vr on pc.id = vr.conductor_id  
            where pc.id= $1 order by vr.id desc limit 1`,[conductorID])

            console.log("esta es su ultima ruta")
            console.log(lastRuta)


            const pedidos = await db_pool.any(`select vp.id,vp.subtotal,vp.descuento,vp.total,vp.ruta_id,vp.fecha,vp.estado,vp.tipo,vp.observacion,rub.latitud,rub.longitud,rub.distrito,
			COALESCE(vc.nombre, vcnr.nombre) as nombre,
                COALESCE(vc.apellidos, vcnr.apellidos) as apellidos,
                COALESCE(vc.telefono, vcnr.telefono) as telefono
			from ventas.pedido as vp 
			left join ventas.ruta as vr on vp.ruta_id = vr.id
			left join ventas.cliente as vc on vp.cliente_id=vc.id
			left join ventas.cliente_noregistrado as vcnr on vp.cliente_nr_id=vcnr.id
			left join relaciones.ubicacion as rub on rub.id = vp.ubicacion_id
			where vr.id = $1`,[lastRuta.id])

            console.log("estos son los pedidos")
            console.log(pedidos)

            return pedidos

        }catch(e){
            throw new Error(`Error query pedido por conductor: ${err}`);
        }
    },
    deleteUserConductor: async (id) => {
        try {
            const result = await db_pool.result('DELETE FROM personal.usuario WHERE ID = $1', [id]);
            return result.rowCount === 1; // Devuelve true si se eliminó un registro, false si no se encontró el registro
        } catch (error) {
            throw new Error(`Error en la eliminación del cliente: ${error.message}`);
        }
    },
}
export default modelUserConductor;