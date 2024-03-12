-- Insertar registros en la tabla roles
INSERT INTO relaciones.roles (nombre) VALUES
  ('administrador'),
  ('empleado'),
  ('gerente'),
  ('cliente'),
  ('conductor');
    -- Insertar registros en la tabla zona_trabajo
INSERT INTO ventas.zona_trabajo (nombre,poligono,departamento,provincia) VALUES
('erick','-16,451525-71,563376,-16,4220885-71,5915761,-16,394172-71,585325,-16,385613-71,581683,-16,368901-71,578649,-16,348927-71,582169,-16,332329-71,591515,-16,308506-71,557315,-16,318757-71,531332,-16,339615-71,511454,-16,379966-71,499662,-16,38396-71,505928,-16,394499-71,518459,-16,393841-71,535061,-16,399646-71,540811,-16,402239-71,536992,-16,40298-71,532743,-16,407015-71,525276,-16,410406-71,50917,-16,423592-71,509746','arequipa','arequipa'),

  ('la joya','-16.410194,-71.847502,-16.428912,-71.862066,-16.496397,-71.865025,-16.534348,-71.956033,-16.623462,-71.958461,-16.638349,-71.906509,-16.604851,-71.833679,-16.542493,-71.794351,-16.535112,-71.761402,-16.510844,-71.786307,-16.501993,-71.805498,-16.483861,-71.810983,-16.455484,-71.814159,-16.439286,-71.793373,-16.417548,-71.797992,-16.407025,-71.830326','arequipa','arequipa');

  
 -- Insertar registros en la tabla usuario
INSERT INTO personal.usuario (rol_id,nickname, contrasena, email) VALUES
  (1,'coquin', 'contrasena1', 'usuario1@example.com'),
  (2,'pepito', 'contrasena2', 'usuario2@example.com'),
  (3,'ramon', 'contrasena2', 'usuario2@example.com'),
  (4,'pepin', 'contrasena2', 'usuario2@example.com'),
  (5,'robert', 'contrasena3', 'usuario3@example.com');
  
  
  -- Insertar registros en la tabla superadmin
INSERT INTO personal.gerente (usuario_id, nombres, apellidos, dni, fecha_nacimiento) VALUES
  (4, 'monchito', 'Apellido1', '12345678', '1990-01-01');
  
 
 -- Insertar registros en la tabla administrador
INSERT INTO personal.administrador (usuario_id, nombres, apellidos, dni, fecha_nacimiento,zona_trabajo_id) VALUES
  (1, 'Coco chanel', 'Apellido1', '11111111', '1980-05-10',1);
  

-- Insertar registros en la tabla empleado
INSERT INTO personal.empleado (usuario_id, nombres, apellidos, dni, fecha_nacimiento, codigo_empleado,administrador_id) VALUES
  (2, 'pepe pepin', 'Apellido3', '4567890123', '1988-02-08', 'EMPL003',1);

  
-- Insertar registros en la tabla vehiculo
INSERT INTO ventas.vehiculo (nombre_modelo,placa,administrador_id ) VALUES
  ('Yueyin', 'XE-2L2',1),('tking','asdfq2222',1),('lexus','kkka23',1),('ford','xa233',1);


-- Insertar registros en la tabla conductor
INSERT INTO personal.conductor (usuario_id, nombres, apellidos, licencia, dni, fecha_nacimiento,administrador_id) VALUES
  (11, 'lucrecia', 'Apellido3', 'DEF456', '7890123456', '1980-12-04',1),
  (12, 'panchita camionera', 'Apellido3', 'DEM456', '23453234', '1990-12-04',1),
  (13, 'robertoto', 'sanchez', 'DEM456', '23453234', '1990-12-04',1);
	
	
  -- Insertar registros en la tabla cliente
INSERT INTO ventas.cliente (usuario_id, nombre, apellidos, fecha_nacimiento,fecha_creacion_cuenta, sexo, direccion,telefono, dni, codigo, saldo_beneficios, direccion_empresa, suscripcion, RUC, nombre_empresa) VALUES
  (5, 'juana mariana', 'perez', '1992-05-20','2024-03-01', 'Femenino', 'Dirección1', '67890', '1234567890', 'COD123', 130, 'Empresa1', 'Suscripcion1',  '12345678901', 'Empresa A'),
  (6, 'eliana', 'rojas', '1992-05-20','2024-03-01', 'Femenino', 'Dirección1', '67890', '1234567890', 'COD123', 120, 'Empresa1', 'Suscripcion1',  '12345678901', 'Empresa A'),
  (7, 'luis', 'sanchez', '1992-05-20','2024-03-01', 'Femenino', 'Dirección1','67890',  '1234567890', 'COD123', 50, 'Empresa1', 'Suscripcion1',  '12345678901', 'Empresa A'),
  (8, 'sara', 'lima', '1992-05-20','2024-03-01', 'Femenino', 'Dirección1','67890',  '1234567890', 'COD123', 90, 'Empresa1', 'Suscripcion1',  '12345678901', 'Empresa A'),
  (9, 'pedro', 'suarez', '1992-05-20','2024-03-01', 'Masculino', 'Dirección1', '67890', '1234567890', 'COD123', 38, 'Empresa1', 'Suscripcion1',  '12345678901', 'Empresa A'),
  (10, 'javier', 'masias', '1992-05-20','2024-03-01', 'Femenino', 'Dirección1', '67890', '1234567890', 'COD123', 200, 'Empresa1', 'Suscripcion1', '12345678901', 'Empresa A');

 

 
   -- Insertar registros en la tabla cliente
INSERT INTO ventas.cliente_noregistrado (empleado_id,nombre, apellidos, direccion,telefono, email,distrito,RUC) VALUES
  (1,'señora pochita', 'pochita', 'fatima-uchumayo', '99991515', 'pochita@gmail.com', 'sachaca','105165165165');




-- Insertar registros en la tabla ruta
INSERT INTO ventas.ruta (conductor_id, vehiculo_id,empleado_id, distancia_km, tiempo_ruta,fecha_creacion) VALUES
  (1, 1, 1,50, 120,'2024-03-01'),
  (2, 1, 1,80, 480,'2024-03-01'),
  (3, 1, 1,83, 480,'2024-03-01'),
  (3, 1, 1,94, 560,'2024-03-01');
  

  
-- Insertar registros en la tabla pedido
INSERT INTO ventas.pedido (ruta_id, cliente_id, subtotal,descuento,total, fecha, tipo, estado,tipo_pago) VALUES
  ( 1, 1, 100,0.0,100, current_timestamp,'normal','pendiente','yape'),
  ( 1, 2, 50.5,0.0,50.5, current_timestamp,'normal','pendiente','plin'),
  ( 4, 1, 200,0.0,200, current_timestamp,'normal','pendiente','efectivo');
  
INSERT INTO ventas.pedido (ruta_id, cliente_nr_id, subtotal,descuento,total, fecha, tipo, estado) VALUES
  ( 1, 1, 100,0.0,100, current_timestamp,'normal','pendiente');
  
  -- Insertar registros en la tabla producto
INSERT INTO ventas.producto (nombre, precio, descripcion,foto) VALUES
('recarga',13.00,'und.','RECARGA.png');
('bidon 20l',35.00,'und.','BIDON20.png'),
('botella 7l',6.00,'und.','BIDON7.png'),
('botella 3l',9.00,'pqt. 4 und. (S/.2.25 c/u)','BIDON03.png'),
  ('botella 700ml',12.00,'pqt. x 15 und. (S/.0.80 c/u)','BIDON0.png'),
  ('bidon vacio',0.00,'und.','RECARGA.png');

INSERT INTO ventas.promocion (nombre, precio, descripcion, fecha_inicio,fecha_limite,foto) VALUES
  ('Promocion regalona',13.00,'Lleva una recarga y recibe un Vasito Sol de REGALO',current_timestamp,current_timestamp,'BIDON20.png'),
  ('Promoción de locura',60.00,'Compra 10 bidones de 7L y lleva 1 GRATIS',current_timestamp,current_timestamp,'BIDON7.png'),
  ('Promoción de verano',16.00,'Lleva 2 botelas de 3L a solo S/.16.00. AHORRAS S/. 2.00',current_timestamp,current_timestamp,'BIDON03.png'),
  ('Promoción personales',20.00,'Lleva 2 paquetes de 700ml a solo S/.20.00. AHORRAS S/.4.00',current_timestamp,current_timestamp,'BIDON0.png');

INSERT INTO relaciones.producto_promocion (promocion_id, producto_id, cantidad) VALUES
  (1,4,2),
  (2,3,6),
  (3,2,3),
  (3,4,1);


  
-- Insertar registros en la tabla compra
INSERT INTO relaciones.detalle_pedido(pedido_id, producto_id, cantidad) VALUES
  (1, 1, 10),
  (2, 3, 1),
  (2, 1, 15),
  (3, 3, 5),
  (3, 4, 3),
  (3, 1, 8);

-- Insertar registros en ubicacion
INSERT INTO relaciones.ubicacion (latitud,longitud,direccion,cliente_id,distrito,zona_trabajo_id) VALUES
(-16.411647,-71.5785222,'Av Default',1,'Default',1);

-- Insertar registros en ubicacion
INSERT INTO relaciones.ubicacion (latitud,longitud,direccion,cliente_nr_id,distrito,zona_trabajo_id) VALUES
(-16.4291483,-71.5854854,'Av Default',1,'Default',1);


-- Insert productozona
INSERT INTO ventas.producto_zona(zona_trabajo_id,producto_id,stock_padre) VALUES
(1,1,300),
(1,2,400),
(1,3,340);
