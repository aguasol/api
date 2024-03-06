-- esquema persona:
create schema personal;

-- esquema ventas:
create schema ventas;

-- esquema relaciones:
create schema relaciones;


-----------------------------------
-- RELACIONES
-----------------------------------

-- Table : roles
create table relaciones.roles(
	id serial primary key,
	nombre varchar(300)
);

create table relaciones.ubicacion(
	id serial primary key,
	latitud float,
	longitud float,
	direccion varchar(300),
	cliente_id int,
	cliente_nr_id int,
	distrito varchar(300),
	zona_trabajo_id int -- NUEVO    
);

------------------------------------
-- PERSONAL
------------------------------------

-- Table: personal.user
create table personal.usuario(
	id serial primary key,
	rol_id int not null,
	nickname varchar(100) not null,
	contrasena varchar(100) not null,
	email varchar(200)
);

-- Table: personal.superadmin
create table personal.gerente(
	id serial primary key,
	usuario_id int unique,
	nombres varchar(100) not null,
	apellidos varchar(200) not null,
	dni varchar(200) not null,
	fecha_nacimiento date not null
);

-- Table: personal.administrador
create table personal.administrador(
	id serial primary key,
	usuario_id int unique,
	nombres varchar(200) not null,
	apellidos varchar(200) not null,
	dni varchar(100) not null,
	fecha_nacimiento date not null,
	zona_trabajo_id int
);

-- Table: personal.conductor
create table personal.conductor(
	id serial primary key,
	usuario_id int unique,
	nombres varchar(100) not null,
	apellidos varchar(100) not null,
	licencia varchar (100) not null,
	dni varchar(100) not null,
	fecha_nacimiento date not null,
	administrador_id int
);	

-- Table: personal.empleado
create table personal.empleado(
	id serial primary key,
	usuario_id int unique,
	nombres varchar(100) not null,
	apellidos varchar(200) not null,
	dni varchar(200) not null,
	fecha_nacimiento date not null,
	codigo_empleado varchar(200),
	administrador_id int
);

------------------------------------
-- VENTAS USUARIOS
------------------------------------

-- Table: ventas.cliente
create table ventas.cliente(
	id serial primary key,
	usuario_id int unique,
	nombre varchar(100) not null,
	apellidos varchar(100) not null,
	direccion varchar(150),
	telefono varchar(50),
	email varchar(50),
	distrito varchar(100),
	RUC varchar(200),
	fecha_nacimiento date,
	fecha_creacion_cuenta date,
	sexo varchar(100),
	dni varchar(100),
	codigo varchar(200),
	saldo_beneficios float,
	direccion_empresa varchar(200),
	suscripcion varchar(200),
	nombre_empresa varchar(200),
	frecuencia varchar(200)
);

--SE AGREDO EMPLEADO ID
create table ventas.cliente_noregistrado(
	id serial primary key,
	empleado_id int,
	nombre varchar(200),
	apellidos varchar(300),
	direccion varchar(200),
	telefono varchar(50),
	email varchar(50),
	distrito varchar(100),
	RUC varchar(20)
);

------------------------------------
-- VENTAS 
------------------------------------

-- Table: ventas.ruta
create table ventas.ruta(
	id serial primary key,
	conductor_id int,
	vehiculo_id int, -- VEHICULO ID
	empleado_id int,
	distancia_km int,
	tiempo_ruta int,
	fecha_creacion timestamp not null

);

-- Table: ventas.pedido
create table ventas.pedido(
	id serial primary key,
	ruta_id int,
	cliente_id int,
	cliente_nr_id int,
	subtotal float not null,
	descuento  float,
	total float not null,
	fecha timestamp not null,
	tipo varchar(20),
	foto varchar(200),
	estado varchar(50), -- pendiente, en proceso, entregado
	observacion varchar(1000),
	tipo_pago varchar(500),
	ubicacion_id int
);

--Table: ventas.producto
create table ventas.producto(
	id serial primary key,
	nombre varchar(200) not null,
	precio float not null,
	descripcion varchar(200) not null,
	foto varchar(200)
);

-- NUEVA NUEVA
-- Table : PRODUCTOS_ZONATRABAJO ------------------------------------------------------------
create table ventas.producto_zona(
	id serial primary key,
	zona_trabajo_id int,
	producto_id int,
	stock_padre int

);
--NUEVA NUEVA----------------------------------------------------------------------------------
create table ventas.vehiculo_producto(
	id serial primary key,
	producto_id int,
	vehiculo_id int,
	stock_movil int
);
---------------------------------------------------------------------------------------------------

--Table: ventas.promos
create table ventas.promocion(
	id serial primary key,
	nombre varchar(200) not null,
	precio float not null,
	descripcion varchar(200) not null,
	fecha_inicio timestamp not null,
	fecha_limite timestamp not null,
	foto varchar(200)
);

-- Table: ventas.vehiculo
create table ventas.vehiculo(
	id serial primary key,
	nombre_modelo varchar(200),  -- NO LLAVE CONDUCTOR 
	placa varchar(100) not null,
	administrador_id int -- NUEVA
);

--Table: ventas.zona_trabajo
create table ventas.zona_trabajo(
	id serial primary key,
	nombre varchar(50), -- distrito
	ubicacion varchar(100), --GEOMETRY(POINT,4326), --municipalidad
	poligono varchar(1000),--GEOMETRY(POLYGON,4326),
	departamento varchar(50),
	provincia varchar(50)

);

---------------------------------
-- RELACIONES
---------------------------------

--Table: relaciones.compra
create table relaciones.detalle_pedido(
	id serial primary key,
	pedido_id int,
	producto_id int not null,
	cantidad int not null,
	promocion_id int
);

--Table: productos.pedido
create table relaciones.producto_promocion(
	id serial primary key,
	promocion_id int not null,
	producto_id int not null,
	cantidad int not null
);

---------------------------------
-- CONSTRAINTS
---------------------------------
-- ALTER TABLE orders ADD CONSTRAINT fk_orders_customers FOREIGN KEY (customer_id) REFERENCES customers (id);

-- PRODUCTO
ALTER TABLE ventas.vehiculo_producto ADD CONSTRAINT fk_vehiculo_producto_product FOREIGN KEY(producto_id) REFERENCES ventas.producto(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE ventas.vehiculo_producto ADD CONSTRAINT fk_vehiculo_producto_vehiculo FOREIGN KEY(vehiculo_id) REFERENCES ventas.vehiculo(id) ON DELETE CASCADE ON UPDATE CASCADE;

--- RUTA
ALTER TABLE ventas.ruta ADD CONSTRAINT fk_ruta_empleado FOREIGN KEY (empleado_id) REFERENCES personal.empleado (id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE ventas.ruta ADD CONSTRAINT fk_ruta_conductor FOREIGN KEY (conductor_id) REFERENCES personal.conductor (id) ON DELETE CASCADE ON UPDATE CASCADE;
-- ALTER TABLE ventas.ruta ADD CONSTRAINT fk_ruta_zona_trabajo FOREIGN KEY (zona_trabajo_id) REFERENCES ventas.zona_trabajo (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE ventas.ruta ADD CONSTRAINT fk_ruta_vehiculo FOREIGN KEY (vehiculo_id) REFERENCES ventas.vehiculo (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- PEDIDO
ALTER TABLE ventas.pedido ADD CONSTRAINT fk_pedido_ruta FOREIGN KEY (ruta_id) REFERENCES ventas.ruta (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE ventas.pedido ADD CONSTRAINT fk_pedido_cliente FOREIGN KEY (cliente_id) REFERENCES ventas.cliente (id) ON DELETE CASCADE ON UPDATE CASCADE;


-- pedido-cliente nr
ALTER TABLE ventas.pedido ADD CONSTRAINT fk_pedido_clientenr FOREIGN KEY (cliente_nr_id) REFERENCES ventas.cliente_noregistrado (id) ON DELETE SET NULL ON UPDATE CASCADE;

--CLIENTE NR
ALTER TABLE ventas.cliente_noregistrado ADD CONSTRAINT fk_clientnr_empleado FOREIGN KEY (empleado_id) REFERENCES personal.empleado (id) ON DELETE SET NULL ON UPDATE CASCADE;

-- DETALLE PEDIDO
ALTER TABLE relaciones.detalle_pedido ADD CONSTRAINT fk_detallepedido_promocion FOREIGN KEY (promocion_id) REFERENCES ventas.promocion (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE relaciones.detalle_pedido ADD CONSTRAINT fk_detallepedido_producto FOREIGN KEY (producto_id) REFERENCES ventas.producto (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- PRODUCTO PROMOCION
ALTER TABLE relaciones.producto_promocion ADD CONSTRAINT fk_productopromocion_promocion FOREIGN KEY (promocion_id) REFERENCES ventas.promocion (id) ON DELETE CASCADE ON UPDATE CASCADE;


-- ZONA TRABAJO

ALTER TABLE ventas.producto_zona ADD CONSTRAINT fk_productozona_zona FOREIGN KEY(zona_trabajo_id) REFERENCES ventas.zona_trabajo(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE ventas.producto_zona ADD CONSTRAINT fk_productozona_producto FOREIGN KEY(producto_id) REFERENCES ventas.producto(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE personal.administrador ADD CONSTRAINT fk_zona_admin FOREIGN KEY (zona_trabajo_id) REFERENCES ventas.zona_trabajo(id) ON DELETE CASCADE ON UPDATE CASCADE;
-- VEHICULO
 --- YA NO EXISTE LLAVE FORANEA CON CONDUCTOR
ALTER TABLE ventas.vehiculo ADD CONSTRAINT fk_vehiculo_admin FOREIGN KEY (administrador_id) REFERENCES personal.administrador(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- COMPRA
ALTER TABLE relaciones.detalle_pedido ADD CONSTRAINT fk_compra_producto FOREIGN KEY (producto_id) REFERENCES ventas.producto (id);
ALTER TABLE relaciones.detalle_pedido ADD CONSTRAINT fk_compra_pedido FOREIGN KEY (pedido_id) REFERENCES ventas.pedido (id) ON DELETE CASCADE ON UPDATE CASCADE;


-- ROLES
ALTER TABLE personal.usuario ADD CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES relaciones.roles(id);


-- USUARIOS
ALTER TABLE ventas.cliente ADD CONSTRAINT fk_cliente_usuario FOREIGN KEY (usuario_id) REFERENCES personal.usuario(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE personal.gerente ADD CONSTRAINT fk_gerente_usuario FOREIGN KEY (usuario_id) REFERENCES personal.usuario(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE personal.administrador ADD CONSTRAINT fk_administrador_usuario FOREIGN KEY (usuario_id) REFERENCES personal.usuario(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE personal.conductor ADD CONSTRAINT fk_conductor_usuario FOREIGN KEY (usuario_id) REFERENCES personal.usuario(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE personal.empleado ADD CONSTRAINT fk_empleado_usuario FOREIGN KEY (usuario_id) REFERENCES personal.usuario(id) ON DELETE CASCADE ON UPDATE CASCADE;

--USUARIOS CON GESTION
ALTER TABLE personal.conductor ADD CONSTRAINT fk_conductor_admin FOREIGN KEY(administrador_id) REFERENCES personal.administrador(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE personal.empleado ADD CONSTRAINT fk_empleado_admin FOREIGN KEY(administrador_id) REFERENCES personal.administrador(id) ON DELETE CASCADE ON UPDATE CASCADE;



-- UBICACION
ALTER TABLE relaciones.ubicacion ADD CONSTRAINT fk_cliente_ubicacion FOREIGN KEY (cliente_id) REFERENCES ventas.cliente(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE relaciones.ubicacion ADD CONSTRAINT fk_cliente_nr_ubicacion FOREIGN KEY (cliente_nr_id) REFERENCES ventas.cliente_noregistrado(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE ventas.pedido ADD CONSTRAINT fk_pedido_ubicacion_id FOREIGN KEY (ubicacion_id) REFERENCES relaciones.ubicacion(id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE relaciones.ubicacion ADD CONSTRAINT fk_ubicacion_zona FOREIGN KEY (zona_trabajo_id) REFERENCES ventas.zona_trabajo(id) ON DELETE CASCADE ON UPDATE CASCADE;

-- reseteo secuencias
-- Roles
SELECT setval('relaciones.roles_id_seq', 1, false);

-- Usuario
SELECT setval('personal.usuario_id_seq', 1, false);

-- Gerente
SELECT setval('personal.gerente_id_seq', 1, false);

-- Administrador
SELECT setval('personal.administrador_id_seq', 1, false);

-- Conductor
SELECT setval('personal.conductor_id_seq', 1, false);

-- Empleado
SELECT setval('personal.empleado_id_seq', 1, false);

-- Cliente
SELECT setval('ventas.cliente_id_seq', 1, false);

-- Cliente No Registrado
SELECT setval('ventas.cliente_noregistrado_id_seq', 1, false);

-- Ruta
SELECT setval('ventas.ruta_id_seq', 1, false);

-- Pedido
SELECT setval('ventas.pedido_id_seq', 1, false);

-- Producto
SELECT setval('ventas.producto_id_seq', 1, false);

-- Vehiculo
SELECT setval('ventas.vehiculo_id_seq', 1, false);

-- Zona Trabajo
SELECT setval('ventas.zona_trabajo_id_seq', 1, false);

-- Detalle Pedido
SELECT setval('relaciones.detalle_pedido_id_seq', 1, false);

-- Ubicación
SELECT setval('relaciones.ubicacion_id_seq', 1, false);
