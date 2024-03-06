import modelUserConductor from "../models/usuario_conductor_model.mjs";

export const getAllUserConductores = async (req,res) => {
    try {
        const alluserconductores= await modelUserConductor.getUsersConductor();
        res.json(alluserconductores);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}

export const createUserConductores = async (req,res) => {
    try{
        const newConductor = req.body;
        const conductorCreated = await modelUserConductor.createUserConductor(newConductor);
        if(conductorCreated.resultado){
            res.json(conductorCreated);
        }
        else if(conductorCreated.message==="Usuario ya existente, intente otro por favor."){
            res.status(409).json(conductorCreated)
        }
        else{
            res.status(500).json({error:"Respuesta inesperada del servidor"})
        }
        
    }
    catch(e){
        res.status(500).json({error:e.message})
    }
}
export const getconductorrutas = async (req,res) => {
    try {
        const allgetconductorruta = await modelUserConductor.getconductorruta();
        res.json(allgetconductorruta)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const updateUserConductores = async (req,res)=>{
    try {
        const {userConductorId} = req.params;
        const id = parseInt(userConductorId,10);
        console.log('el id',id);
        const data = req.body;
        console.log('data',data)
        const updateUserConductor = await modelUserConductor.updateUserConductor(id,data);
        res.json(updateUserConductor);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
export const deleteUserConductores = async (req,res) => {
    try {
        const { userConductorId } = req.params;
        const id = parseInt(userConductorId, 10);
        const deleteResult = await modelUserConductor.deleteUserConductor(id);

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

export const getPedidosPorConductores = async (req,res) => {
    try {
        const {conductorID}=req.params
        const id = parseInt(conductorID, 10); 
        const pedidosConductor= await modelUserConductor.getPedidosPorConductor(id);
        res.json(pedidosConductor);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}
