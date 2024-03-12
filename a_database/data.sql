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
  (1,1,1),
  (2,3,11),
  (3,4,2),
  (4,5,2);

-- Insert productozona
INSERT INTO ventas.producto_zona(zona_trabajo_id,producto_id,stock_padre) VALUES
(1,1,0),
(1,2,0),
(1,3,0);
(1,4,0),
(1,5,0),
(1,6,0),
(2,1,0),
(2,2,0),
(2,3,0);
(2,4,0),
(2,5,0),
(2,6,0);

