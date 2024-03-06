import modelUserAdmin from "../models/usuario_administrador_model.mjs";

export const getAllUsersAdmins = async (req,res) => {
    try {
        const alluseradmins = await modelUserAdmin.getUsersAdmins();
        res.json(alluseradmins);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}

export const createUserAdmins = async (req,res) => {
    try{
        const newUserAdmin = req.body;
        const adminCreated = await modelUserAdmin.createUserAdmin(newUserAdmin);
        res.json({adminCreated});
    }
    catch(e){
        res.status(500).json({error:e.message})
    }
}
export const updateUserAdmins = async (req,res)=>{
    try {
        const {userAdminId} = req.params;
        const id = parseInt(userAdminId,10);
        console.log('el id',id);
        const data = req.body;
        console.log('data',data)
        const updateUserAdmin = await modelUserAdmin.updateUserAdmin(id,data);
        res.json(updateUserAdmin);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
export const deleteUserAdmins = async (req,res) => {
    try {
        const { userAdminId } = req.params;
        const id = parseInt(userAdminId, 10);
        const deleteResult = await modelUserAdmin.deleteUserAdmin(id);

        if (deleteResult) {
            res.json({ mensaje: 'Usuario Administrador eliminado exitosamente' });
        } else {
            // Si rowCount no es 1, significa que no se encontró un cliente con ese ID
            res.status(404).json({ error: 'No se encontró la ruta con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
