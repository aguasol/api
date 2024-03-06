import modelPedido from "../models/ventas_pedido_model.mjs";

export const createPedidos = async (req,res) => {
    try {
        const newpedido = req.body
        const pedidocreado= await modelPedido.createPedido(newpedido);
        
        res.json(pedidocreado);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}

export const getLastPedidos = async (req,res) => {
    try{
        const { clienteID } = req.params;
        const id = parseInt(clienteID, 10);
        const getLast = await modelPedido.getLastPedido(id);
        res.json(getLast);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getPedidos =  async (req,res) => {
    console.log("llego el requerimiento de los pedidos")
    try {
        const getPedidos = await modelPedido.getPedido();
        //console.log("----controller pedido")
       // console.log(getPedidos)
        res.json(getPedidos)
    } catch (error) {
        res.status(500).json({erro:error.message})
    }
}

export const getPedidosConductor = async (req,res) => {
    console.log("id pedido conductor llego")

    try{
        const {rutaID} = req.params;
        const id = parseInt(rutaID,10);
        console.log(id)
        const {conductorID} = req.params;
        const id2 = parseInt(conductorID,10);
        console.log(id2)
        const getPedidoCond = await modelPedido.getPedidoConductor(id,id2);
        res.json(getPedidoCond);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getPedidoEmpleados = async (req,res) => {
    try {
        const {empleadoID} =req.params
        const id = parseInt(empleadoID,10)
        const getPedidosEmpleado = await modelPedido.getPedidoEmpleado(id);
        res.json(getPedidosEmpleado);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const getPedidosClientes = async (req,res) => {
    console.log("id cliente llego")

    try{
        const {clienteID} = req.params;
        const id = parseInt(clienteID,10);
        console.log(id)
        const getPedidoCli = await modelPedido.getPedidosCliente(id);
        res.json(getPedidoCli);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const deletePedidos = async (req,res) => {
    console.log("id llego")
    try {
        const { pedidoID } = req.params;
        const id = parseInt(pedidoID, 10);
        const deleteResult = await modelPedido.deletePedido(id);

        if (deleteResult) {
            res.json({ mensaje: 'El pedido ha sido eliminado exitosamente' });
        } else {
            // Si rowCount no es 1, significa que no se encontró un cliente con ese ID
            res.status(404).json({ error: 'No se encontró la ruta con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateEstadoPedidos = async (req,res)=>{
    try {
        const {pedidoID} = req.params;
        const id = parseInt(pedidoID,10);
        const newDatos = req.body;
        console.log('este es el estado-----')
        console.log(newDatos)
        
        const updatePedidos = await modelPedido.updateEstadoPedido(id,newDatos);
        console.log('este es el update-----')
        console.log(updatePedidos)
        res.json(updatePedidos);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

export const updateRutaPedidos = async(req,res)=>{
    try {
        // EXTRAYENDO EL ID DE LA RUTA
        const {pedidoID} = req.params
        const idpedido =parseInt(pedidoID,10)
       // console.log("idpedido")
        //console.log(idpedido)

        // EXTRAYENDO EL BODY 
        const ruta = req.body
        const updaterutapedido = await modelPedido.updateRutaPedido(idpedido,ruta)
        res.json(updaterutapedido)

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}


