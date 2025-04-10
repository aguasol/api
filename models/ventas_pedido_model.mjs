import { Socket } from "socket.io";
import { db_pool, db_auth, db_cli, db_ped, db_ubi } from "../config.mjs";
import { io } from "../index.mjs";
import axios from "axios";

const modelPedido = {
  
  consultarDetallesConReintento: async (
    pedido,
    intentos = 0,
    cliente,
    pedidos_cr
  ) => {
    console.log(
      `⏳ Intento ${intentos + 1}: Consultando detalles para el pedido ${
        pedido.id
      }...`
    );
 
    const detalles = await db_pool.any(
      `SELECT producto_id, cantidad, promocion_id FROM relaciones.detalle_pedido WHERE pedido_id=$1`,
      [pedido.id]
    );

    if (detalles.length > 0) {
      console.log(
        `✅ Pedido ${pedido.id} tiene detalles disponibles:`,
        detalles
      );
      
      // Intentar encontrar el cliente en el microservicio
      let cliente_micro_id;
      
      try {
        // Buscar primero si el cliente ya existe
        const cliente_existente = await db_cli.oneOrNone(
          `SELECT id FROM public.cliente WHERE usuario_id = $1`,
          [cliente.usuario_id]
        );
        
        if (cliente_existente) {
          // Si el cliente existe, usar su ID
          cliente_micro_id = cliente_existente.id;
          console.log("Cliente existente encontrado con ID:", cliente_micro_id);
        } else {
          // Si el cliente no existe, insertarlo
          console.log("Cliente no encontrado, procediendo a insertarlo...");
          const nuevo_cliente = await db_cli.one(
            'INSERT INTO public.cliente (usuario_id, nombre, apellidos, fecha_nacimiento, sexo, dni, codigo, calificacion, suscripcion, ruc, fecha_creacion_cuenta, quiereretirar, medio_retiro, banco_retiro, numero_cuenta) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id',
            [
              cliente.usuario_id, 
              cliente.nombre, 
              cliente.apellidos, 
              cliente.fecha_nacimiento, 
              cliente.sexo, 
              cliente.dni, 
              cliente.codigo,
              cliente.calificacion,
              cliente.suscripcion, 
              cliente.ruc,
              cliente.fecha_creacion_cuenta,
              cliente.quiereretirar,
              cliente.medio_retiro, 
              cliente.banco_retiro, 
              cliente.numero_cuenta
            ]
          );
          cliente_micro_id = nuevo_cliente.id;
          console.log("Nuevo cliente insertado con ID:", cliente_micro_id);
        }
        
        // Continuar con la lógica de ubicación (común para ambos casos)
        // Buscar ubicación en el monolito
        const get_ubicacion = await db_pool.one(
          `SELECT * FROM relaciones.ubicacion WHERE id=$1`,
          [pedidos_cr.ubicacion_id]
        );
        console.log("Ubicación encontrada en monolito con ID:", get_ubicacion.id);
        
        // Insertar ubicación en el microservicio
        const ubi_micro_insert = await db_ubi.one(
          `INSERT INTO public.ubicacion
          (distrito, direccion, latitud, longitud, cliente_id) VALUES 
          ($1, $2, $3, $4, $5) RETURNING *`,
          [
            get_ubicacion.distrito,
            get_ubicacion.direccion,
            get_ubicacion.latitud,
            get_ubicacion.longitud,
            cliente_micro_id
          ]
        );
        console.log("Ubicación insertada en microservicio con ID:", ubi_micro_insert.id);
        
        // Obtener la última ubicación insertada
        const lastUbiMicro = await db_ubi.one(
          `SELECT id FROM public.ubicacion 
          WHERE cliente_id = $1 ORDER BY id DESC LIMIT 1`,
          [cliente_micro_id]
        );
        console.log("Última ubicación del cliente:", lastUbiMicro.id);
        
        // Realizar la petición POST al microservicio de pedidos
        const resultado = await axios.post(
          "http://147.182.251.164:8082/apigw/v1/pedido",
          {
            cliente_id: cliente_micro_id,
            descuento: pedido.descuento,
            fecha: pedido.fecha,
            tipo: pedido.tipo,
            estado: pedido.estado,
            observacion: pedido.observacion,
            tipo_pago: pedido.tipo_pago,
            ubicacion_id: lastUbiMicro.id,
            detalles: detalles,
          }
        );
        
        console.log("Resultado de la creación del pedido:");
        console.log("Status:", resultado.status);
        console.log("Data:", resultado.data);
        if (resultado.error) console.log("Error:", resultado.error);
        
      } catch (error) {
        console.error("Error en el proceso:", error);
      }
      
      return;
    }

    if (intentos < 3) {
      console.log("NO HAY DETALLE PEDIDO --<<<");
      setTimeout(() => {
        modelPedido.consultarDetallesConReintento(pedido, intentos + 1, cliente, pedidos_cr);
      }, 15000);
    } else {
      console.log("NO TIENE DETALLES DESPUÉS DE MÁXIMOS INTENTOS");
    }
  },

  createPedido: async (pedido) => {
    try {
      if (pedido.cliente_id) {
        // Si cliente_id existe, es un cliente registrado

        const pedidos_cr = await db_pool.one(
          `INSERT INTO ventas.pedido (cliente_id, subtotal,descuento,total, fecha, tipo, estado,ubicacion_id,observacion,beneficiado_id)
                        VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9,$10)
                        RETURNING *
                        `,
          [
            pedido.cliente_id,
            pedido.subtotal,
            pedido.descuento,
            pedido.total,
            pedido.fecha,
            pedido.tipo,
            pedido.estado,
            pedido.ubicacion_id,
            pedido.observacion,
            pedido.beneficiado_id,
          ]
        );
        //aqui agregar recibir  el beneficiado idddddddddddddddddddddddd
        /*console.log("pedidos cr");
                console.log(pedidos_cr);
                console.log(pedidos_cr.id);*/
        const cliente = await db_pool.one(
          `SELECT * FROM ventas.cliente
                    WHERE id=$1`,
          [pedido.cliente_id]
        );

        const pedidoss = await db_pool.one(
          `SELECT vp.id, vp.subtotal, vp.descuento, vp.total, vp.ruta_id, vp.fecha, vp.estado, vp.tipo, vp.observacion,
                        vc.nombre, vc.apellidos, vc.telefono, rub.latitud, rub.longitud, rub.distrito
                        FROM ventas.pedido as vp
                        FULL JOIN ventas.cliente as vc ON vp.cliente_id = vc.id
                        FULL JOIN relaciones.ubicacion as rub ON vp.ubicacion_id = rub.id
                        WHERE estado = \'pendiente\' AND vp.id = $1;
                        `,
          [pedidos_cr.id]
        );

        // PEDIDOS SOCKET
        // console.log('nuevoPedido Emitido');
        // ENVIANDO EL PEDIDO A LA COLA

        io.emit("nuevoPedido", pedidoss);
        setTimeout(async () => {
          await modelPedido.consultarDetallesConReintento(
            pedidoss,
            2,
            cliente,
            pedidos_cr
          ); // 2000 ms = 2 segundos de retraso
        }, 31000);
        //await sendPedidoRabbit(pedidos_cr)
        return pedidoss;

        //  console.log(resultado)
        //return resultado
      } else {
        // Si cliente_id es nulo, es un cliente no registrado
        const pedidos_nr = await db_pool.one(
          `INSERT INTO ventas.pedido (cliente_nr_id, subtotal,descuento,total, fecha, tipo, estado,observacion, ubicacion_id)
                        VALUES ($1, $2, $3, $4, $5,$6,$7,$8,$9)
                        RETURNING *`,
          [
            pedido.cliente_nr_id,
            pedido.subtotal,
            pedido.descuento,
            pedido.total,
            pedido.fecha,
            pedido.tipo,
            pedido.estado,
            pedido.observacion,
            pedido.ubicacion_id,
          ]
        );
        /* console.log("pedidos nr");
                 console.log(pedidos_nr);*/

        // ENVIANDO EL PEDIDO A LA COLA
        // await sendPedidoRabbit(pedidos_nr)

        const pedidoss = await db_pool.one(
          `SELECT vp.id, vp.subtotal, vp.descuento, vp.total, vp.ruta_id, vp.fecha, vp.estado, vp.tipo, vp.observacion,
      vc.nombre, vc.apellidos, vc.telefono, rub.latitud, rub.longitud, rub.distrito
FROM ventas.pedido as vp
FULL JOIN ventas.cliente as vc ON vp.cliente_id = vc.id
FULL JOIN relaciones.ubicacion as rub ON vp.ubicacion_id = rub.id
WHERE (estado = 'pendiente' or estado = 'pagado') AND vp.id = $1;`,
          [pedidos_nr.id]
        );

        // PEDIDOS SOCKET
        io.emit("nuevoPedido", pedidoss);
        return pedidoss;
      }
    } catch (e) {
      throw new Error(`Error query create:${e}`);
    }
  },
  // UPDATE ANULADO CLIENTE MICROSERVICIO
  anularPedidoCliente: async (pedidoId, motivo) => {
    try {
      const result = await db_pool.oneOrNone(
        `UPDATE ventas.pedido SET 
                estado = 'anulado',observacion = $1 WHERE id = $2 RETURNING *`,
        [motivo.motivoped, pedidoId]
      );
      /*const busquedaAguaSol = await db_pool.one(`SELECT cliente_id FROM ventas.pedido WHERE id = $1`,[pedidoId])

      const busquedaMicroservicio = await db_ped.one(`SELECT id FROM public.pedido WHERE cliente_id = $1`,[busquedaAguaSol.cliente_id])

      await axios.put(`http://147.182.251.164:8082/apigw/v1/pedido_anulado/${busquedaMicroservicio.id}`,
        {
          observacion:"Anulado por cliente"
        },
        {
          headers:{
            "Content-Type":"application/json"
          }
        }
      )*/

      io.emit("pedidoanulado", result);

      return result;
    } catch (error) {
      throw new Error(`Error query update:${error.message}`);
    }
  },

  getLastPedido: async (id) => {
    try {
      const lastPedido = await db_pool.oneOrNone(
        "SELECT id FROM ventas.pedido WHERE cliente_id=$1 ORDER BY id DESC LIMIT 1",
        [id]
      );
      return lastPedido;
    } catch (e) {
      throw new Error(`Error getting last pedido: ${e}`);
    }
  },

  getPedido: async (empleadoID) => {
    // console.log("dentro de get para conductores")

    try {
      /*
            const pedidos = await db_pool.any(`
            
                SELECT
                vp.id,
                vp.subtotal,
                vp.descuento,
                vp.total,
                vp.ruta_id,
                vp.fecha,
                vp.estado,
                vp.tipo,
                vp.observacion,
                rub.latitud,
                rub.longitud,
                rub.distrito,
                COALESCE(vc.nombre, vcnr.nombre) as nombre,
                COALESCE(vc.apellidos, vcnr.apellidos) as apellidos,
                COALESCE(vc.telefono, vcnr.telefono) as telefono
                
            FROM
                ventas.pedido as vp
            LEFT JOIN ventas.cliente as vc ON vp.cliente_id = vc.id
            LEFT JOIN ventas.cliente_noregistrado as vcnr ON vp.cliente_nr_id = vcnr.id
            LEFT JOIN relaciones.ubicacion as rub ON vp.ubicacion_id = rub.id
            WHERE estado = \'pendiente\' ORDER BY vp.id ASC;`);
*/
      // console.log(pedidos)
      // console.log("Iniciando prueba")
      const pedidos = await db_pool.any(
        `WITH AdministradorZona AS (
    SELECT pa.zona_trabajo_id
    FROM personal.empleado AS pe
    INNER JOIN personal.administrador AS pa ON pe.administrador_id = pa.id
    WHERE pe.id = $1
)

SELECT
    vp.id,
    vp.subtotal,
    vp.descuento,
    vp.total,
    vp.ruta_id,
    vp.fecha,
    vp.estado,
    vp.tipo,
    vp.observacion,
    rub.latitud,
    rub.longitud,
    rub.distrito,
    COALESCE(vc.nombre, vcnr.nombre) AS nombre,
    COALESCE(vc.apellidos, vcnr.apellidos) AS apellidos,
    COALESCE(vc.telefono, vcnr.telefono) AS telefono
FROM
    ventas.pedido AS vp
LEFT JOIN ventas.cliente AS vc ON vp.cliente_id = vc.id
LEFT JOIN ventas.cliente_noregistrado AS vcnr ON vp.cliente_nr_id = vcnr.id
LEFT JOIN relaciones.ubicacion AS rub ON vp.ubicacion_id = rub.id

INNER JOIN AdministradorZona AS az ON rub.zona_trabajo_id = az.zona_trabajo_id
WHERE
    vp.estado = 'pendiente' or vp.estado = 'pagado'
ORDER BY
    vp.id ASC;`,
        [empleadoID]
      );
      // console.log(pedidos)

      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },

  getPedidoEmpleado: async (empleadoID) => {
    try {
      //console.log("empleado id")
      //console.log(empleadoID)
      const pedidos = await db_pool.any(
        `select
            vr.id as idruta,
            vp.id as npedido,
            vp.estado,
            vp.tipo,
            vp.fecha,
            vp.total,
            pc.nombres,
            vv.nombre_modelo as vehiculo
            from ventas.ruta as vr
            inner join ventas.pedido as vp on vr.id=vp.ruta_id
            inner join ventas.vehiculo as vv on vr.vehiculo_id=vv.id
            inner join personal.conductor as pc on vr.conductor_id = pc.id
            inner join personal.empleado as pe on vr.empleado_id = pe.id
            where pe.id=$1`,
        [empleadoID]
      );
      //  console.log("pedidos")
      //  console.log(pedidos)
      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido ${error}`);
    }
  },

  getTotalEntregadosPedidos: async (empleadoID) => {
    try {
      const montototal = await db_pool.any(
        `
            select sum(vp.total) as monto_entregados from ventas.pedido as vp
             inner join ventas.ruta as vr on vp.ruta_id=vr.id
              where vp.estado='entregado' and vr.empleado_id=$1;
            `,
        [empleadoID]
      );

      const totalestados = await db_pool.any(
        `SELECT 
                (SELECT COUNT(*) FROM ventas.pedido as vp 
                 INNER JOIN ventas.ruta as vr on vp.ruta_id=vr.id
                 WHERE vp.estado = 'pendiente' AND vr.empleado_id = $1) AS pendientes,
                (SELECT COUNT(*) FROM ventas.pedido as vp 
                 INNER JOIN ventas.ruta as vr on vp.ruta_id=vr.id
                 WHERE vp.estado = 'en proceso' AND vr.empleado_id = $1) AS en_proceso,
                (SELECT COUNT(*) FROM ventas.pedido as vp 
                 INNER JOIN ventas.ruta as vr on vp.ruta_id=vr.id
                 WHERE vp.estado = 'entregado' AND vr.empleado_id = $1) AS entregados,
                 (SELECT COUNT(*) FROM ventas.pedido as vp
                 INNER JOIN ventas.ruta as vr ON vp.ruta_id=vr.id
                 WHERE vp.estado = 'truncado' AND vr.empleado_id = $1) AS truncados;`,
        [empleadoID]
      );
      return {
        costo_entregados: montototal[0].monto_entregados,
        pendiente: totalestados[0].pendientes,
        proceso: totalestados[0].en_proceso,
        entregados: totalestados[0].entregados,
        truncados: totalestados[0].truncados,
      };
    } catch (error) {
      throw new Error(`Error getTotal ${error}`);
    }
  },

  getPedidoConductor: async (rutaID) => {
    //  console.log("dentro de get Pedidos para Conductores....")

    try {
      const pedidos = await db_pool.any(
        `
            SELECT 
            vp.id, 
            vp.tipo_pago,
            vp.total, 
            vp.fecha, 
            vp.estado,
            vp.tipo, 
            vp.beneficiado_id,
            vp.observacion, 
            COALESCE(vc.nombre, vcnr.nombre) as nombre,
            COALESCE(vc.apellidos, vcnr.apellidos) as apellidos,
            COALESCE(vc.telefono, vcnr.telefono) as telefono,
            rub.latitud,
			rub.longitud,
            rub.direccion
            FROM ventas.ruta as vr
            INNER JOIN ventas.pedido as vp ON vr.id = vp.ruta_id
            LEFT JOIN ventas.cliente as vc ON vp.cliente_id = vc.id
            LEFT JOIN ventas.cliente_noregistrado as vcnr ON vp.cliente_nr_id = vcnr.id
            LEFT JOIN relaciones.ubicacion as rub ON vp.ubicacion_id = rub.id
                WHERE ruta_id=$1 ORDER BY vp.id ASC`,
        [rutaID]
      );
      //console.log(pedidos)
      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },
  getPedidosCliente: async (clienteID) => {
    //console.log("dentro de get Pedidos para Clientes....")

    try {
      const pedidos = await db_pool.any(
        `SELECT vp.id, vp.estado, vp.subtotal,  vp.descuento, vp.total, vp.tipo_pago, vp.tipo, vp.fecha, rub.direccion, rub.distrito FROM ventas.pedido as vp INNER JOIN relaciones.ubicacion AS rub ON rub.id=vp.ubicacion_id WHERE vp.cliente_id=$1`,
        [clienteID]
      );
      // console.log(pedidos)
      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },

  deletePedido: async (id) => {
    try {
      const result = await db_pool.result(
        "DELETE FROM ventas.pedido WHERE ID = $1",
        [id]
      );
      return result.rowCount === 1; // Devuelve true si se eliminó un registro, false si no se encontró el registro
    } catch (error) {
      throw new Error(`Error en la eliminación del pedido: ${error.message}`);
    }
  },

  //UPDATE DE CONDUCTORRRRRRR
  updateEstadoPedido: async (pedidoID, newDatos) => {
    try {
      //   console.log('entro a update')
      const result = await db_pool.oneOrNone(
        "UPDATE ventas.pedido SET estado = $1,foto=$2,observacion=$3,tipo_pago=$4 WHERE id = $5 RETURNING *",
        [
          newDatos.estado,
          newDatos.foto,
          newDatos.observacion,
          newDatos.tipo_pago,
          pedidoID,
        ]
      );
      const pedido = await db_pool.oneOrNone(
        "SELECT descuento, beneficiado_id FROM ventas.pedido WHERE id = $1",
        [pedidoID]
      );

      if (pedido.beneficiado_id) {
        //console.log('beneficiado si existe')
        const saldo = await db_pool.oneOrNone(
          `SELECT saldo_beneficios FROM ventas.cliente WHERE id=$1`,
          [pedido.beneficiado_id]
        );
        //el beneficio por codigo seria igual al descuento/12 * 3
        const nuevoSaldo = saldo.saldo_beneficios + (pedido.descuento / 12) * 3;
        await db_pool.oneOrNone(
          `UPDATE ventas.cliente SET saldo_beneficios= $1 WHERE id = $2`,
          [nuevoSaldo, pedido.beneficiado_id]
        );
      } else {
        // console.log("no existe beneficiado :c ")
      }

      if (!result) {
        throw new Error(`No se encontró un pedido con ID ${id}.`);
      }
      return result;
    } catch (error) {
      throw new Error(`Error en la actualización del pedido: ${error.message}`);
    }
  },
  updateRutaPedido: async (id, ruta) => {
    try {
      const result = await db_pool.oneOrNone(
        "UPDATE ventas.pedido SET ruta_id = $1,estado = $2 WHERE id = $3 RETURNING *",
        [ruta.ruta_id, ruta.estado, id]
      );
      if (!result) {
        return { Message: "No se encontró un pedido con ese ID" };
      }
      io.emit("pedidoañadido", result);
      return { result };
    } catch (error) {
      throw new Error(`Error en la actualización del pedido: ${error.message}`);
    }
  },
  getPedidosNew: async (id) => {
    try {
      // console.log("id---")
      //console.log(id)
      const pedidosEmpleado = await db_pool.any(
        `
            select vp.id,
            vp.ruta_id,
            vp.subtotal,
            vp.descuento,
            vp.total,
            vp.fecha,
            vp.tipo,
            vp.estado,
            ru.latitud,
            ru.longitud,
            ru.distrito,
            pe.id as empleado,
            COALESCE (vc.nombre,vcnr.nombre) as nombre,
            COALESCE (vc.apellidos,vcnr.apellidos) as apellidos,
            COALESCE (vc.telefono,vcnr.telefono) as telefono
            from ventas.pedido as vp
            left join relaciones.ubicacion as ru on vp.ubicacion_id=ru.id
            left join ventas.cliente as vc on vp.cliente_id=vc.id
            left join ventas.cliente_noregistrado as vcnr on vp.cliente_nr_id=vcnr.id
            left join personal.administrador as pa on pa.zona_trabajo_id=ru.zona_trabajo_id
            left join personal.empleado as pe on pe.administrador_id=pa.id where pe.id=$1;
            `,
        [id]
      );
      // console.log("---pedidos new---")
      return pedidosEmpleado;
    } catch (error) {
      throw new Error(`Error query getPedidosNew ${error}`);
    }
  },
  updateEstadoRuta: async (pedidoId) => {
    try {
      const result = await db_pool.oneOrNone(
        `UPDATE ventas.pedido SET ruta_id = null,
                estado = 'pendiente' WHERE id = $1 RETURNING *`,
        [pedidoId]
      );
      return result;
    } catch (error) {
      throw new Error(`Error query update:${error.message}`);
    }
  },
  updateEstadoRutaCancelado: async (pedidoId, motivo) => {
    try {
      const result = await db_pool.oneOrNone(
        `UPDATE ventas.pedido SET 
                estado = 'anulado',observacion = $1 WHERE id = $2 RETURNING *`,
        [motivo.motivoped, pedidoId]
      );

      io.emit("pedidoanulado", result);

      return result;
    } catch (error) {
      throw new Error(`Error query update:${error.message}`);
    }
  },
  updatePedido: async (pedidoID, newDatos) => {
    try {
      const result = await db_pool.oneOrNone(
        "UPDATE ventas.pedido SET total = $1,fecha = $2,estado=$3, observacion=$4 WHERE id = $5 RETURNING *",
        [
          newDatos.totalpago,
          newDatos.fechaped,
          newDatos.estadoped,
          newDatos.observacion,
          pedidoID,
        ]
      );
      if (!result) {
        return { Message: "No se encontró un pedido con ese ID" };
      }
      io.emit("pedidomodificado", result);
      return { result };
    } catch (error) {
      throw new Error(`Error en la actualización del pedido: ${error.message}`);
    }
  },

  getPedidoDesktop: async (empleadoID) => {
    // console.log("dentro de get para conductores")

    try {
      const pedidos = await db_pool.any(
        `WITH AdministradorZona AS (
    SELECT pa.zona_trabajo_id
    FROM personal.empleado AS pe
    INNER JOIN personal.administrador AS pa ON pe.administrador_id = pa.id
    WHERE pe.id = $1
)

SELECT
    vp.id,
    vp.subtotal,
    vp.descuento,
    vp.total,
    vp.ruta_id,
    vp.fecha,
    vp.estado,
    vp.tipo,
    vp.observacion,
    rub.distrito,
    rub.latitud,
    rub.longitud,
    COALESCE(vc.nombre, vcnr.nombre) AS nombre,
    COALESCE(vc.apellidos, vcnr.apellidos) AS apellidos,
    COALESCE(vc.telefono, vcnr.telefono) AS telefono
FROM
    ventas.pedido AS vp
LEFT JOIN ventas.cliente AS vc ON vp.cliente_id = vc.id
LEFT JOIN ventas.cliente_noregistrado AS vcnr ON vp.cliente_nr_id = vcnr.id
LEFT JOIN relaciones.ubicacion AS rub ON vp.ubicacion_id = rub.id
INNER JOIN AdministradorZona AS az ON rub.zona_trabajo_id = az.zona_trabajo_id
ORDER BY
    vp.id ASC;`,
        [empleadoID]
      );
      // console.log(pedidos)

      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },

  getAllPedidoDesktop: async () => {
    // console.log("dentro de get para conductores")

    try {
      const pedidos = await db_pool.any(`
SELECT
    vp.id,
    vp.subtotal,
    vp.descuento,
    vp.total,
    vp.ruta_id,
    vp.fecha,
    vp.estado,
    vp.tipo,
    vp.observacion,
    rub.distrito,
    rub.latitud,
    rub.longitud,
    rub.direccion,
    COALESCE(vc.nombre, vcnr.nombre) AS nombre,
    COALESCE(vc.apellidos, vcnr.apellidos) AS apellidos,
    COALESCE(vc.telefono, vcnr.telefono) AS telefono,
    vc.quiereretirar
FROM
    ventas.pedido AS vp
LEFT JOIN ventas.cliente AS vc ON vp.cliente_id = vc.id
LEFT JOIN ventas.cliente_noregistrado AS vcnr ON vp.cliente_nr_id = vcnr.id
LEFT JOIN relaciones.ubicacion AS rub ON vp.ubicacion_id = rub.id
WHERE vp.estado = 'en proceso'
    ORDER BY
    vp.id ASC;`);
      // console.log(pedidos)

      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },

  // ENDPOINTS FLASH DE CONDUCTOR PARA MANEJAR ESTADOS DE PEDIDOS

  // ACEPTAR
  updateEstadoPedidosConductor: async (id, data) => {
    try {
      const resultado = await db_pool.one(
        `
            UPDATE ventas.pedido SET estado = $1 WHERE id = $2 RETURNING *`,
        [data.estado, id]
      );

      // EVENTO PARA EL WS
      io.emit("aceptado", resultado);

      // RETURN PARA EL CLIENTE
      return resultado;
    } catch (error) {
      throw new Error(`Error update pedido: ${error}`);
    }
  },

  // ENTREGAR
  updateEstadoPedidosConductordos: async (id, data) => {
    try {
    } catch (error) {}
  },

  getpedidosinformefecha: async (data) => {
    try {
      const result = await db_pool.any(
        `
                SELECT * FROM ventas.pedido WHERE DATE(fecha)=$1 ORDER BY id ASC `,
        [data.fecha]
      );
      return result;
    } catch (error) {
      throw new Error(`Error get pedido: ${error}`);
    }
  },

  getAllPedidoPendienteTotales: async () => {
    // console.log("dentro de get para conductores")
    //TODOS LOS PEDIDOS EN GENERAL ENDPOINT PARA IDENTIFICAR BENEFICIADOS
    try {
      const pedidos = await db_pool.any(`
SELECT
    vp.id,
    vp.subtotal,
    vp.descuento,
    vp.total,
    vp.ruta_id,
    vp.fecha,
    vp.estado,
    vp.tipo,
    vp.beneficiado_id,
    vcb.nombre AS beneficiado_nombre,
    vcb.apellidos AS beneficiado_apellidos,
    vp.observacion,
    rub.distrito,
    rub.latitud,
    rub.longitud,
    rub.direccion,
    COALESCE(vc.nombre, vcnr.nombre) AS nombre,
    COALESCE(vc.apellidos, vcnr.apellidos) AS apellidos,            
    COALESCE(vc.telefono, vcnr.telefono) AS telefono,
    vc.quiereretirar
FROM
    ventas.pedido AS vp
LEFT JOIN ventas.cliente AS vc ON vp.cliente_id = vc.id
LEFT JOIN ventas.cliente_noregistrado AS vcnr ON vp.cliente_nr_id = vcnr.id
LEFT JOIN relaciones.ubicacion AS rub ON vp.ubicacion_id = rub.id
LEFT JOIN ventas.cliente AS vcb ON vp.beneficiado_id = vcb.id
WHERE vp.estado = 'pendiente'
ORDER BY
    vp.id DESC;`);
      // console.log(pedidos)

      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },

  //MONTOS ENTREGADOS

  getAllEntregado: async () => {
    // console.log("dentro de get para conductores")

    try {
      const pedidos = await db_pool.any(`
SELECT SUM(vp.total) AS total_pedidos_entregados
FROM ventas.pedido AS vp
WHERE vp.estado = 'entregado';`);
      // console.log(pedidos)

      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },

  //MONTOS PENDIENTES

  getAllPendiente: async () => {
    // console.log("dentro de get para conductores")

    try {
      const pedidos = await db_pool.any(`
SELECT SUM(vp.total) AS total_pedidos_entregados
FROM ventas.pedido AS vp
WHERE vp.estado = 'pendiente';`);
      // console.log(pedidos)

      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },

  //CONTEO DE LOS PEDIDOS ENTREGADOS
  getAllCountEntregado: async () => {
    // console.log("dentro de get para conductores")

    try {
      const pedidos = await db_pool.any(`
SELECT COUNT(*) AS total_pedidos_entregados
FROM ventas.pedido AS vp
WHERE vp.estado = 'entregado';`);
      // console.log(pedidos)

      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },

  //CONTEO DE LOS PEDIDOS EN PROCESO
  getAllCountProceso: async () => {
    // console.log("dentro de get para conductores")

    try {
      const pedidos = await db_pool.any(`
SELECT COUNT(*) AS total_pedidos_proceso
FROM ventas.pedido AS vp
WHERE vp.estado = 'en proceso';`);
      // console.log(pedidos)

      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },

  getAllPedidoDesktopTotales: async () => {
    // console.log("dentro de get para conductores")
    //TODOS LOS PEDIDOS EN GENERAL ENDPOINT PARA IDENTIFICAR BENEFICIADOS
    try {
      const pedidos = await db_pool.any(
        `SELECT
    vp.id,
    vp.subtotal,
    vp.descuento,
    vp.total,
    vp.ruta_id,
    vp.fecha,
    vp.estado,
    vp.tipo,
    vp.beneficiado_id,
    vcb.nombre AS beneficiado_nombre,
    vcb.apellidos AS beneficiado_apellidos,
    vp.observacion,
    rub.distrito,
    rub.latitud,
    rub.longitud,
    rub.direccion,
    COALESCE(vc.nombre, vcnr.nombre) AS nombre,
    COALESCE(vc.apellidos, vcnr.apellidos) AS apellidos,            
    COALESCE(vc.telefono, vcnr.telefono) AS telefono,
    vc.quiereretirar
FROM
    ventas.pedido AS vp
LEFT JOIN ventas.cliente AS vc ON vp.cliente_id = vc.id
LEFT JOIN ventas.cliente_noregistrado AS vcnr ON vp.cliente_nr_id = vcnr.id
LEFT JOIN relaciones.ubicacion AS rub ON vp.ubicacion_id = rub.id
LEFT JOIN ventas.cliente AS vcb ON vp.beneficiado_id = vcb.id
ORDER BY
    vp.id DESC;`
      );
      // console.log(pedidos)

      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },

  //CONTEO DE PEDIDOS PENDIENTES
  getAllCountPendiente: async () => {
    // console.log("dentro de get para conductores")

    try {
      const pedidos = await db_pool.any(`
SELECT COUNT(*) AS total_pedidos_pendiente
FROM ventas.pedido AS vp
WHERE vp.estado = 'pendiente';`);
      // console.log(pedidos)

      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },

  // endpoints nuevos 2 dicimbre

  getAllPedidoDesktopEntregado: async () => {
    // console.log("dentro de get para conductores")

    try {
      const pedidos = await db_pool.any(`
SELECT
    vp.id,
    vp.subtotal,
    vp.descuento,
    vp.total,
    vp.ruta_id,
    vp.fecha,
    vp.estado,
    vp.tipo,
    vp.observacion,
    rub.distrito,
    rub.latitud,
    rub.longitud,
    rub.direccion,
    COALESCE(vc.nombre, vcnr.nombre) AS nombre,
    COALESCE(vc.apellidos, vcnr.apellidos) AS apellidos,
    COALESCE(vc.telefono, vcnr.telefono) AS telefono,
    vc.quiereretirar
FROM
    ventas.pedido AS vp
LEFT JOIN ventas.cliente AS vc ON vp.cliente_id = vc.id
LEFT JOIN ventas.cliente_noregistrado AS vcnr ON vp.cliente_nr_id = vcnr.id
LEFT JOIN relaciones.ubicacion AS rub ON vp.ubicacion_id = rub.id
WHERE vp.estado = 'entregado'
    ORDER BY
    vp.id DESC;`);
      // console.log(pedidos)

      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },

  getAllPedidoDesktopEntregadoMes: async () => {
    // console.log("dentro de get para conductores")

    try {
      const pedidos = await db_pool.any(`
SELECT
    vp.id,
    vp.subtotal,
    vp.descuento,
    vp.total,
    vp.ruta_id,
    vp.fecha,
    vp.estado,
    vp.tipo,
    vp.observacion,
    rub.distrito,
    rub.latitud,
    rub.longitud,
    rub.direccion,
    COALESCE(vc.nombre, vcnr.nombre) AS nombre,
    COALESCE(vc.apellidos, vcnr.apellidos) AS apellidos,
    COALESCE(vc.telefono, vcnr.telefono) AS telefono,
    vc.quiereretirar
FROM
    ventas.pedido AS vp
LEFT JOIN ventas.cliente AS vc ON vp.cliente_id = vc.id
LEFT JOIN ventas.cliente_noregistrado AS vcnr ON vp.cliente_nr_id = vcnr.id
LEFT JOIN relaciones.ubicacion AS rub ON vp.ubicacion_id = rub.id
WHERE vp.estado = 'entregado'
    AND vp.fecha >= DATE_TRUNC('month', CURRENT_DATE) -- Primer día del mes actual
    AND vp.fecha < DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') -- Primer día del próximo mes
ORDER BY
    vp.id DESC;`);
      // console.log(pedidos)

      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },

  getAllPedidoDesktopEntregadoDia: async () => {
    // console.log("dentro de get para conductores")

    try {
      const pedidos = await db_pool.any(`
SELECT
    vp.id,
    vp.subtotal,
    vp.descuento,
    vp.total,
    vp.ruta_id,
    vp.fecha,
    vp.estado,
    vp.tipo,
    vp.observacion,
    rub.distrito,
    rub.latitud,
    rub.longitud,
    rub.direccion,
    COALESCE(vc.nombre, vcnr.nombre) AS nombre,
    COALESCE(vc.apellidos, vcnr.apellidos) AS apellidos,
    COALESCE(vc.telefono, vcnr.telefono) AS telefono,
    vc.quiereretirar
FROM
    ventas.pedido AS vp
LEFT JOIN ventas.cliente AS vc ON vp.cliente_id = vc.id
LEFT JOIN ventas.cliente_noregistrado AS vcnr ON vp.cliente_nr_id = vcnr.id
LEFT JOIN relaciones.ubicacion AS rub ON vp.ubicacion_id = rub.id
WHERE vp.estado = 'entregado'
    AND DATE(vp.fecha) = CURRENT_DATE -- Filtrar solo los pedidos del día actual
ORDER BY
    vp.id DESC;`);
      // console.log(pedidos)

      return pedidos;
    } catch (error) {
      throw new Error(`Error getting pedido: ${error}`);
    }
  },
};

export default modelPedido;
