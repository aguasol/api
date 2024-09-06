import { createPedidos,getPedidosDesktop,updateEstadoRutaCancelados,updatePedidos, getLastPedidos,getTotalEntregados,updateEstadoRutas,getPedidosNews,getPedidos,getPedidosClientes, deletePedidos,updateEstadoPedidos, updateRutaPedidos,getPedidosConductor, getPedidoEmpleados,getAllPedidosDesktop} from '../controllers/ventas_pedido_controller.mjs';

import express from 'express';

const routerVentasPedido = express.Router();
routerVentasPedido.get('/pedido/:empleadoid',getPedidos)
routerVentasPedido.post('/pedido',createPedidos)
routerVentasPedido.get('/pedido_cliente/:clienteID',getPedidosClientes)
routerVentasPedido.get('/pedidoEmpleado/:empleadoID',getPedidosNews)
routerVentasPedido.get('/pedido_conductor/:rutaID',getPedidosConductor) // modificado
routerVentasPedido.get('/pedido_last/:clienteID',getLastPedidos)
routerVentasPedido.delete('/pedido/:pedidoID', deletePedidos)
routerVentasPedido.put('/pedido_conductor/:pedidoID', updateEstadoPedidos)
routerVentasPedido.put('/pedidoruta/:pedidoID',updateRutaPedidos)
routerVentasPedido.get('/empleadopedido/:empleadoID',getPedidoEmpleados)
routerVentasPedido.get('/totalventas_empleado/:empleadoID',getTotalEntregados)
routerVentasPedido.delete('/revertirpedido/:idpedido',updateEstadoRutas)
routerVentasPedido.delete('/revertirpedidocan/:idpedido',updateEstadoRutaCancelados)
routerVentasPedido.put('/pedidoModificado/:pedidoID',updatePedidos)
routerVentasPedido.get('/pedidoDesktop/:empleadoid',getPedidosDesktop)
routerVentasPedido.put('/estadoflash/:pedidoID',updateEstadoFlash)
// cambios pato
routerVentasPedido.get('/pedidosDesktop',getAllPedidosDesktop)
export default routerVentasPedido;