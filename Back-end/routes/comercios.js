/**
 * Definimos y manejamos las rutas CRUD para comercios
 */
const express = require("express") //Importamos el modulo express para crear un enrutador que maneje las rutas
const router = express.Router()
const multer = require("multer");
const path = require("path");
const auth = require('../utils/auth');

const { loginComercio,
        getComercioyContenido,
        deleteComercio,
        createContenido, 
        deleteContenido, 
        uploadFoto, 
        deleteFoto, 
        uploadText, 
        deleteText, 
        updateContenido, 
        consultarIntereses
    } = require("../controllers/comercios");

const { validatorLoginComercio,
        validatorCreateContenido,
        validatorUpdateContenido,
        validatorUploadText,
        validatorDeleteText,
        validatorUploadFoto,
        validatorDeleteFoto

    } = require("../validators/comercios");

//GESTION DEL MULTER

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las fotos
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

// Ruta para loggear un comercio

/**
 * @swagger
 * /api/comercios/login:
 *   post:
 *     summary: Loguea un comercio
 *     tags: [Comercios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: comercio@xyz.com
 *               cif:
 *                 type: string
 *                 example: CIF333333
 *     responses:
 *       200:
 *         description: Comercio logueado con éxito
 *       400:
 *         description: Credenciales no válidas
 */

router.post('/login',validatorLoginComercio, loginComercio)

// Ruta para optener el contenido asociado al comercio

/**
 * @swagger
 * /api/comercios/info:
 *   get:
 *     summary: Obtiene el contenido asociado al comercio
 *     tags: [Comercios]
 *     responses:
 *       200:
 *         description: Contenido del comercio obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                   example: mercadona
 *                 email:
 *                   type: string
 *                   example: mercadona@mercadona.com
 *                 CIF:
 *                   type: string
 *                   example: CIF333333
 *                 contenido:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 667cc4f64a3f97545c29b841
 *                     ciudad:
 *                       type: string
 *                       example: Madrid
 *                     actividad:
 *                       type: string
 *                       example: Comercio
 *                     titulo:
 *                       type: string
 *                       example: Tu mercado de confianza
 *                     resumen:
 *                       type: string
 *                       example: Vendemos todas tus necesidades del dia a dia
 *                     text:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [ "tomates-1.40", "pepinillos-2.50", "pollo-2x1" ]
 *                     fotos:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [ "uploads\\1719718764324-mercadona.jpg" ]
 *                     scoring:
 *                       type: integer
 *                       example: 4
 *                     numScoring:
 *                       type: integer
 *                       example: 2
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [ "6680c3dffd1c5efd1502a427", "6680cd0ed8318cc9aee2dcf6" ]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-06-27T01:48:38.322Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-06-30T03:39:24.397Z
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Comercio no encontrado
 */

router.get('/info',auth, auth.isComercio, getComercioyContenido);

// Ruta para crear un nuevo contenido

/**
 * @swagger
 * /api/comercios:
 *   post:
 *     summary: Crea una nueva página de contenido
 *     tags: [Comercios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ciudad:
 *                 type: string
 *                 example: Madrid
 *               actividad:
 *                 type: string
 *                 example: Restaurante
 *               titulo:
 *                 type: string
 *                 example: Restaurante TOP
 *               resumen:
 *                 type: string
 *                 example: El mejor restaurante de la ciudad.
 *               text:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [ "Bienvenidos a nuestro restaurante.", "Ofrecemos una gran variedad de platos." ]
 *               fotos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Página de contenido creada con éxito
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Error en la solicitud
 */

router.post("/", auth, auth.isComercio, validatorCreateContenido, createContenido); 

/**
 * @swagger
 * /api/comercios:
 *   delete:
 *     summary: Borra un comercio
 *     tags: [Comercios]
 *     responses:
 *       200:
 *         description: Comercio borrado con éxito
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Comercio no encontrado
 */


router.delete("/", auth, auth.isComercio, deleteComercio); 

// Ruta para borrar un contenido

/**
 * @swagger
 * /api/comercios/contenido:
 *   delete:
 *     summary: Borra un contenido
 *     tags: [Comercios]
 *     responses:
 *       200:
 *         description: Contenido borrado con éxito
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Contenido no encontrado
 */

router.delete("/contenido", auth, auth.isComercio, deleteContenido); 

// Ruta para actualizar contenido de comercio

/**
 * @swagger
 * /api/comercios/contenido:
 *   put:
 *     summary: Actualiza un contenido
 *     tags: [Comercios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Nuevo título del contenido
 *               description:
 *                 type: string
 *                 example: Nueva descripción del contenido
 *     responses:
 *       200:
 *         description: Contenido actualizado con éxito
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Contenido no encontrado
 */

router.put("/contenido", auth, auth.isComercio, validatorUpdateContenido, updateContenido) 

// Ruta para subir texto

/**
 * @swagger
 * /api/comercios/contenido/texts:
 *   post:
 *     summary: Sube un nuevo texto
 *     tags: [Comercios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: Este es un nuevo texto
 *     responses:
 *       200:
 *         description: Texto subido con éxito
 *       401:
 *         description: No autorizado
 */

router.post("/contenido/texts", auth.isComercio, validatorUploadText, uploadText); 

//Ruta para eliminar un texto

/**
 * @swagger
 * /api/comercios/contenido/texts/{textIndex}:
 *   delete:
 *     summary: Elimina un texto
 *     tags: [Comercios]
 *     parameters:
 *       - in: path
 *         name: textIndex
 *         required: true
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: Texto eliminado con éxito
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Texto no encontrado
 */

router.delete("/contenido/texts/:textIndex", auth.isComercio, validatorDeleteText, deleteText); 

//Ruta para subir fotos

/**
 * @swagger
 * /api/comercios/contenido/fotos:
 *   post:
 *     summary: Sube una nueva foto
 *     tags: [Comercios]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto subida con éxito
 *       401:
 *         description: No autorizado
 */

router.post("/contenido/fotos", auth.isComercio, upload.single('photo'), validatorUploadFoto, uploadFoto);

//Ruta para eliminar una foto

/**
 * @swagger
 * /api/comercios/contenido/fotos/{fotoIndex}:
 *   delete:
 *     summary: Elimina una foto
 *     tags: [Comercios]
 *     parameters:
 *       - in: path
 *         name: fotoIndex
 *         required: true
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: Foto eliminada con éxito
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Foto no encontrada
 */

router.delete("/contenido/fotos/:fotoIndex", auth.isComercio, validatorDeleteFoto, deleteFoto); 

// Ruta para consultar intereses de usuarios

/**
 * @swagger
 * /api/comercios/contenido/intereses:
 *   get:
 *     summary: Consulta los intereses de los usuarios
 *     tags: [Comercios]
 *     responses:
 *       200:
 *         description: Intereses consultados con éxito
 *       401:
 *         description: No autorizado
 */

router.get('/contenido/intereses', auth.isComercio, consultarIntereses);

module.exports = router