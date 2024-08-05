import { db_pool } from "../config.mjs";
import bcrypt from 'bcrypt';

//console.log("--------# 7.0 conductor")
const modelUserConductor = {
    createUserConductor: async (conductor) => {
        //const driver =  await db_pool.connect();

        try {
            const UsuarioExistente = await db_pool.oneOrNone(`SELECT * FROM personal.usuario WHERE nickname=$1`,
                [conductor.nickname])
            //console.log("usuarioexistente")
            //  console.log(UsuarioExistente)
            if (UsuarioExistente) {
                return { message: "Usuario ya existente, intente otro por favor." }
            }
            else {

                const hashedPassword = await bcrypt.hash(conductor.contrasena, 10);
                // Inicia una transacción
                //const result = await driver.tx(async (t) => {
                const usuario = await db_pool.one('INSERT INTO personal.usuario (rol_id, nickname, contrasena, email) VALUES ($1, $2, $3, $4) RETURNING *',
                    [conductor.rol_id, conductor.nickname, hashedPassword, conductor.email]);
                // console.log("id conductor")
                //  console.log(usuario.id)


                const conductores = await db_pool.one('INSERT INTO personal.conductor (usuario_id, nombres, apellidos, licencia, dni, fecha_nacimiento,administrador_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
                    [usuario.id, conductor.nombres, conductor.apellidos, conductor.licencia, conductor.dni, conductor.fecha_nacimiento, conductor.administrador_id]);


                //  console.log("conductores+-++++");
                // console.log(conductores);

                return { usuario, conductores }
                //});
                //return {resultado:result}
            }


        }
        catch (e) {
            throw new Error(`Error query create:${e}`)
        }
    },
    updateUserConductor: async (id, conductor) => {

        try {
            const usuario = await db_pool.oneOrNone('UPDATE personal.usuario SET rol_id = $1, nickname = $2, contrasena = $3, email = $4 WHERE id = $5 RETURNING *',
                [conductor.rol_id, conductor.nickname, conductor.contrasena, conductor.email, id]);

            if (!usuario) {
                throw new Error(`No se encontró un usuario con ID ${id}.`);
            }

            const conductor = await db_pool.one('UPDATE personal.conductor SET nombres=$1, apellidos=$2, licencia=$3, dni=$4, fecha_nacimiento=$5 WHERE usuario_id = $6 RETURNING *',
                [conductor.nombres, conductor.apellidos, conductor.licencia, conductor.dni, conductor.fecha_nacimiento, id]);
            //  console.log("dentro de model 2do update",id)
            return { usuario, administrador }
        } catch (error) {
            throw new Error(`Error en la actualización del conductor: ${error.message}`);
        }
    },
    getUsersConductor: async (idEmpleado) => {
        try {
            //const userConductores = await db_pool.any('select * from personal.usuario inner join personal.conductor on personal.usuario.id = personal.conductor.usuario_id')
            const userConductores = await db_pool.any(`select * from personal.conductor as pc where pc.administrador_id = (
	select administrador_id from personal.empleado as pe  inner join personal.administrador as pa on pe.administrador_id = pa.id
where pe.id = $1)`, [idEmpleado])
            return userConductores
        } catch (e) {
            throw new Error(`Error query clients: ${err}`);
        }
    },

    /*
`
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
                rn = 1;`
    */

                /*
                SELECT vr.conductor_id, pc.nombres, pc.apellidos, pc.licencia,
	pc.dni,pc.fecha_nacimiento,
	vr.id AS ruta
	FROM ventas.ruta AS vr
INNER JOIN personal.conductor AS pc ON vr.conductor_id = pc.id
where vr.empleado_id = $1
                */
    getconductorruta: async (empleadoID) => {
        try {
            const conductorruta = await db_pool.any(`WITH RutaConductor AS (
    SELECT 
        vr.conductor_id, 
        pc.nombres, 
        pc.apellidos, 
        pc.licencia,
        pc.dni,
        pc.fecha_nacimiento,
        vr.id AS ruta,
        ROW_NUMBER() OVER (PARTITION BY pc.id ORDER BY vr.id DESC) AS rn
    FROM 
        ventas.ruta AS vr
    INNER JOIN 
        personal.conductor AS pc ON vr.conductor_id = pc.id
    WHERE 
        vr.empleado_id = $1
)

SELECT 
    conductor_id, 
    nombres, 
    apellidos, 
    licencia, 
    dni, 
    fecha_nacimiento, 
    ruta
FROM 
    RutaConductor
WHERE 
    rn = 1;`,[empleadoID])
            return conductorruta
        } catch (error) {
            throw new Error(`Error query drivers: ${err}`);
        }
    },
    getPedidosPorConductor: async (conductorID, empleadoID) => {
        try {
            //console.log("este es el conductor recibido")
            //console.log(conductorID)

            const adminID = await db_pool.one(`
            SELECT id,administrador_id FROM personal.empleado WHERE id = $1`, [empleadoID])




            const lastRuta = await db_pool.oneOrNone(`select vr.id from personal.conductor  as pc inner join ventas.ruta as vr on pc.id = vr.conductor_id  where pc.id= $1 and pc.administrador_id = $2 and vr.empleado_id = $3 order by vr.id desc limit 1`,
                [conductorID, adminID.administrador_id, adminID.id])

            //console.log("esta es su ultima ruta")
            //console.log(lastRuta)


            const pedidos = await db_pool.any(`select vp.id,vp.subtotal,vp.descuento,vp.total,vp.ruta_id,vp.fecha,vp.estado,vp.tipo,vp.observacion,rub.latitud,rub.longitud,rub.distrito,
			COALESCE(vc.nombre, vcnr.nombre) as nombre,
                COALESCE(vc.apellidos, vcnr.apellidos) as apellidos,
                COALESCE(vc.telefono, vcnr.telefono) as telefono
			from ventas.pedido as vp 
			left join ventas.ruta as vr on vp.ruta_id = vr.id
			left join ventas.cliente as vc on vp.cliente_id=vc.id
			left join ventas.cliente_noregistrado as vcnr on vp.cliente_nr_id=vcnr.id
			left join relaciones.ubicacion as rub on rub.id = vp.ubicacion_id
			where vr.id = $1`, [lastRuta.id])

            //console.log("estos son los pedidos")
            //console.log(pedidos)

            return pedidos

        } catch (e) {
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

    getConductorAdmin: async (id) => {
        try {
            //console.log("entrando al ENDPOINT ADMIN CONDUCTOR")
            const result = await db_pool.any(`select pc.id,pc.nombres,pc.apellidos,pc.dni,pc.licencia,pc.fecha_nacimiento,
	pu.rol_id, pu.nickname, pu.contrasena, pu.email,pc.usuario_id	
	from personal.conductor 
	as pc inner join 
	personal.administrador as pa on pc.administrador_id=pa.id inner join personal.usuario as pu 
	on pc.usuario_id = pu.id where pa.id=$1 `, [id]);
            console.log(result);
            return result;
        } catch (error) {
            throw new Error(`Error en admin conductor: ${error.message}`);
        }
    }
}
export default modelUserConductor;