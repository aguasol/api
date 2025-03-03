import { db_pool } from "../config.mjs";
import { io } from '../index.mjs';



//console.log("--------# 4.0 ubicacion")
const modelUbicacion = { 
    createUbicacion :async(ubicacion) => {
        
        try {
            const ubicaciones = await db_pool.one('INSERT INTO relaciones.ubicacion(latitud,longitud,direccion,cliente_id,cliente_nr_id,distrito,zona_trabajo_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
            [ubicacion.latitud,ubicacion.longitud,ubicacion.direccion,ubicacion.cliente_id,ubicacion.cliente_nr_id,ubicacion.distrito,ubicacion.zona_trabajo_id])
            

            return ubicaciones;
        } catch (error) {
            throw new Error(`Error de inserción : ${error}`)
        }
    },
    getUbicacion : async() => {
        try {
            const ubicaciones = await db_pool.any('SELECT * FROM relaciones.ubicacion')
           // console.log("ubicaciones")
         //   console.log(ubicaciones)
            return ubicaciones
        } catch (error) {
            throw new Error(`Error conseguir ${error}`)
        }
    },
    getUbicacionesCliente : async(clienteID) => {
      //  console.log("----------LLEGO EL CLIENTE_ID----------------------------")
        try {
            const ubicaciones = await db_pool.any('SELECT * FROM relaciones.ubicacion WHERE cliente_id = $1',[clienteID])
           // console.log("ubicaciones")
           // console.log(ubicaciones)
            return ubicaciones
        } catch (error) {
            throw new Error(`Error conseguir ${error}`)
        }
    },
    /*
    SELECT id FROM relaciones.ubicacion WHERE cliente_nr_id = 19 ORDER BY id DESC LIMIT 1
    SELECT zona_trabajo_id FROM personal.administrador as pa inner join personal.empleado as pe on pa.id=pe.administrador_id where pe.id=18
    select * from relaciones.ubicacion where cliente_nr_id=19
    update relaciones.ubicacion set zona_trabajo_id=$1 where id=181 --zona_trabajo_id aqui le paso la zona id, sería de la primera consulta el id=181 
    */
    getUbicacionesClienteNR : async(clienteNRID) => {
        try {
            const ubicacion = await db_pool.oneOrNone('SELECT id FROM relaciones.ubicacion WHERE cliente_nr_id = $1 ORDER BY id DESC LIMIT 1',[clienteNRID])
            return ubicacion
        } catch (error) {
            throw new Error(`Error conseguir id ${error}`)
        }
    },


    updateRelacionesUbicacion : async(empleadoID,idRelacionUbicacion) => {
        try{
            //Este endpoint es para actualizar los pedidos para clientes no Registrados
            const zonatrabajoid = await db_pool.one(`SELECT zona_trabajo_id FROM personal.administrador AS pa
                INNER JOIN personal.empleado AS pe ON pa.id=pe.administrador_id WHERE pe.id=$1`,[empleadoID])//sacamos el zona_trabajo_id de empleado
            //console.log("Esta es Zona de Trabajo Empleado")
            //console.log(zonatrabajoid)
            const ubicacion = await db_pool.one(`UPDATE relaciones.ubicacion SET zona_trabajo_id=$1 
                WHERE id=$2 RETURNING *`,[zonatrabajoid.zona_trabajo_id,idRelacionUbicacion])//Aca se le esta pasando id de la relacion de ubicacion para actualizar el campo zona de trabajo
            //console.log("Esta es la zona de trabajo actualizada")
            //console.log(ubicacion)
            return ubicacion

        }catch(error){
            throw new Error(`Error update ${error}`)
        }
    },
    deleteRelacionesUbicacion : async(idUbicacion) =>{
        try {
            const resultado = await db_pool.result(`DELETE FROM relaciones.ubicacion WHERE id = $1`,[idUbicacion])
            return resultado.rowCount === 1
        } catch (error) {
            throw new Error(`Error en la eliminacion de ubicacion: ${error.message}`)
        }
    },
   
};




export default modelUbicacion
