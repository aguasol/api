import modelUserCliente from "../models/usuario_cliente_model.mjs";

export const getAllUserClientes = async (req,res) => {
    try {
        const alluserclients = await modelUserCliente.getUsersCliente();
        res.json(alluserclients);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}

export const createUserClientes = async (req,res) => {
    try{
        const newUserClient = req.body;
        const clientCreated = await modelUserCliente.createUserCliente(newUserClient);
        res.json({clientCreated});
    }
    catch(e){
        res.status(500).json({error:e.message})
    }
}
export const updateUserClientes = async (req,res)=>{
    try {
        const {userClientId} = req.params;
        const id = parseInt(userClientId,10);
        console.log('el id',id);
        const data = req.body;
        console.log('data',data)
        const updateUserClient = await modelUserCliente.updateUserCliente(id,data);
        res.json(updateUserClient);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
export const deleteUserClientes = async (req,res) => {
    try {
        const { userClientId } = req.params;
        const id = parseInt(userClientId, 10);
        const deleteResult = await modelUserCliente.deleteUserCliente(id);

        if (deleteResult) {
            res.json({ mensaje: 'Usuario Cliente eliminado exitosamente' });
        } else {
            // Si rowCount no es 1, significa que no se encontró un cliente con ese ID
            res.status(404).json({ error: 'No se encontró la ruta con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const existCodeClientes = async (req,res) => {
    try {
        const newcodigo = req.body;
        const clienteExists = await modelUserCliente.existCodeCliente(newcodigo)
        res.status(200).json(clienteExists)
    } catch (e) {
        res.status(500).json({error:e.message})
    }
}
