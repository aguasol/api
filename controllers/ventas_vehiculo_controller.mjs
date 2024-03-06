import modelVehiculo from "../models/ventas_vehiculo_model.mjs";

export const createVehiculos = async (req,res) => {
    try {
        const newVehiculo = req.body
        const vehiculo= await modelVehiculo.createVehiculo(newVehiculo)
        
        res.json(vehiculo);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}
export const getVehiculos = async (req,res)=> {
    try {
        const getvehiculos = await modelVehiculo.getVehiculo();
        res.status(200).json(getvehiculos)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}