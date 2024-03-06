import modelLogin from "../models/login_models.mjs";

export const getUsers = async (req,res) => {
    try {
        const credenciales = req.body
        const userResponse = await modelLogin.Login(credenciales);

        // Manejar diferentes casos basados en el tipo de respuesta
        if (userResponse.usuario) {
          // Caso de éxito: Usuario autenticado
          res.json(userResponse);
        } else if (userResponse.message === "credenciales invalidas") {
          // Credenciales inválidas
          res.status(401).json(userResponse);
        } else if (userResponse.message === "Usuario no encontrado ni asociado") {
          // Usuario no encontrado ni asociado
          res.status(404).json(userResponse);
        } else {
          // Otro caso no manejado
          res.status(500).json({ error: "Respuesta inesperada del servidor" });
        }
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}