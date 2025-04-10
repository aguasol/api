import express from "express";
import modelPedido from "../models/ventas_pedido_model.mjs";

export const createPedidos = async (req, res) => {
    try {
        const newpedido = req.body
        const pedidocreado = await modelPedido.createPedido(newpedido);

        res.status(200).json(pedidocreado);
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}
//ANULAR PEDIDO CLIENTE MICROSERVICIO
export const anularPedidoClienteController = async (req, res) => {
    try {
        const { idpedido } = req.params
        const pedidoid = parseInt(idpedido, 10)
        const observacion = req.body
        const result = await modelPedido.anularPedidoCliente(pedidoid, observacion)
        res.status(200).json(result)
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getLastPedidos = async (req, res) => {
    try {
        const { clienteID } = req.params;
        const id = parseInt(clienteID, 10);
        const getLast = await modelPedido.getLastPedido(id);
        res.status(200).json(getLast);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getPedidos = async (req, res) => {
    // console.log("llego el requerimiento de los pedidos")
    try {
        const { empleadoid } = req.params;
        const idempleado = parseInt(empleadoid, 10);
        const getidempleado = await modelPedido.getPedido(idempleado)
        //const getPedidos = await modelPedido.getPedido();
        //console.log("----controller pedido")
        // console.log(getPedidos)
        res.status(200).json(getidempleado)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
}

export const getPedidosConductor = async (req, res) => {
    // console.log("id pedido conductor llego")

    try {
        const { rutaID } = req.params;
        const id = parseInt(rutaID, 10);
        // console.log(id)
        // const {conductorID} = req.params;
        //const id2 = parseInt(conductorID,10);
        // console.log(id2)
        const getPedidoCond = await modelPedido.getPedidoConductor(id);
        res.status(200).json(getPedidoCond);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getPedidoEmpleados = async (req, res) => {
    try {
        const { empleadoID } = req.params
        const id = parseInt(empleadoID, 10)
        const getPedidosEmpleado = await modelPedido.getPedidoEmpleado(id);
        res.status(200).json(getPedidosEmpleado);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getPedidosClientes = async (req, res) => {
    //console.log("id cliente llego")

    try {
        const { clienteID } = req.params;
        const id = parseInt(clienteID, 10);
        // console.log(id)
        const getPedidoCli = await modelPedido.getPedidosCliente(id);
        res.status(200).json(getPedidoCli);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const getTotalEntregados = async (req, res) => {
    try {
        const { empleadoID } = req.params
        const id = parseInt(empleadoID, 10)
        const getTotals = await modelPedido.getTotalEntregadosPedidos(id)
        res.status(200).json(getTotals)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
export const updatePedidos = async (req, res) => {
    try {
        const { pedidoID } = req.params;
        const id = parseInt(pedidoID, 10);
        const newDatos = req.body;
        //console.log('este es el estado-----')
        //console.log(newDatos)

        const updatePedidos = await modelPedido.updatePedido(id, newDatos);
        // console.log('este es el update-----')
        //console.log(updatePedidos)
        res.status(200).json(updatePedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const deletePedidos = async (req, res) => {
    //  console.log("id llego")
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

//DEL CONDUCTOR CUANDO MARCA UN PEDIDO COMO ENTREGADO O TRUNCADO
export const updateEstadoPedidos = async (req, res) => {
    try {
        const { pedidoID } = req.params;
        const id = parseInt(pedidoID, 10);
        const newDatos = req.body;
        //console.log('este es el estado-----')
        //console.log(newDatos)

        const updatePedidos = await modelPedido.updateEstadoPedido(id, newDatos);
        // console.log('este es el update-----')
        //console.log(updatePedidos)
        res.json(updatePedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateRutaPedidos = async (req, res) => {
    try {
        // EXTRAYENDO EL ID DE LA RUTA
        const { pedidoID } = req.params
        const idpedido = parseInt(pedidoID, 10)
        // console.log("idpedido")
        //console.log(idpedido)

        // EXTRAYENDO EL BODY 
        const ruta = req.body
        const updaterutapedido = await modelPedido.updateRutaPedido(idpedido, ruta)
        res.json(updaterutapedido)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getPedidosNews = async (req, res) => {
    try {
        const { empleadoID } = req.params
        const idEmpleado = parseInt(empleadoID, 10)
        const newpedidos = await modelPedido.getPedidosNew(idEmpleado)
        res.status(200).json(newpedidos)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const updateEstadoRutas = async (req, res) => {
    try {
        const { idpedido } = req.params
        const pedidoid = parseInt(idpedido, 10)
        const result = await modelPedido.updateEstadoRuta(pedidoid)
        res.status(200).json(result)
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}


export const updateEstadoRutaCancelados = async (req, res) => {
    try {
        const { idpedido } = req.params
        const pedidoid = parseInt(idpedido, 10)
        const observacion = req.body
        const result = await modelPedido.updateEstadoRutaCancelado(pedidoid, observacion)
        res.status(200).json(result)
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getPedidosDesktop = async (req, res) => {
    // console.log("llego el requerimiento de los pedidos")
    try {
        const { empleadoid } = req.params;
        const idempleado = parseInt(empleadoid, 10);
        const getidempleado = await modelPedido.getPedidoDesktop(idempleado)
        //const getPedidos = await modelPedido.getPedido();
        //console.log("----controller pedido")
        // console.log(getPedidos)
        res.status(200).json(getidempleado)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
// cambios pato
export const getAllPedidosDesktop = async (req, res) => {
    // console.log("llego el requerimiento de los pedidos")
    try {
        //const {empleadoid} = req.params;
        //const idempleado = parseInt(empleadoid,10);
        const getidempleado = await modelPedido.getAllPedidoDesktop()
        //const getPedidos = await modelPedido.getPedido();
        //console.log("----controller pedido")
        // console.log(getPedidos)
        res.status(200).json(getidempleado)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
}

export const getAllPedidosDesktopTotales =  async (req,res) => {
    // console.log("llego el requerimiento de los pedidos")
     try {
         //const {empleadoid} = req.params;
         //const idempleado = parseInt(empleadoid,10);
         const getidempleado = await modelPedido.getAllPedidoDesktopTotales()
         //const getPedidos = await modelPedido.getPedido();
         //console.log("----controller pedido")
        // console.log(getPedidos)
         res.status(200).json(getidempleado)
     } catch (error) {
         res.status(500).json({erro:error.message})
     }
 }
// CONTROLLER PARA ESTADOS FLASH DE CONDUCTOR

export const updateEstadoFlash = async (req, res) => {
    // console.log("llego el requerimiento de los pedidos")
    try {
        const { pedidoID } = req.params;
        const id = parseInt(pedidoID, 10);
        const newdata = req.body;
        const resultado = await modelPedido.updateEstadoPedidosConductor(id, newdata)
        //const getPedidos = await modelPedido.getPedido();
        //console.log("----controller pedido")
        // console.log(getPedidos)
        res.status(200).json(resultado)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getpedidosinformes = async (req, res) => {
    try {
        const newfecha = req.body
        const resultado = await modelPedido.getpedidosinformefecha(newfecha)
        if (resultado.length > 0) {
            res.status(200).json(resultado)
        }
        else {
            res.status(404).json(resultado)
        }

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// ENPOINT PATRICK
export const getAllPedidosPendientesTotales = async (req, res) => {
    // console.log("llego el requerimiento de los pedidos")
    try {
        //const {empleadoid} = req.params;
        //const idempleado = parseInt(empleadoid,10);
        const getidempleado = await modelPedido.getAllPedidoPendienteTotales()
        //const getPedidos = await modelPedido.getPedido();
        //console.log("----controller pedido")
        // console.log(getPedidos)
        res.status(200).json(getidempleado)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
}


//CONTROLLER PARA PEDIDOS ENTREGADOS
export const getAllEntregados = async (req, res) => {
    // console.log("llego el requerimiento de los pedidos")
    try {
        //const {empleadoid} = req.params;
        //const idempleado = parseInt(empleadoid,10);
        const getidempleado = await modelPedido.getAllEntregado()
        //const getPedidos = await modelPedido.getPedido();
        //console.log("----controller pedido")
        // console.log(getPedidos)
        res.status(200).json(getidempleado)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
}







//CONTROLLER PEDIDOS PENDIENTES
export const getAllPendientes = async (req, res) => {
    // console.log("llego el requerimiento de los pedidos")
    try {
        //const {empleadoid} = req.params;
        //const idempleado = parseInt(empleadoid,10);
        const getidempleado = await modelPedido.getAllPendiente()
        //const getPedidos = await modelPedido.getPedido();
        //console.log("----controller pedido")
        // console.log(getPedidos)
        res.status(200).json(getidempleado)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
}



//CONTROLLER CONTADOR PEDIDOS ENTREGADOS
export const getAllCountEntregados = async (req, res) => {
    // console.log("llego el requerimiento de los pedidos")
    try {
        //const {empleadoid} = req.params;
        //const idempleado = parseInt(empleadoid,10);
        const getidempleado = await modelPedido.getAllCountEntregado()
        //const getPedidos = await modelPedido.getPedido();
        //console.log("----controller pedido")
        // console.log(getPedidos)
        res.status(200).json(getidempleado)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
}








//CONTROLLER CONTADOR PEDIDOS EN PROCESO
export const getAllCountProcesos = async (req, res) => {
    // console.log("llego el requerimiento de los pedidos")
    try {
        //const {empleadoid} = req.params;
        //const idempleado = parseInt(empleadoid,10);
        const getidempleado = await modelPedido.getAllCountProceso()
        //const getPedidos = await modelPedido.getPedido();
        //console.log("----controller pedido")
        // console.log(getPedidos)
        res.status(200).json(getidempleado)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
}


//CONTROLLER CONTADOR PEDIDOS PENDIENTES
export const getAllCountPendientes = async (req, res) => {
    // console.log("llego el requerimiento de los pedidos")
    try {
        //const {empleadoid} = req.params;
        //const idempleado = parseInt(empleadoid,10);
        const getidempleado = await modelPedido.getAllCountPendiente()
        //const getPedidos = await modelPedido.getPedido();
        //console.log("----controller pedido")
        // console.log(getPedidos)
        res.status(200).json(getidempleado)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
}

export const getAllPedidosDesktopEntregados = async (req, res) => {
    // console.log("llego el requerimiento de los pedidos")
    try {
        //const {empleadoid} = req.params;
        //const idempleado = parseInt(empleadoid,10);
        const getidempleado = await modelPedido.getAllPedidoDesktopEntregado()
        //const getPedidos = await modelPedido.getPedido();
        //console.log("----controller pedido")
        // console.log(getPedidos)
        res.status(200).json(getidempleado)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
}

export const getAllPedidosDesktopEntregadosMes = async (req, res) => {
    // console.log("llego el requerimiento de los pedidos")
    try {
        //const {empleadoid} = req.params;
        //const idempleado = parseInt(empleadoid,10);
        const getidempleado = await modelPedido.getAllPedidoDesktopEntregadoMes()
        //const getPedidos = await modelPedido.getPedido();
        //console.log("----controller pedido")
        // console.log(getPedidos)
        res.status(200).json(getidempleado)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
}


export const getAllPedidosDesktopEntregadosDia = async (req, res) => {
    // console.log("llego el requerimiento de los pedidos")
    try {
        //const {empleadoid} = req.params;
        //const idempleado = parseInt(empleadoid,10);
        const getidempleado = await modelPedido.getAllPedidoDesktopEntregadoDia()
        //const getPedidos = await modelPedido.getPedido();
        //console.log("----controller pedido")
        // console.log(getPedidos)
        res.status(200).json(getidempleado)
    } catch (error) {
        res.status(500).json({ erro: error.message })
    }
}






