import { createRutas,getAllRutasEmpleadoDesktop, getAllRutasEmpleado,getLastRutasAll, getfechapedidosrutas, getLastRutas,getLastRutasConductor,getPedidosByrutas, getlastrutaconductorfast } from "../controllers/ventas_ruta_controller.mjs";
import express from 'express';
const routerVentasRuta = express.Router();
routerVentasRuta.get('/allrutas_empleado/:empleadoId',getAllRutasEmpleado)
routerVentasRuta.post('/ruta',createRutas)
routerVentasRuta.get('/ruta/:rutaId',getPedidosByrutas)
routerVentasRuta.get('/rutalast/:empleadoId',getLastRutas)
routerVentasRuta.get('/rutakastcond/:conductorId',getLastRutasConductor)
routerVentasRuta.post('/fecharutapedido/:conductorID',getfechapedidosrutas)
// cambios pato
routerVentasRuta.get('/allrutas',getAllRutasEmpleadoDesktop)
routerVentasRuta.get('/rutalastAll',getLastRutasAll)
routerVentasRuta.get('/lastrutafasty',getlastrutaconductorfast)

export default routerVentasRuta;
