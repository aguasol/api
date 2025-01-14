import modelAlmacen from '../models/ventas_almacen_model.mjs'


export const getAlmacenes = async (req,res) => {
    try {
       
        const resultado= await modelAlmacen.getAlmacen();
        res.status(200).json(resultado);
    } catch (error) {
      //  console.log("hola soy error del servidor")
        res.status(500).json({error:error.message});

    }
}
export const getDemosInfo = async (req,res) => {
    try{
        const {id} = req.params;
        //const id = parseInt(idZona,10);
        const getDemoInformacion = await modelAlmacen.getDemoInfo(id);
        res.status(200).json(getDemoInformacion);
    }catch(error){
        res.status(500).json({error:error.message});
    }
}