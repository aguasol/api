import modelUserConductor from "../models/usuario_conductor_model.mjs";

export const getAllUserConductores = async (req,res) => {
    try {
        const {idEmpleado} =req.params;
        const idempleados = parseInt(idEmpleado,10);
        const alluserconductores= await modelUserConductor.getUsersConductor(idempleados);
        res.json(alluserconductores);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}

export const getAllUsersConductores = async (req,res) => {
    try {

        const alluserconductores= await modelUserConductor.getAllUsersConductor();
        res.status(200).json(alluserconductores);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}

export const createUserConductores = async (req,res) => {
    try{
        const newConductor = req.body;
        const conductorCreated = await modelUserConductor.createUserConductor(newConductor);
        if(conductorCreated.message=="Usuario ya existente, intente otro por favor."){
            res.status(401).json(conductorCreated)
        }
        else{
            res.status(200).json(conductorCreated)
        }
        
    }
    catch(e){
        res.status(500).json({error:e.message})
    }
}
export const getconductorrutas = async (req,res) => {
    try {
        const {empleadoID} = req.params;
        const empleadosid = parseInt(empleadoID,10);
        const allgetconductorruta = await modelUserConductor.getconductorruta(empleadosid);
        res.json(allgetconductorruta)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const updateUserConductores = async (req,res)=>{
    try {
        const {userConductorId} = req.params;
        const id = parseInt(userConductorId,10);
        //console.log('el id',id);
        const data = req.body;
       // console.log('data',data)
        const updateUserConductor = await modelUserConductor.updateUserConductor(id,data);
        res.json(updateUserConductor);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
//cambios pato
export const updateConductorEstado = async (req, res) => {
    try {
      const { userConductorId } = req.params;
      const  newData = req.body;
      const id = parseInt(userConductorId, 10);



      const updatedConductor = await modelUserConductor.updateConductorEstado(id, newData);

    

      res.status(200).json(updatedConductor);
    } catch (error) {
      //console.error(Error en el controlador: ${error.message});
      res.status(500).json({ error: error.message });
    }
  };


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
        const {conductorID,empleadoID}=req.params
        const empleadoid = parseInt(empleadoID,10);
        const conductorid = parseInt(conductorID, 10); 
        const pedidosConductor= await modelUserConductor.getPedidosPorConductor(conductorid,empleadoid);
        res.status(200).json(pedidosConductor);
    } catch (error) {
        res.status(500).json({error:error.message});

    }
}
export const getConductorAdmines = async (req,res) => {
    try {
        const {idAdmin} = req.params
        const idAdministrador = parseInt(idAdmin,10);
        const getconductoradmin = await modelUserConductor.getConductorAdmin(idAdministrador);
        res.status(200).json(getconductoradmin);
    } catch (error){
        res.status(500).json({error:error.message});
    }
}
export const createconductorpedidos = async (req,res) => {
    try{
        const { conductor_id, pedido_id, fecha_aceptacion } = req.body;
        const conductorPedidoCreated = await modelUserConductor.createconductorpedido(conductor_id, pedido_id, fecha_aceptacion);
        res.status(200).json(conductorPedidoCreated);

    }
    catch(e){
        res.status(500).json({error:e.message})
    }
}