import modelRuta from "../models/ventas_ruta_model.mjs";

export const createRutas = async (req,res) => {
    try {
        const newRuta = req.body
        const rutaCreada= await modelRuta.createRuta(newRuta);
        
        res.json(rutaCreada);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}
export const getLastRutas =  async (req,res) => {
    try {
        const { empleadoId} = req.params;
        const empleado_id = parseInt(empleadoId,10);
        const getLast =  await modelRuta.getLastRuta(empleado_id)
        res.json(getLast);
    } catch (error) {
        res.status(500).json({"message":"NO DATA"})
    }
}

export const getPedidosByrutas = async (req,res) => {
    try {
        const {rutaId} = req.params;
        const idRuta  = parseInt
    } catch (error) {
        
    }
}