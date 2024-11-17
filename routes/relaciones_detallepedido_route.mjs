import { getDetallePedidoXPedidosXPromos,createDetalle,getDetalles,getDetallePedidoXPedidos,getDetallePedidosClientes , getDetallePedidosXRuta} from "../controllers/relacion_detallepedido_controller.mjs";
import express from 'express';

const routerDetallePedido = express.Router();

routerDetallePedido.post('/detallepedido',createDetalle)
routerDetallePedido.get('/detallepedido',getDetalles)
routerDetallePedido.get('/detallepedido/:pedidoID',getDetallePedidoXPedidos)
routerDetallePedido.get('/detallepedidoRuta/:rutaID',getDetallePedidosXRuta)
routerDetallePedido.get('/productosPedido/:pedidoID',getDetallePedidosClientes)
routerDetallePedido.get('/detallepedidopromo/:pedidoID',getDetallePedidoXPedidosXPromos)


export default routerDetallePedido