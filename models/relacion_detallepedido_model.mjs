import { db_pool } from "../config.mjs";
console.log("--------# 2.0 detallepedido")
const cuenta = 0 
const modelDetallePedido = {
    createDetallePedido: async (detalle) => {
        console.log("---- 2.- model detalle pedido")
        const paquete = await db_pool.connect();
        try {
            if (detalle.cliente_id) {
                // Si cliente_id existe, es un cliente registrado
                const resultado = await paquete.tx(async (t) => {
                    console.log("----------CREADO DE DETALLE PEDIDO-------------");
                    // Obtener el último ID de pedido
                    const lastPedido = await db_pool.one('SELECT id FROM ventas.pedido WHERE cliente_id = $1 ORDER BY id DESC LIMIT 1',
                        [detalle.cliente_id]);

                    const detallepedido = await db_pool.one('INSERT INTO relaciones.detalle_pedido(pedido_id, producto_id, cantidad,promocion_id) VALUES($1, $2, $3,$4) RETURNING *',
                        [lastPedido.id, detalle.producto_id, detalle.cantidad, detalle.promocion_id]
                    );
                    console.log("DETALLE PEDIDO INSERTADO")
                    console.log(detallepedido)
                    cuenta++
                    console.log("cuenta")
                    console.log(cuenta)
                    return detallepedido;

                })
                console.log(resultado)
                return resultado


            } else {
                const resultado = await paquete.tx(async (t) => {
                    // Si cliente_id es nulo, es un cliente no registrado
                    console.log("----------CREADO DE DETALLE PEDIDO-------------");
                    // Obtener el último ID de pedido
                    const lastPedido = await db_pool.one('SELECT id FROM ventas.pedido WHERE cliente_nr_id = $1 ORDER BY id DESC LIMIT 1',
                        [detalle.cliente_nr_id]);

                    const detallepedido = await db_pool.one('INSERT INTO relaciones.detalle_pedido(pedido_id, producto_id, cantidad,promocion_id) VALUES($1, $2, $3,$4) RETURNING *',
                        [lastPedido.id, detalle.producto_id, detalle.cantidad, detalle.promocion_id]
                    );
                    console.log("DETALLE PEDIDO INSERTADO")
                    console.log(detallepedido)
                    return detallepedido;
                })
                return resultado

            }


        } catch (error) {
            throw new Error(`Error query create: ${error}`);
        }
    },
    getDetallePedido: async () => {
        console.log("---- 2.- model get pedido")

        try {
            const pedidos = await db_pool.any('SELECT * FROM relaciones.detalle_pedido')
            return pedidos
        } catch (error) {
            throw new Error(`Error query get: ${error}`);
        }
    },
    getDetallePedidoXRuta: async (rutaID) => {
        console.log("---- 2.- model getDetallexRuta")

        try {
            const pedidos = await db_pool.any('select rdp.id, producto_id, vprod.nombre as nombre_prod, pedido_id, promocion_id, vprom.nombre as nombre_prom, cantidad from ventas.pedido as vp inner join relaciones.detalle_pedido as rdp on vp.id=rdp.pedido_id inner join ventas.producto as vprod on vprod.id=rdp.producto_id full join ventas.promocion as vprom on vprom.id=rdp.promocion_id  where ruta_id=$1', [rutaID])
            return pedidos
        } catch (error) {
            throw new Error(`Error query get: ${error}`);
        }
    },

    getDetallePedidoXPedido: async (pedidoID) => {
        console.log("---- 2.- model getDetallexPedido")

        try {
            const pedidos = await db_pool.any('SELECT pedido_id,producto_id, nombre as  nombre_prod ,cantidad FROM relaciones.detalle_pedido as rdp inner join ventas.producto as vp ON rdp.producto_id=vp.id WHERE pedido_id=$1', [pedidoID])
            return pedidos
        } catch (error) {
            throw new Error(`Error query get: ${error}`);
        }
    },

    getDetallePedidoCliente: async (pedidoID) => {
        console.log("---- 2.- model getDetallePedidoCliente")

        try {
            const productos = await db_pool.any('SELECT vp.id ,rdp.producto_id , vprod.nombre as producto_nombre, rdp.cantidad, vprod.foto,rdp.promocion_id, vprom.nombre as promocion_nombre, rpp.cantidad as cantidad_por_promo FROM ventas.pedido as vp INNER JOIN relaciones.detalle_pedido as rdp ON rdp.pedido_id = vp.id INNER JOIN ventas.producto as vprod ON vprod.id=rdp.producto_id FULL JOIN ventas.promocion AS vprom ON rdp.promocion_id =vprom.id FULL JOIN relaciones.producto_promocion AS rpp ON rpp.promocion_id=rdp.promocion_id WHERE vp.id=$1', [pedidoID])
            return productos
        } catch (error) {
            throw new Error(`Error query get: ${error}`);
        }
    }
}
export default modelDetallePedido;
