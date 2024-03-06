import modelPromocion from "../models/ventas_promocion_model.mjs";

export const createPromociones = async (req,res) => {
    try {
        const nuevaPromocion = req.body
        const promocionCreada= await modelPromocion.createPromocion(nuevaPromocion);
        
        res.json(promocionCreada);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}

export const getPromociones =  async (req,res) => {
    console.log("id llego")
    try {
        const getPromociones = await modelPromocion.getPromocion();
        res.json(getPromociones)
    } catch (error) {
        res.status(500).json({erro:error.message})
    }
}


export const deletePromociones = async (req,res) => {
    console.log("id llego")
    try {
        const { promocionID } = req.params;
        const id = parseInt(promocionID, 10);
        const deleteResult = await modelPromocion.deletePromocion(id);

        if (deleteResult) {
            res.json({ mensaje: 'La promocion ha sido eliminada exitosamente' });
        } else {
            // Si rowCount no es 1, significa que no se encontró un cliente con ese ID
            res.status(404).json({ error: 'No se encontró la ruta con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updatePromociones = async (req,res)=>{
    try {
        const {promocionID} = req.params;
        const id = parseInt(promocionID,10);
        const data = req.body;
        const updatePromociones = await modelPromocion.updatePromocion(id,data);
        res.json(updatePromociones);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
