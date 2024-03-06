import modelUbicacion from "../models/relaciones_ubicacion_model.mjs";

export const getAllUbicaciones = async (req,res) => {
    try {
        const allubicaciones = await modelUbicacion.getUbicacion();
        res.status(200).json(allubicaciones);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}

export const getUbicacionesXCliente = async (req,res) => {
    try {
        const { clienteID } = req.params;
        const id = parseInt(clienteID, 10);
        console.log("--------------DEL ID----------------------",id)
        const ubicacionesCliente = await modelUbicacion.getUbicacionesCliente(id);
        console.log("--------------DEL ID----------------------",id)

        res.status(200).json(ubicacionesCliente);
    } catch (error) {
        res.status(500).json({error:error.message});

    }

}
export const createUbicacion = async (req,res) => {
    try{
        const newUbicacion = req.body;
        const ubicacionCreated = await modelUbicacion.createUbicacion(newUbicacion);
        res.status(200).json(ubicacionCreated);
    }
    catch(e){
        res.status(500).json({error:e.message})
    }
}


export const getUbicacionesClienteNRS = async (req,res) => {
    try {
        const { clienteNRID } = req.params;
        const id = parseInt(clienteNRID, 10);
        console.log("--------------DEL ID----------------------",id)
        const ubicacionesCliente = await modelUbicacion.getUbicacionesClienteNR(id);
        console.log("--------------DEL ID----------------------",id)

        res.status(200).json(ubicacionesCliente);
    } catch (error) {
        res.status(500).json({error:error.message});

    }

}
