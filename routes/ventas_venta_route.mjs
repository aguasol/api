import { uploadPhotoVenta,uploadedPhotoVenta } from '../controllers/ventas_venta_controller.mjs';
import express from 'express';

const routerVentasVenta = express.Router();

routerVentasVenta.post('/ventas',uploadedPhotoVenta,uploadPhotoVenta)





export default routerVentasVenta;