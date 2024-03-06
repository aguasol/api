import { createDetalle,getDetalles,getDetallePedidoXPedidos,getDetallePedidosClientes } from "../controllers/relacion_detallepedido_controller.mjs";

import express from 'express';

const routerDetallePedido = express.Router();

routerDetallePedido.post('/detallepedido',createDetalle)
routerDetallePedido.get('/detallepedido',getDetalles)
routerDetallePedido.get('/detallepedido/:pedidoID',getDetallePedidoXPedidos)
routerDetallePedido.get('/productosPedido/:pedidoID',getDetallePedidosClientes)


export default routerDetallePedido