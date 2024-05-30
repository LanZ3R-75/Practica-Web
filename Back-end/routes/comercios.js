/**
 * Definimos y manejamos las rutas CRUD para comercios
 */
const express = require("express") //Importamos el modulo express para crear un enrutador que maneje las rutas
const router = express.Router()
const multer = require("multer");
const path = require("path");
const auth = require('../utils/auth');
const { uploadPhoto, uploadText, updatecontenido } = require("../controllers/comercios");

//GESTION DEL MULTER

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'subidas/'); // Carpeta donde se guardarán las fotos
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

//RUTAS
router.post("/contenido/:id/photos", auth, auth.isComercio, upload.single('photo'), uploadPhoto);

// Ruta para actualizar contenido de comercio
router.put("/contenido/:id",auth, auth.isComercio, updatecontenido) 

// Ruta para subir texto
router.post("/contenido/:id/texts", auth, auth.isComercio, uploadText); 

module.exports = router