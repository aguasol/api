import { randomBytes } from "crypto";
import modelVenta from "../models/ventas_venta_model.mjs";
import multer from 'multer';



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'D:/agua_sol_final/backend/public/imagesventa/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({storage})

export const uploadedPhotoVenta = upload.single('foto');
export const uploadPhotoVenta = async (req, res) => {
   
    try {
        const archivo = req.file
        const rutaarchivo = 'D:/agua_sol_final/backend/public/imagesventa/'+archivo.filename
        const allfoto = await modelVenta.createVenta(rutaarchivo);
        res.status(200).json({ message: allfoto });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
