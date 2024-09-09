import express from "express";
import cors from 'cors';
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import compression from "compression";
import { Client } from '@googlemaps/google-maps-services-js';
import polyline from 'google-polyline';


import multer from 'multer';
import routerVentasPromocion from "./routes/ventas_promocion_route.mjs";
import routerProductoPromocion from "./routes/relacion_producto_promocion_route.mjs";
import routerVentasPedido from "./routes/ventas_pedido_route.mjs";
import routerUserConductor from "./routes/usuario_conductor_route.mjs";
import routerUserEmpleado from "./routes/usuario_empleado_route.mjs";
import routerUserCliente from "./routes/usuario_cliente_route.mjs";
import routerUserAdmin from "./routes/usuario_administrador_route.mjs";
import routerLogin from "./routes/login_route.mjs";
import routerVentasProduct from "./routes/ventas_producto_route.mjs";
import routerDetallePedido from "./routes/relaciones_detallepedido_route.mjs";
import routerVentasVenta from "./routes/ventas_venta_route.mjs";
import routerVentasRuta from "./routes/ventas_ruta_route.mjs";
import routerClienteNR from "./routes/ventas_clientenr_route.mjs";
import routerUbicacion from "./routes/relaciones_ubicacion_route.mjs";
import routerVehiculoProducto from "./routes/ventas_vehiculo_producto_route.mjs";
import routerVehiculo from "./routes/ventas_vehiculo_route.mjs";
import routerProductoZona from "./routes/ventas_producto_zona_route.mjs";
import routerZonas from "./routes/ventas_zona_trabajo_route.mjs";
import routerAlmacenes from "./routes/ventas_almacen_route.mjs";

/** INICIA LA APP Y EL PUERTO */
const app_sol = express();
const server = http.createServer(app_sol);
const io = new Server(server, {
    reconnection: true,
    reconnectionAttempts: 10,  // Número máximo de intentos
    reconnectionDelay: 1000,  // Retardo entre intentos en milisegundos
    reconnectionDelayMax:2000
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');
    //console.log("holaa");

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    // RECIBIENDO 
    socket.on('recibiendoMensaje', (data) => {
       // console.log(data);
        // io.emit('enviandoCoordenadas',data);
    });

    socket.on('Termine de Updatear', (data) => {
        //console.log(data);
        io.emit('Llama tus Pedidos :)', data);
    });

    socket.on('avisarAceptado',(data) => {
        console.log("....escuchando ")
        console.log(data);
        io.emit('notificarConductores',data);
    });
    //socket.emit('testy');
    io.emit('testy')

    /*  io.engine.on('upgrade', (request, socket, head) => {
          console.log('Upgrade request');
      });*/


});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 4000;
//app_sol.use(multer())
app_sol.use(cors());
app_sol.use(express.json());
app_sol.use(morgan('combined'))
app_sol.use(compression())


// SERVIR IMAGENES

app_sol.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Servir html
app_sol.use('/politica', express.static(path.join(__dirname, 'public', 'politica.html')));
app_sol.use('/condiciones', express.static(path.join(__dirname, 'public', 'condiciones.html')));

/** CONFIGURAMOS LAS RUTAS */
app_sol.use('/api', routerUserAdmin);
app_sol.use('/api', routerUserCliente);
app_sol.use('/api', routerUserEmpleado);
app_sol.use('/api', routerUserConductor);
app_sol.use('/api', routerVentasProduct);
app_sol.use('/api', routerLogin);
app_sol.use('/api', routerVentasPedido);
app_sol.use('/api', routerDetallePedido);
app_sol.use('/api', routerVentasVenta);
app_sol.use('/api', routerVentasPromocion);
app_sol.use('/api', routerProductoPromocion);
app_sol.use('/api', routerVentasRuta);
app_sol.use('/api', routerClienteNR);
app_sol.use('/api', routerUbicacion);
app_sol.use('/api', routerVehiculoProducto);
app_sol.use('/api', routerVehiculo);
app_sol.use('/api', routerProductoZona);
app_sol.use('/api', routerZonas);
app_sol.use('/api',routerAlmacenes)

app_sol.use('/api', (req, res) => {
    //console.log("---no esta esa ruta")
    res.status(404).json({ error: 'Ruta no encontrada' });

});
// Manejo de errores
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: 'Error interno del servidor' });
}

// Crear cliente de Google Maps
const client = new Client({});

app_sol.post('/decode-route', async (req, res) => {
    const { encodedPath } = req.body; // Obtenemos la cadena codificada del cuerpo de la solicitud

    if (!encodedPath) {
        return res.status(400).json({ error: 'encodedPath is required' });
    }

    try {
        // Utilizar la biblioteca `google-polyline` para decodificar la ruta
        const decodedPath = decodePolyline(encodedPath);

        // Enviamos la respuesta con la ruta decodificada
        res.json({ decodedPath });
    } catch (error) {
        console.error('Error decoding route:', error);
        res.status(500).json({ error: 'Failed to decode route' });
    }
});

// Función para decodificar la cadena codificada
function decodePolyline(encoded) {
    return polyline.decode(encoded);
}

// Delega a la función de manejo de errores personalizada
app_sol.use(errorHandler);
server.listen(port, () => {
    console.log(`Servidor en: http://127.0.0.1:${port}`);
})

export { app_sol, io, server };
