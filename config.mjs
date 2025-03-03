/*
import pgPromise from 'pg-promise';

const pgp = pgPromise();

const connectionStr = "postgresql://aguasol_xar2_user:WCJ9WKpeqQdIirMX1z85mRvDsB27IhX5@dpg-cqkps2ogph6c738j8r90-a.oregon-postgres.render.com/aguasol_xar2";
//const connectionStr = "postgresql://aguasol:TntaHgQf9msnfmHXdrQWEXHEt1hut1MC@dpg-cml86oacn0vc739oj51g-a.oregon-postgres.render.com/aguasol_ui5l";
//const connectionStr = "postgres://aguasol:TntaHgQf9msnfmHXdrQWEXHEt1hut1MC@dpg-cml86oacn0vc739oj51g-a/aguasol_ui5l";
//const connectionStr = "postgres://aguasol:TntaHgQf9msnfmHXdrQWEXHEt1hut1MC@dpg-cml86oacn0vc739oj51g-a.oregon-postgres.render.com/aguasol_ui5l";
export const db_pool = pgp({
    connectionString: connectionStr,
    ssl: {
      rejectUnauthorized: false, // Puedes ajustar esto según tus necesidades de seguridad
    },
  });

try{
    db_pool.connect()
    .then(obj=>{
        console.log("AGUA SOL DB CONNECTED !");
        obj.done();
    })
    .catch(err=>{
        console.log("NO CONNECTED AGUA SOL:",err);
    })
    //
}
catch(err){
    console.log(`ERROR CONFIGURATION: ${err}`);
}*/

import pgPromise from 'pg-promise';

const pgp = pgPromise();

// Definir conexiones
const conexiones = {
    db_pool: "postgresql://aguasol_xar2_user:WCJ9WKpeqQdIirMX1z85mRvDsB27IhX5@dpg-cqkps2ogph6c738j8r90-a.oregon-postgres.render.com/aguasol_xar2",
    cliente: "postgresql://aguasol_xar2_user:WCJ9WKpeqQdIirMX1z85mRvDsB27IhX5@dpg-cqkps2ogph6c738j8r90-a.oregon-postgres.render.com/micro_cliente",
    pedido: "postgresql://aguasol_xar2_user:WCJ9WKpeqQdIirMX1z85mRvDsB27IhX5@dpg-cqkps2ogph6c738j8r90-a.oregon-postgres.render.com/micro_pedido_detalle",
    ubicacion: "postgresql://aguasol_xar2_user:WCJ9WKpeqQdIirMX1z85mRvDsB27IhX5@dpg-cqkps2ogph6c738j8r90-a.oregon-postgres.render.com/micro_ubicacion",
    auth: "postgresql://aguasol_xar2_user:WCJ9WKpeqQdIirMX1z85mRvDsB27IhX5@dpg-cqkps2ogph6c738j8r90-a.oregon-postgres.render.com/micro_signin"
};

// Crear objetos de conexión
const db_pool = pgp({ connectionString: conexiones.db_pool, ssl: { rejectUnauthorized: false } });
const db_cli = pgp({ connectionString: conexiones.cliente, ssl: { rejectUnauthorized: false } });
const db_ped = pgp({ connectionString: conexiones.pedido, ssl: { rejectUnauthorized: false } });
const db_ubi = pgp({ connectionString: conexiones.ubicacion, ssl: { rejectUnauthorized: false } });
const db_auth = pgp({ connectionString: conexiones.auth, ssl: { rejectUnauthorized: false } });

// Lista de conexiones para probar
const basesDeDatos = { db_pool, db_cli, db_ped, db_ubi, db_auth };

// Probar conexiones
Object.entries(basesDeDatos).forEach(([nombre, db]) => {
    db.connect()
        .then(obj => {
            console.log(`✅ DB CONNECTED: ${nombre}`);
            obj.done();
        })
        .catch(err => {
            console.error(`❌ ERROR CONNECTING TO ${nombre}:`, err);
        });
});

// Exportar conexiones
export { db_pool, db_cli, db_ped, db_ubi, db_auth };