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
        const {empleadoID} = req.params
        const id = parseInt(empleadoID,10)
        const getvehiculos = await modelVehiculo.getVehiculo(id);
        res.status(200).json(getvehiculos)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}