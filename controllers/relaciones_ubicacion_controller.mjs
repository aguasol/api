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
      //  console.log("--------------DEL ID----------------------",id)
        const ubicacionesCliente = await modelUbicacion.getUbicacionesCliente(id);
       // console.log("--------------DEL ID----------------------",id)

        res.status(200).json(ubicacionesCliente);
    } catch (error) {
        res.status(500).json({error:error.message});

    }

}
export const createUbicacion = async (req,res) => {
    try{
        const newUbicacion = req.body;
        console.log(newUbicacion)
        const ubicacionCreated = await modelUbicacion.createUbicacion(newUbicacion);
        console.log(ubicacionCreated);
        res.status(200).json(ubicacionCreated);
    }
    catch(e){
        console.error('Error en createUbicacion:', e);
        res.status(500).json({error:e.message})
    }
}


export const getUbicacionesClienteNRS = async (req,res) => {
    try {
        const { clienteNRID } = req.params;
        const id = parseInt(clienteNRID, 10);
       // console.log("--------------DEL ID----------------------",id)
        const ubicacionesCliente = await modelUbicacion.getUbicacionesClienteNR(id);
        //console.log("--------------DEL ID----------------------",id)

        res.status(200).json(ubicacionesCliente);
    } catch (error) {
        res.status(500).json({error:error.message});

    }

}

export const updateRelacionesUbicaciones = async (req,res) => {
    try {
        const {empleadoID,idRelacionUbicacion} = req.params;
        const idrubi = parseInt(idRelacionUbicacion,10)
        const idempleado = parseInt(empleadoID,10)
        const resultado = await modelUbicacion.updateRelacionesUbicacion(idempleado,idrubi); 

        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({error:error.message});

    }

}

export const deleteUbicaciones = async (req,res) => {
    try {
        const {idUbicacion} = req.params
        const idubirelacion = parseInt(idUbicacion,10)
        const resultado = await modelUbicacion.deleteRelacionesUbicacion(idubirelacion)
        if (resultado) {
            res.json({ mensaje: 'Ubicación eliminada exitosamente' });
        } else {
            // Si rowCount no es 1, significa que no se encontró un cliente con ese ID
            res.status(404).json({ error: 'No se encontró la ubicación con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({error:error.message});

    }

}
