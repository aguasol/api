import modelVehiculoProduct from "../models/ventas_vehiculo_producto_model.mjs";

export const createVehiculoProductos = async (req,res) => {
    try {
        const newVehiculoProducto = req.body
        const vehiculoProductos= await modelVehiculoProduct.createVehiculoProduct(newVehiculoProducto)


        
        res.status(200).json(vehiculoProductos);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}
export const getVehiculosProductos = async (req,res)=> {
    try {
        const getvehiculosproductos = await modelVehiculoProduct.getVehiculoProduct()
        res.status(200).json(getvehiculosproductos)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
export const updateVehiculoProductos = async (req,res) => {
    try {
        // EXTRAYENDO EL ID DE LA RUTA
        const {vehiculoID} = req.params
        const idvehiculo =parseInt(vehiculoID,10)


        // EXTRAYENDO EL BODY 
        const stock = req.body
        const updatevehiculoproducto = await modelVehiculoProduct.updateVehiculoProduct(idvehiculo,stock)
        console.log("------controllooerrr-----")
        console.log(updatevehiculoproducto)
        res.status(200).json(updatevehiculoproducto)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}