-- Insertar registros en la tabla roles
INSERT INTO relaciones.roles (nombre) VALUES
  ('administrador'),
  ('empleado'),
  ('gerente'),
  ('cliente'),
  ('conductor');
    -- Insertar registros en la tabla zona_trabajo
INSERT INTO ventas.zona_trabajo (nombre,poligono,departamento,provincia) VALUES
('erick','-16.44952,-71.86839,-16.45586,-71.5646,-16.467,-71.55434,-16.4698,-71.55449,-16.47048,-71.55041,-16.46731,-71.54728,-16.46203,-71.5362,-16.46274,-71.53031,-16.46451,-71.52467,-16.45943,-71.51535,-16.45333,-71.508,-16.43132,-71.49482,-16.42692,-71.49023,-16.42023,-71.48227,-16.40867,-71.46963,-16.40581,-71.46664,-16.4024,-71.46719,-16.40413,-71.4852,-16.39415,-71.50702,-16.38588,-71.51008,-16.37079,-71.4979,-16.36537,-71.50867,-16.36989,-71.51754,-16.36237,-71.51146,-16.35993,-71.51629,-16.36405,-71.52748,-16.36944,-71.53162,-16.35629,-71.54074,-16.32755,-71.53502,-16.32528,-71.53317,-16.32142,-71.55945,-16.32235,-71.58059,-16.332,-71.59275,-16.34329,-71.6041,-16.35871,-71.59581,-16.35122,-71.58399,-16.37783,-71.57976,-16.38961,-71.58687,-16.40587,-71.58675,-16.42037,-71.58658,-16.43831,-71.57925','arequipa','arequipa'),
  ('la joya','-16.5289,-71.077099,-16.52352,-71.78382,-16.51817,-71.79027,-16.50507,-71.80456,-16.48638,-71.79923,-16.47319,-71.79345,-16.46372,-71.80223,-16.45543,-71.80122,-16.44309,-71.80693,-16.43444,-71.80383,-16.42153,-71.80495,-16.41705,-71.8015,-16.41518,-71.80976,-16.41474,-71.83203,-16.41698,-71.83987,-16.42033,-71.84413,-16.41952,-71.85309,-16.42163,-71.85814,-16.42675,-71.86117,-16.43333,-71.86361,-16.43835,-71.85981,-16.46926,-71.86955,-16.49028,-71.85402,-16.47903,-71.89861,-16.46542,-71.92401,-16.4566,-71.91041,-16.45116,-71.91011,-16.45474,-71.93036,-16.46821,-71.94605,-16.47753,-71.94561,-16.47129,-71.92401,-16.48311,-71.9084,-16.48849,-71.88732,-16.49486,-71.87873,-16.49451,-71.85983,-16.515,-71.87358,-16.51392,-71.90384,-16.51292,-71.91303,-16.5122,-71.92842,-16.52767,-71.94934,-16.54315,-71.95861,-16.56485,-71.97049,-16.59407,-71.97019,-16.6149,-71.99395,-16.62579,-71.98349,-16.6119,-71.95397,-16.59536,-71.92879,-16.58111,-71.9063,-16.58025,-71.8948,-16.57767,-71.88209,-16.56962,-71.88944,-16.52605,-71.90645,-16.51977,-71.89496,-16.51835,-71.8813,-16.51811,-71.85961,-16.52803,-71.79819,-16.54223,-71.82767,-16.55727,-71.84359,-16.85928,-71.84828,-16.59084,-71.84547,-16.58777,-71.82106,-16.58025,-71.81268,-16.55171,-71.81111,-16.53484,-71.79262,-16.53127,-71.77179','arequipa','arequipa');
  
  -- Insertar registros en la tabla producto

INSERT INTO ventas.producto (nombre, precio, descripcion,foto) VALUES
('bidon 20l',35.00,'und.','BIDON20.png'),
('recarga',13.00,'und.','BIDON20.png'),
('caja de agua',20.00,'und.','CAJA.png'),
('botella 7l',6.00,'und.','BIDON7.png'),
('botella 3l',9.00,'pqt. 4 und.','BIDON03.png'),
('botella 1l',22.00,'pqt. 12 und.','BOTELLA1L.png'),
('botella 700ml',12.00,'pqt. 15 und.','BIDON0.png');

INSERT INTO ventas.promocion (nombre, precio, descripcion, fecha_inicio,fecha_limite,foto) VALUES
  ('regalona',13.00,'Lleva una recarga y recibe un Vasito Sol de REGALO',current_timestamp,current_timestamp+interval '21 days','recargaregalona.jpg'),
  ('de locura',60.00,'Compra 10 bidones de 7L y lleva 1 GRATIS',current_timestamp,current_timestamp+interval '21 days','siete.png'),
  ('de temporada',16.00,'Lleva 2 paquetes de 3L a solo S/.16.00',current_timestamp,current_timestamp+interval '21 days','paquetes2.png'),
  ('personales',20.00,'Lleva 2 paquetes de 700ml a solo S/.20.00',current_timestamp,current_timestamp+interval '21 days','setecientos.png'),
  ('cajas dobles',38.00,'Lleva 2 cajas de 20l a solo S/.38.00',current_timestamp,current_timestamp+interval '21 days','cajasdobles.png'),
  ('de litro',40.00,'Lleva 2 paquetes de 1l a solo S/.40.00',current_timestamp,current_timestamp+interval '21 days','litropromo.png');

INSERT INTO relaciones.producto_promocion (promocion_id, producto_id, cantidad) VALUES
  (1,2,1),
  (2,4,11),
  (3,5,2),
  (4,7,2),
  (5,3,2),
  (6,6,2);

-- Insert productozona
INSERT INTO ventas.producto_zona(zona_trabajo_id,producto_id,stock_padre) VALUES
(1,1,0),
(1,2,0),
(1,3,0),
(1,4,0),
(1,5,0),
(2,1,0),
(2,2,0),
(2,3,0),
(2,4,0),
(2,5,0);
