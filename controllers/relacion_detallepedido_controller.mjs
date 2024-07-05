import modelDetallePedido from "../models/relacion_detallepedido_model.mjs";

export const createDetalle = async (req,res) => {
    try { 
        const newdetalle = req.body
        const detalleCreado= await modelDetallePedido.createDetallePedido(newdetalle);
        
        res.status(200).json(detalleCreado);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}
export const getDetalles =  async (req,res) => {
    try {
        const allDetalles = await modelDetallePedido.getDetallePedido();
        res.status(200).json(allDetalles)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
export const getDetallePedidoXPedidos =  async (req,res) => {
    try {
        const{pedidoID}=req.params;
        const id=parseInt(pedidoID,10)
        const allDetalles = await modelDetallePedido.getDetallePedidoXPedido(id);
        res.status(200).json(allDetalles)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
export const getDetallePedidosXRuta =  async (req,res) => {
    try {
        const{rutaID}=req.params;
        const id=parseInt(rutaID,10)
        const allDetalles = await modelDetallePedido.getDetallePedidoXRuta(id);
        res.status(200).json(allDetalles)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
export const getDetallePedidosClientes =  async (req,res) => {
    try {
        const{pedidoID}=req.params;
        const id=parseInt(pedidoID,10)
        const allproductos = await modelDetallePedido.getDetallePedidoCliente(id);
        res.status(200).json(allproductos)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

