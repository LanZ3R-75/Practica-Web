/**
 * Definimos y manejamos las rutas CRUD para comercios
 */
const express = require("express") //Importamos el modulo express para crear un enrutador que maneje las rutas
const router = express.Router()
const multer = require("multer");
const path = require("path");
const auth = require('../utils/auth');
const { createContenido, deleteContenido, uploadFoto, deleteFoto, uploadText, deleteText, updateContenido, consultarIntereses} = require("../controllers/comercios");

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

// Ruta para crear un nuevo contenido
router.post("/", auth, auth.isComercio, createContenido); 

// Ruta para crear un nuevo contenido
router.delete("/", auth, auth.isComercio, deleteContenido); 

// Ruta para actualizar contenido de comercio
router.put("/contenido", auth, auth.isComercio, updateContenido) 

// Ruta para subir texto
router.post("/contenido/texts", auth.isComercio, uploadText); 

//Ruta para eliminar un texto
router.delete("/contenido/texts/:textIndex", auth.isComercio, deleteText); 

//Ruta para subir fotos
router.post("/contenido/fotos", auth.isComercio, upload.single('photo'), uploadFoto);

//Ruta para eliminar una foto
router.delete("/contenido/fotos/:fotoIndex", auth.isComercio, deleteFoto); 

// Ruta para consultar intereses de usuarios
router.get('/contenido/intereses', auth.isComercio, consultarIntereses);

module.exports = router