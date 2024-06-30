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
 *     summary: Login de un comercio
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
 *                 example: mercadona@mercadona.com
 *               cif:
 *                 type: string
 *                 example: CIF333333
 *     responses:
 *       200:
 *         description: Comercio autenticado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2I5ZGU5NjkyOTU1N2IwOWVjYjRiNCIsImlhdCI6MTcxOTM3NzM4NX0.3XxnDYNP3BxtJCb-muPDIWPeJDWWVfUwjDUlFb1ZvnE
 *                 comercio:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 667b9de96929557b09ecb4b4
 *                     nombre:
 *                       type: string
 *                       example: mercadona
 *                     CIF:
 *                       type: string
 *                       example: CIF333333
 *                     direccion:
 *                       type: string
 *                       example: Calle Falsa 123
 *                     email:
 *                       type: string
 *                       example: mercadona@mercadona.com
 *                     telefono:
 *                       type: string
 *                       example: 699898943
 *                     paginaID:
 *                       type: string
 *                       example: 667cc4f64a3f97545c29b841
 *                     deleted:
 *                       type: boolean
 *                       example: false
 *                     tokenJWT:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2I5ZGU5NjkyOTU1N2IwOWVjYjRiNCIsImlhdCI6MTcxOTM3NzM4NX0.3XxnDYNP3BxtJCb-muPDIWPeJDWWVfUwjDUlFb1ZvnE
 *                     createdAt:
 *                       type: string
 *                       example: 2024-06-26T04:49:45.430Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2024-06-27T01:48:38.356Z
 *       404:
 *         description: Comercio no encontrado
 *       400:
 *         description: Credenciales incorrectas
 */


router.post('/login',validatorLoginComercio, loginComercio)

// Ruta para optener el contenido asociado al comercio

/**
 * @swagger
 * /api/comercios/info:
 *   get:
 *     summary: Obtener la información del comercio autenticado
 *     tags: [Comercios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del comercio obtenida con éxito
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
 *                       example: Restaurante
 *                     titulo:
 *                       type: string
 *                       example: Tu mercado Dia a dia
 *                     resumen:
 *                       type: string
 *                       example: Vendemos mucha porqueria
 *                     text:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [sss, aaaa, aaaaa, aaaaa, aaaaaaa]
 *                     fotos:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [uploads\\1719718764324-shishaBar.jpg]
 *                     scoring:
 *                       type: number
 *                       example: 4
 *                     numScoring:
 *                       type: number
 *                       example: 1
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [6680c3dffd1c5efd1502a427]
 *                     createdAt:
 *                       type: string
 *                       example: 2024-06-27T01:48:38.322Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2024-06-30T16:28:47.135Z
 *       404:
 *         description: Comercio no encontrado
 *       401:
 *         description: No autorizado
 */


router.get('/info',auth, auth.isComercio, getComercioyContenido);

// Ruta para crear un nuevo contenido

/**
 * @swagger
 * /api/comercios:
 *   post:
 *     summary: Crear una nueva página de contenido para un comercio
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
 *                 example: [Bienvenidos a nuestro restaurante., Ofrecemos una gran variedad de platos.]
 *               fotos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: []
 *     responses:
 *       200:
 *         description: Contenido nuevo creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contenido nuevo creado con éxito
 *                 contenido:
 *                   type: object
 *                   properties:
 *                     ciudad:
 *                       type: string
 *                       example: Madrid
 *                     actividad:
 *                       type: string
 *                       example: Restaurante
 *                     titulo:
 *                       type: string
 *                       example: Restaurante TOP
 *                     resumen:
 *                       type: string
 *                       example: El mejor restaurante de la ciudad.
 *                     text:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [Bienvenidos a nuestro restaurante., Ofrecemos una gran variedad de platos.]
 *                     fotos:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     scoring:
 *                       type: number
 *                       example: 0
 *                     numScoring:
 *                       type: number
 *                       example: 0
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     _id:
 *                       type: string
 *                       example: 6681894e9f676e1532b3cfdb
 *                     createdAt:
 *                       type: string
 *                       example: 2024-06-30T16:35:26.089Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2024-06-30T16:35:26.089Z
 *       400:
 *         description: Contenido ya existe para este comercio
 *       404:
 *         description: Comercio no encontrado
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
 *     summary: Borrar el contenido de un comercio
 *     tags: [Comercios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contenido eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contenido eliminado con exito
 *       404:
 *         description: Comercio no encontrado o el comercio no tiene un contenido asociado
 */


router.delete("/contenido", auth, auth.isComercio, deleteContenido); 

// Ruta para actualizar contenido de comercio

/**
 * @swagger
 * /api/comercios/contenido:
 *   put:
 *     summary: Actualizar el contenido de un comercio
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
 *                 example: Granada
 *               actividad:
 *                 type: string
 *                 example: Heladería
 *               titulo:
 *                 type: string
 *                 example: Helados Frescos
 *               resumen:
 *                 type: string
 *                 example: Los mejores helados artesanales.
 *               text:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Helados de todos los sabores.", "Ingredientes naturales y frescos."]
 *               fotos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["foto1_comercio6.jpg"]
 *     responses:
 *       200:
 *         description: Página web actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Página web actualizada con éxito
 *                 contenido:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 668189c9ed8dc8aa28220701
 *                     ciudad:
 *                       type: string
 *                       example: Granada
 *                     actividad:
 *                       type: string
 *                       example: Heladería
 *                     titulo:
 *                       type: string
 *                       example: Helados Frescos
 *                     resumen:
 *                       type: string
 *                       example: Los mejores helados artesanales.
 *                     text:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Helados de todos los sabores.", "Ingredientes naturales y frescos."]
 *                     fotos:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["foto1_comercio6.jpg"]
 *                     scoring:
 *                       type: number
 *                       example: 0
 *                     numScoring:
 *                       type: number
 *                       example: 0
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: string
 *                     createdAt:
 *                       type: string
 *                       example: 2024-06-30T16:37:29.721Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2024-06-30T16:37:51.011Z
 *       404:
 *         description: Comercio no encontrado
 */


router.put("/contenido", auth, auth.isComercio, validatorUpdateContenido, updateContenido) 

// Ruta para subir texto

/**
 * @swagger
 * /api/comercios/contenido/texts:
 *   post:
 *     summary: Publicar un nuevo texto en el contenido del comercio
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
 *               text:
 *                 type: string
 *                 example: Este texto es increiblemente increible
 *     responses:
 *       200:
 *         description: Texto añadido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Texto añadido correctamente
 *                 texto:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Helados de todos los sabores.", "Ingredientes naturales y frescos.", "Este texto es increiblemente increible"]
 *       404:
 *         description: Comercio no encontrado
 */


router.post("/contenido/texts", auth.isComercio, validatorUploadText, uploadText); 

//Ruta para eliminar un texto

/**
 * @swagger
 * /api/comercios/contenido/texts/{textIndex}:
 *   delete:
 *     summary: Borrar un texto del contenido del comercio
 *     tags: [Comercios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: textIndex
 *         schema:
 *           type: integer
 *         required: true
 *         description: Índice del texto a borrar
 *         example: 0
 *     responses:
 *       200:
 *         description: Texto eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Texto eliminado correctamente
 *                 texto:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Ingredientes naturales y frescos.", "Este texto es increiblemente increible"]
 *       404:
 *         description: Comercio no encontrado
 */


router.delete("/contenido/texts/:textIndex", auth.isComercio, validatorDeleteText, deleteText); 

//Ruta para subir fotos

/**
 * @swagger
 * /api/comercios/contenido/fotos:
 *   post:
 *     summary: Subir una foto al contenido del comercio
 *     tags: [Comercios]
 *     security:
 *       - bearerAuth: []
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
 *             required:
 *               - photo
 *     responses:
 *       200:
 *         description: Foto añadida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Foto añadida correctamente
 *                 fotos:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["foto1_comercio6.jpg", "uploads\\1719765701266-shishaBar.jpg"]
 *       400:
 *         description: No se ha subido ninguna foto
 *       404:
 *         description: Comercio no encontrado
 */

router.post("/contenido/fotos", auth.isComercio, upload.single('photo'), validatorUploadFoto, uploadFoto);

//Ruta para eliminar una foto

/**
 * @swagger
 * /api/comercios/contenido/fotos/{fotoIndex}:
 *   delete:
 *     summary: Eliminar una foto del contenido del comercio
 *     tags: [Comercios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fotoIndex
 *         schema:
 *           type: integer
 *         required: true
 *         description: Índice de la foto a eliminar
 *     responses:
 *       200:
 *         description: Foto eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Foto eliminada correctamente
 *                 fotos:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["uploads\\1719765701266-shishaBar.jpg", "uploads\\1719765716836-shishaBar.jpg"]
 *       404:
 *         description: Comercio o foto no encontrados
 */

router.delete("/contenido/fotos/:fotoIndex", auth.isComercio, validatorDeleteFoto, deleteFoto); 

// Ruta para consultar intereses de usuarios

/**
 * @swagger
 * /api/comercios/contenido/intereses:
 *   get:
 *     summary: Mostrar correos electrónicos de usuarios de la misma ciudad y con el mismo interés
 *     tags: [Comercios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Correos electrónicos obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 emails:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["usuario1@example.com", "usuario2@example.com"]
 *       404:
 *         description: Comercio no encontrado
 */

router.get('/contenido/intereses', auth.isComercio, consultarIntereses);

module.exports = router