import { db_pool } from "../config.mjs";
import { io } from '../index.mjs';



const modelRuta = {
    getPedidosByruta: async(ruta_id) =>{
        try {

            console.log("---HOLAAA DENTRO DE Pruta->>>",ruta_id)
            const pedidos = await db_pool.any('SELECT * FROM ventas.pedido WHERE ruta_id=$1',
            [ruta_id]);
          //  console.log("ultima ruta")
           // console.log(lastRuta)
            return pedidos
        } catch (error) {
            
        }
    },


    createRuta:async (ruta) => {
        try{
            console.log("model_ruta")
            console.log(ruta)
           // const io = await app_sol.get('io');

            const rutas = await db_pool.one('INSERT INTO ventas.ruta (conductor_id,vehiculo_id,empleado_id,distancia_km,tiempo_ruta,fecha_creacion) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            [ruta.conductor_id,ruta.vehiculo_id,ruta.empleado_id,ruta.distancia_km,ruta.tiempo_ruta,ruta.fecha_creacion]);
            console.log("--INSERT RUTA")
            console.log(rutas)
            
            console.log("--RUTA-CONDUCTOR ID")
            console.log()
            const lastruta = await db_pool.one('SELECT id FROM ventas.ruta WHERE empleado_id = $1 ORDER BY id DESC LIMIT 1',
            [ruta.empleado_id]);
            console.log("---LAST RUTA")
            console.log(lastruta)
            /*console.log(lastruta.id)
            console.log(typeof lastruta.id)
            console.log("ruta.conductor_id")
            console.log(ruta.conductor_id)*/
            
            //return lastruta;/*
           /* const pedidos = await db_pool.manyOrNone('SELECT vp.id, vp.monto_total, vp.tipo, vp.fecha, vc.nombre, vc.apellidos,vc.telefono, vc.ubicacion, vc.direccion FROM ventas.pedido as vp' +
            const lastruta = await db_pool.one('SELECT id FROM ventas.ruta WHERE empleado_id = $1 ORDER BY id DESC LIMIT 1',
            ' INNER JOIN ventas.ruta as vr ON vp.ruta_id = vr.id' +
            ' INNER JOIN ventas.cliente as vc ON vp.cliente_id = vc.id WHERE ruta_id = $1',
            [lastruta.id]);
            //AND conductor_id = $2 AND estado = \'en proceso\'',
         //    [lastruta[0].id, ruta.conductor_id]);

            console.log("----pedidos")
            console.log(pedidos)*/
            

            
        const pedidos = await modelRuta.getPedidosByruta(lastruta.id)
        console.log("----rutassssssssss")
        console.log(ruta)
           
            //EMITIR UN EVENTO
         io.emit('creadoRuta',rutas)
          //  console.log("rutas")
           // console.log(rutas)
            return rutas

        }
        catch(e){
            throw new Error(`Error query create:${e}`)
        }
    },
    


    getLastRuta:async (empleado_id) => {
        try {
            const lastRuta =  await db_pool.one('SELECT id FROM ventas.ruta WHERE empleado_id = $1 ORDER BY id  DESC LIMIT 1',
            [empleado_id])
          //  console.log("ultima ruta")
           // console.log(lastRuta)
            return lastRuta
        } catch (error) {
            throw new Error(`Error query create:${error}`)
        }
    }
    
}
export default modelRuta;