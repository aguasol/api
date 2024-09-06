import modelAlmacen from "../models/ventas_almacen.mjs";
import modelClientenr from "../models/ventas_almacen.mjs";

export const getAlmacenes = async (req,res) => {
    try {
       
        const resultado= await modelAlmacen.getAlmacen();
        res.status(200).json(resultado);
    } catch (error) {
      //  console.log("hola soy error del servidor")
        res.status(500).json({error:error.message});

    }
}