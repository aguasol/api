import modelClientenr from "../models/ventas_clientenr_model.mjs";

export const createClientesnr = async (req,res) => {
    try {
        const newcliente = req.body
        const createcliente= await modelClientenr.createClientenr(newcliente);
        res.status(200).json(createcliente);
    } catch (error) {
      //  console.log("hola soy error del servidor")
        res.status(500).json({error:error.message});

    }
}
export const getClienteNR =  async (req,res) => {
   // console.log("id llego")
    try {
        const getCliente = await modelClientenr.getClientenr();
        //console.log("----controller pedido")
       // consolelog(getPedidos)
        res.status(200).json(getCliente)
    } catch (error) {
        res.status(500).json({erro:error.message})
    }
}

//Cambio para hallar el ultimo cliente NR, segun el empleado ID
export const getLastClientesnr =  async (req,res) => {
   // console.log('entro al get las cliente')
    try {
        const { empleadoID} = req.params;
        const empleado_id = parseInt(empleadoID,10);
        const getLast =  await modelClientenr.getLastClientenr(empleado_id)
        res.status(200).json(getLast);
    } catch (error) {
        res.status(500).json({"message":"NO DATA"})
    }
}
