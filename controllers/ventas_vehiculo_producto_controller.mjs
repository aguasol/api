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

export const updateVehiculosProductosStocks = async(req,res) => {
    try{
        const {vehiculoID} = req.params
        const { stock, productoID } = req.body; 
        const idvehiculo =parseInt(vehiculoID,10)
        //const idproducto =parseInt(productoID,10)
        const updatevehiculoproductostock = await modelVehiculoProduct.updateVehiculosProductosStock(idvehiculo,stock,productoID)
        res.status(200).json(updatevehiculoproductostock)
    } catch (error){
        res.status(500).json({error:error.message})
    }
}



export const updateProductoZonaStocks = async (req, res) => {
    try {
        const { zonaTrabajoID } = req.params
        const { stock, productoID } = req.body 
        const zonaTrabajoId = parseInt(zonaTrabajoID, 10)
        
        const updatedStockPadre = await modelVehiculoProduct.updateProductoZonaStock(zonaTrabajoId, productoID, stock)
        
        
        res.status(200).json(updatedStockPadre);
    } catch (error) {
        
        res.status(500).json({
            error: error.message
        });
    }
}




export const getProductosVehiculosStock =  async (req,res) => {
    // console.log("id llego")
     try {
         const { vehiculoID } = req.params;
         const id = parseInt(vehiculoID, 10);
         const productos = await modelVehiculoProduct.getProductoVehiculoStock(id);
         res.json(productos)
     } catch (error) {
         res.status(500).json({erro:error.message})
     }
 }


 export const getProductoStocksPadre =  async (req,res) => {
    // console.log("id llego")
     try {
         const { zonaTrabajoId, productoId } = req.params;
         const idZona = parseInt(zonaTrabajoId, 10);
         const idProducto = parseInt(productoId,10);
         const productoStock = await modelVehiculoProduct.getProductoStockPadre(idZona,idProducto);
         res.json(productoStock)
     } catch (error) {
         res.status(500).json({erro:error.message})
     }
 }

 export const getIdZonaPadreStocks = async (req,res) => {
    try{
        const {empleadoID}=req.params;
        const idEmpleado = parseInt(empleadoID,10);
        const zonaStock = await modelVehiculoProduct.getIdZonaPadreStock(idEmpleado);
        res.json(zonaStock)
    }catch (error){
        res.status(500).json({erro:error.message})
    }
 }

