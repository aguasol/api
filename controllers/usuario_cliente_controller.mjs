import modelUserCliente from "../models/usuario_cliente_model.mjs";

export const getAllUserClientes = async (req, res) => {
    try {
        const alluserclients = await modelUserCliente.getUsersCliente();
        res.status(200).json(alluserclients);
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}

export const createUserClientes = async (req, res) => {
    try {
        const newUserClient = req.body;
        const clientCreated = await modelUserCliente.createUserCliente(newUserClient);
        if (clientCreated.message == "Usuario ya existente, intente otro por favor. ") {
            res.status(401).json(clientCreated)
        } else {
            res.status(200).json({ clientCreated });
        }

    }
    catch (e) {
        res.status(500).json({ error: e.message })
    }
}
export const updateUserClientes = async (req, res) => {
    try {
        const { userClientId } = req.params;
        const id = parseInt(userClientId, 10);
        // console.log('el id',id);
        const data = req.body;
        //console.log('data',data)
        const updateUserClient = await modelUserCliente.updateUserCliente(id, data);
        res.status(200).json(updateUserClient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const updateClientes = async (req, res) => {
    try {
        const { userClienteId } = req.params
        //console.log('el userid',userClienteId);
        const id = parseInt(userClienteId, 10)
        //console.log('el id',id);
        const data = req.body;
        //console.log('data',data)
        const updateClient = await modelUserCliente.updateCliente(id, data);
        res.status(200).json(updateClient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const deleteUserClientes = async (req, res) => {
    try {
        const { userClientId } = req.params;
        const id = parseInt(userClientId, 10);
        const deleteResult = await modelUserCliente.deleteUserCliente(id);

        if (deleteResult) {
            res.status(200).json({ mensaje: 'Usuario Cliente eliminado exitosamente' });
        } else {
            // Si rowCount no es 1, significa que no se encontró un cliente con ese ID
            res.status(404).json({ error: 'No se encontró la ruta con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const existCodeClientes = async (req, res) => {
    try {
        const newcodigo = req.body;
        const clienteExists = await modelUserCliente.existCodeCliente(newcodigo)
        res.status(200).json(clienteExists)
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}
export const getClientRecovery = async (req, res) => {
    //console.log("dentro controller");
    try {
        //console.log(req.body);
        const info = req.body;
        const alluserclients = await modelUserCliente.getClienteRecuperacion(info);
        res.status(200).json(alluserclients);
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}
export const updateRecovery = async (req, res) => {
    //console.log("dentro controller");
    try {
        //console.log(req.body);
        const clave = req.body;
        const { userId } = req.params;
        const id = parseInt(userId, 10);
        const password = await modelUserCliente.updatePassword(clave, id);
        res.status(200).json(password);
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}
export const getAllRecargas = async (req, res) => {
    try {
        const { userClientId } = req.params;
        const id = parseInt(userClientId, 10);
        const alluserrecargas = await modelUserCliente.getRecargas(id);
        res.status(200).json(alluserrecargas);
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
}
export const getBidonNuevos = async (req, res) => {
    try {
        const { clienteID } = req.params
        const id = parseInt(clienteID, 10)
        const allgetBidonNew = await modelUserCliente.getBidonNuevo(id)
        res.status(200).json(allgetBidonNew)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// CONTROLLER PATRICK
export const getAllUserClientesSaldo = async (req, res) => {
    try {
        const alluserclients = await modelUserCliente.getUsersClienteSaldo();
        res.status(200).json(alluserclients);
    } catch (error) {
        res.status(500).json({ error: error.message });


    }
}


export const updateSaldoClientes = async (req, res) => {
    try {
        const { userClientId } = req.params;
        const id = parseInt(userClientId, 10);
        // console.log('el id',id);
        const data = req.body;
        //console.log('data',data)
        const updateSaldo = await modelUserCliente.updateSaldoCliente(id, data);
        res.status(200).json(updateSaldo);
    } catch (error) {
        res.status(500).json({ error: error.message });


    }
}
