import modelProductoZona from "../models/ventas_producto_zona_model.mjs";

export const createProductoZonas = async (req,res) => {
    try {
        const newpedido = req.body
        const producto_zona= await modelProductoZona.createProductoZona(newpedido);
        
        res.json(producto_zona);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}
export const getProductosZonas = async (req,res)=> {
    try {
        const getproductoszonas = await modelProductoZona.getProductoZona();
        res.status(200).json(getproductoszonas)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}