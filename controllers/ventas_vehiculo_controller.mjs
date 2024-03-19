import modelVehiculo from "../models/ventas_vehiculo_model.mjs";

export const createVehiculos = async (req,res) => {
    try {
        const newVehiculo = req.body
        const vehiculo= await modelVehiculo.createVehiculo(newVehiculo)
        
        res.status(200).json(vehiculo);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}
export const getVehiculos = async (req,res)=> {
    try {
        console.log("dntro de controller vehiculo");

        const {empleadoID} = req.params
        console.log(empleadoID);
        const id = parseInt(empleadoID,10)
        const getvehiculos = await modelVehiculo.getVehiculo(id);
        res.status(200).json(getvehiculos)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
export const getVhehiculoAadmins = async (req,res)=>{
    try {
        const {adminID} = req.params
        const id = parseInt(adminID,10);
        const getVehiculo_admin = await modelVehiculo.getVehiculoAdmin(id)
        res.status(200).json(getVehiculo_admin)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
export const deleteVehiculosAdmins = async (req,res) => {
    try {
        const {vehiculoID} = req.params
        const id = parseInt(vehiculoID,10)
        const deleteResult = await modelVehiculo.deleteVehiculoAdmin(id)

        if(deleteResult){
            res.status(200).json({mensaje:'Vehiculo Eliminado'})
        }
        else{
            res.status(404).json({error:'No se encontró el vehículo con ese ID'})
        }
    } catch (error) {
    res.status(500).json({error:error.message})        
    }
}