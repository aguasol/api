import modelZonaTrabajo from "../models/ventas_zona_trabajo_model.mjs";



export const createZonas = async (req,res) => {
    try{
        const newZona = req.body;
        const zonaCreated = await modelZonaTrabajo.createZona(newZona);
        res.status(200).json(zonaCreated);
    }
    catch(e){
        res.status(500).json({error:e.message})
    }
}
export const getZonas = async (req,res) => {
    try {
        const allZonas = await modelZonaTrabajo.getZona();
        res.status(200).json(allZonas);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}

