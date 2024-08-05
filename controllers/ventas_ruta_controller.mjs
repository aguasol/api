import modelRuta from "../models/ventas_ruta_model.mjs";

export const getAllRutasEmpleado = async (req,res) => {
    try {
        const {empleadoId} = req.params
        const idEmpleado = parseInt(empleadoId,10)
        const result = await modelRuta.getAllRutaEmpleado(idEmpleado)
   
        if(result.message){
            console.log("debe aqui")
            res.status(404).json(result)
        }
        else{
            res.status(200).json(result)
        }
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
export const createRutas = async (req,res) => {
    try {
        const newRuta = req.body
        const rutaCreada= await modelRuta.createRuta(newRuta);
        
        res.status(200).json(rutaCreada);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}
export const getLastRutas =  async (req,res) => {
    try {
        const { empleadoId} = req.params;
        const empleado_id = parseInt(empleadoId,10);
        const getLast =  await modelRuta.getLastRuta(empleado_id)
        res.status(200).json(getLast);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

export const getPedidosByrutas = async (req,res) => {
    try {
        const { rutaId} = req.params;
        const id = parseInt(rutaId,10);
        const getPedidos =  await modelRuta.getPedidosByruta(id)
        res.status(200).json(getPedidos);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}
export const getLastRutasConductor =  async (req,res) => {
    try {
        const { conductorId} = req.params;
        const conductor_id = parseInt(conductorId,10);
        const getLast =  await modelRuta.getLastRutaConductor(conductor_id)
        res.status(200).json(getLast);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}