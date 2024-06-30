/**
 * Definimos y manejamos las rutas CRUD para User
 */
const express = require("express")
const auth = require('../utils/auth')
const router = express.Router()

const { getContenido, 
        getContenidoByCiudad, 
        getContenidoByActividad, 
        getContenidoByCiudadAndActividad,
        getContenidoByID,
        getReviewsByContenido,
        registerUser,
        loginUser,
        getUserProfile,
        updateUser,
        updateEmail,
        updatePassword,
        deleteUser,
        postReview,
        getUserReview,
        pruebaSlack
        } = require ('../controllers/user')

const { 
        validatorRegisterUser,
        validatorLoginUser,
        validatorUpdateUser,
        validatorUpdateEmail,
        validatorUpdatePassword,
        validatorPostReview

        } = require('../validators/user')

//--------------------------------------------------------------------------------------------------------------------------
//RUTA PARA USUARIOS PUBLICOS
//--------------------------------------------------------------------------------------------------------------------------

//Ruta para consultar todos los contenidos

/**
 * @swagger
 * /api/comercios/contenido:
 *   get:
 *     summary: Consulta todos los contenidos
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordenar por puntuación
 *     responses:
 *       200:
 *         description: Lista de contenidos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                   email:
 *                     type: string
 *                   CIF:
 *                     type: string
 *                   contenido:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       ciudad:
 *                         type: string
 *                       actividad:
 *                         type: string
 *                       titulo:
 *                         type: string
 *                       resumen:
 *                         type: string
 *                       text:
 *                         type: array
 *                         items:
 *                           type: string
 *                       fotos:
 *                         type: array
 *                         items:
 *                           type: string
 *                       scoring:
 *                         type: integer
 *                       numScoring:
 *                         type: integer
 *                       reviews:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Contenidos no encontrados
 */

router.get('/comercios/contenido', getContenido)

//Ruta para consultar todos los contenido por ciudad

/**
 * @swagger
 * /api/comercios/contenido/ciudad:
 *   get:
 *     summary: Consulta contenidos por ciudad
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: ciudad
 *         schema:
 *           type: string
 *         description: Nombre de la ciudad
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordenar por puntuación
 *     responses:
 *       200:
 *         description: Lista de contenidos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   ciudad:
 *                     type: string
 *                   actividad:
 *                     type: string
 *                   titulo:
 *                     type: string
 *                   resumen:
 *                     type: string
 *                   text:
 *                     type: array
 *                     items:
 *                       type: string
 *                   fotos:
 *                     type: array
 *                     items:
 *                       type: string
 *                   scoring:
 *                     type: integer
 *                   numScoring:
 *                     type: integer
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No se ha encontrado ningún contenido para la ciudad
 */

router.get('/comercios/contenido/ciudad', getContenidoByCiudad)

//Ruta para consultar todos los contenido por Actividad

/**
 * @swagger
 * /api/comercios/contenido/actividad:
 *   get:
 *     summary: Consulta contenidos por actividad
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: actividad
 *         schema:
 *           type: string
 *         description: Nombre de la actividad
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordenar por puntuación
 *     responses:
 *       200:
 *         description: Lista de contenidos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   ciudad:
 *                     type: string
 *                   actividad:
 *                     type: string
 *                   titulo:
 *                     type: string
 *                   resumen:
 *                     type: string
 *                   text:
 *                     type: array
 *                     items:
 *                       type: string
 *                   fotos:
 *                     type: array
 *                     items:
 *                       type: string
 *                   scoring:
 *                     type: integer
 *                   numScoring:
 *                     type: integer
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No se ha encontrado ningún contenido para la actividad
 */

router.get('/comercios/contenido/actividad', getContenidoByActividad)

//Ruta para consultar todos los contenido por ciudad y Actividad

/**
 * @swagger
 * /api/comercios/contenido/ciudad/actividad:
 *   get:
 *     summary: Consulta contenidos por ciudad y actividad
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: ciudad
 *         schema:
 *           type: string
 *         description: Nombre de la ciudad
 *       - in: query
 *         name: actividad
 *         schema:
 *           type: string
 *         description: Nombre de la actividad
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordenar por puntuación
 *     responses:
 *       200:
 *         description: Lista de contenidos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   ciudad:
 *                     type: string
 *                   actividad:
 *                     type: string
 *                   titulo:
 *                     type: string
 *                   resumen:
 *                     type: string
 *                   text:
 *                     type: array
 *                     items:
 *                       type: string
 *                   fotos:
 *                     type: array
 *                     items:
 *                       type: string
 *                   scoring:
 *                     type: integer
 *                   numScoring:
 *                     type: integer
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No se ha encontrado ningún contenido para la ciudad y actividad
 */

router.get('/comercios/contenido/ciudad/actividad', getContenidoByCiudadAndActividad)

//Ruta para consultar todos los contenidos

/**
 * @swagger
 * /api/comercios/contenido/{id}:
 *   get:
 *     summary: Consulta contenido por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del contenido
 *     responses:
 *       200:
 *         description: Contenido obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                 email:
 *                   type: string
 *                 CIF:
 *                   type: string
 *                 contenido:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     ciudad:
 *                       type: string
 *                     actividad:
 *                       type: string
 *                     titulo:
 *                       type: string
 *                     resumen:
 *                       type: string
 *                     text:
 *                       type: array
 *                       items:
 *                         type: string
 *                     fotos:
 *                       type: array
 *                       items:
 *                         type: string
 *                     scoring:
 *                       type: integer
 *                     numScoring:
 *                       type: integer
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: No se ha encontrado ningún contenido para el ID introducido
 */

router.get('/comercios/contenido/:id', getContenidoByID)

//Ruta para registrar un usuario

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito
 *       400:
 *         description: El usuario ya existe
 */

router.post('/register', validatorRegisterUser, registerUser)

//Ruta pa obtener los nombres de usuario y la review asociada a un contenido

/**
 * @swagger
 * /api/comercios/contenido/reviews/{id}:
 *   get:
 *     summary: Obtiene las reviews de un contenido por ID de comercio
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comercio
 *     responses:
 *       200:
 *         description: Reviews obtenidas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userName:
 *                     type: string
 *                     example: Usuario1
 *                   scoring:
 *                     type: integer
 *                     example: 5
 *                   comentario:
 *                     type: string
 *                     example: Excelente servicio
 *       404:
 *         description: Comercio no encontrado
 */

router.get('/comercios/contenido/reviews/:id', getReviewsByContenido);

//--------------------------------------------------------------------------------------------------------------------------
//RUTAS PARA USUARIOS REGISTRADOS
//--------------------------------------------------------------------------------------------------------------------------

//Ruta para iniciar sesion un usuario

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Inicia sesión un usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Usuario autenticado con éxito
 *       404:
 *         description: Usuario no encontrado
 *       400:
 *         description: Contraseña incorrecta
 */

router.post('/login', validatorLoginUser, loginUser)

//Ruta para obtener los datos de un usuario

/**
 * @swagger
 * /api/perfil:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 */

router.get('/perfil', auth, auth.isUser, getUserProfile)

//Ruta para actualizar un usuario

/**
 * @swagger
 * /api/update:
 *   put:
 *     summary: Actualiza la información del usuario autenticado
 *     tags: [Usuarios]
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
 *               intereses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [ "Cine", "Lectura" ]
 *               ofertas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [ "Descuento 10%", "2x1 en entradas" ]
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *       404:
 *         description: Usuario no encontrado
 */

router.put('/update', auth, auth.isUser, validatorUpdateUser, updateUser)

//Ruta para actualizar el correo de un usuario

/**
 * @swagger
 * /api/email:
 *   put:
 *     summary: Actualiza el correo electrónico del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: nuevoemail@example.com
 *     responses:
 *       200:
 *         description: Correo electrónico actualizado con éxito
 *       400:
 *         description: El correo electrónico ya está en uso
 *       404:
 *         description: Usuario no encontrado
 */

router.put('/email',auth, auth.isUser, validatorUpdateEmail, updateEmail)

//Ruta para actualizar la contraseña de un usuario

/**
 * @swagger
 * /api/password:
 *   put:
 *     summary: Actualiza la contraseña del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: password123
 *               newPassword:
 *                 type: string
 *                 example: newpassword456
 *     responses:
 *       200:
 *         description: Contraseña actualizada con éxito
 *       400:
 *         description: Contraseña antigua incorrecta
 *       404:
 *         description: Usuario no encontrado
 */

router.put('/password',auth, auth.isUser, validatorUpdatePassword, updatePassword)

//Ruta para darse de baja como usuario

/**
 * @swagger
 * /api/baja:
 *   delete:
 *     summary: Darse de baja como usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta de usuario y reseñas asociadas eliminadas con éxito
 *       404:
 *         description: Usuario no encontrado
 */

router.delete('/baja',auth, auth.isUser, deleteUser)

//Ruta para publicar una reseña

/**
 * @swagger
 * /api/{contenidoId}/review:
 *   post:
 *     summary: Publica una reseña para un contenido
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contenidoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del contenido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comentario:
 *                 type: string
 *                 example: Excelente servicio
 *               puntuacion:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Reseña publicada correctamente
 *       400:
 *         description: Ya has escrito una reseña para este contenido
 *       404:
 *         description: Contenido no encontrado
 */

router.post('/:contenidoId/review', auth, auth.isUser, validatorPostReview, postReview)

//Ruta para obtener todas las reviews de un usuario

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Obtiene todas las reviews escritas por el usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reviews obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   comentario:
 *                     type: string
 *                     example: Excelente servicio
 *                   puntuacion:
 *                     type: integer
 *                     example: 5
 *                   contenidoID:
 *                     type: string
 *                     example: 60d0fe4f5311236168a109ca
 *       404:
 *         description: El usuario no ha publicado ninguna review
 */

router.get('/reviews', auth, auth.isUser, getUserReview)


//--------------------------------------------------------------------------------------------------------------------------
//                                      Prueba de SLACK
//--------------------------------------------------------------------------------------------------------------------------

/**
 * @swagger
 * /api/testSlack:
 *   get:
 *     summary: Prueba de error de Slack
 *     tags: [Pruebas]
 *     responses:
 *       500:
 *         description: Error forzado para probar Slack
 */

router.get('/testSlack', pruebaSlack)


module.exports = router;