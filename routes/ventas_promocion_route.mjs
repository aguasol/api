import { createPromociones,getPromociones,deletePromociones,updatePromociones} from '../controllers/ventas_promocion_controller.mjs';
import express from 'express';

const routerVentasPromocion = express.Router();
routerVentasPromocion.post('/promocion',createPromociones)
routerVentasPromocion.get('/promocion',getPromociones)
routerVentasPromocion.delete('/promocion/:promocionID',deletePromociones)
routerVentasPromocion.put('/promocion/:promocionID',updatePromociones)


export default routerVentasPromocion;
