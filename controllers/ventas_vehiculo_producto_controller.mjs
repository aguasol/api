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
export const getProductosVehiculo =  async (req,res) => {
   // console.log("id llego")
    try {
        const { vehiculoID } = req.params;
        const id = parseInt(vehiculoID, 10);
        const productos = await modelVehiculoProduct.getProductoVehiculo(id);
        res.json(productos)
    } catch (error) {
        res.status(500).json({erro:error.message})
    }
}
export const updateXEmpleado = async (req,res) => {
    try{
        const {vehiculoID,productoID,empleadoID} = req.params
        const idVehiculo =parseInt(vehiculoID,10)
        const idProducto = parseInt(productoID,10)
        const idEmpleado = parseInt(empleadoID,10)
        const stock = req.body
        const updateXempleado = await modelVehiculoProduct.updateVehiculoProductoXEmpleado(idEmpleado,idProducto,idVehiculo,stock)
        res.status(200).json(updateXempleado)
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
}

/*
export const updateVehiculoProductosStock = async (req,res) => {
    try {
        // EXTRAYENDO EL ID DE LA RUTA
        const {vehiculoID} = req.params
        const idvehiculo =parseInt(vehiculoID,10)


        // EXTRAYENDO EL BODY 
        const stock = req.body
        const updatevehiculoproducto = await modelVehiculoProduct.updateVehiculoStockEmpleado(idvehiculo,stock)
        console.log("------controllooerrr-----")
        console.log(updatevehiculoproducto)
        res.status(200).json(updatevehiculoproducto)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}*/
export const updateVehiculoProductsCond = async (req,res) => {
    try {
        // EXTRAYENDO EL ID DE LA RUTA
        const {vehiculoID} = req.params
        const idvehiculo =parseInt(vehiculoID,10)


        // EXTRAYENDO EL BODY 
        const stock = req.body
        const updatevehiculoproducto = await modelVehiculoProduct.updateVehiculoProductCond(idvehiculo,stock)
       // console.log("------controllooerrr-----")
       // console.log(updatevehiculoproducto)
        res.status(200).json(updatevehiculoproducto)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
export const getVPvehiculos = async (req,res) => {
    try {
        const {vehiculoID} = req.params
        const idvehiculo = parseInt(vehiculoID,10)
        const getvp = await modelVehiculoProduct.getVehiculoProductVehiculo(idvehiculo);
        res.status(200).json(getvp)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
