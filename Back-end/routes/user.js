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
 * /api/user/comercios/contenido:
 *   get:
 *     summary: Consultar todos los comercios con su contenido
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Ordenar los comercios por scoring de forma ascendente o descendente
 *     responses:
 *       200:
 *         description: Lista de comercios con su contenido
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 66604205b9bc68d084386be9
 *                   nombre:
 *                     type: string
 *                     example: Teteria ben baker
 *                   CIF:
 *                     type: string
 *                     example: CIF5005AR
 *                   direccion:
 *                     type: string
 *                     example: Calle 5
 *                   email:
 *                     type: string
 *                     example: comercio666@example.com
 *                   telefono:
 *                     type: string
 *                     example: 645324515
 *                   paginaID:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 66604205b9bc68d084386be7
 *                       ciudad:
 *                         type: string
 *                         example: Bilbao
 *                       actividad:
 *                         type: string
 *                         example: Gimnasio
 *                       titulo:
 *                         type: string
 *                         example: Fitness Center
 *                       resumen:
 *                         type: string
 *                         example: Tu gimnasio en Bilbao.
 *                       text:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Equipos de última generación.", "Clases dirigidas y entrenadores personales."]
 *                       fotos:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["foto1_comercio5.jpg"]
 *                       scoring:
 *                         type: number
 *                         example: 4.5
 *                       numScoring:
 *                         type: number
 *                         example: 2
 *                       reviews:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["6680c55efd1c5efd1502a485", "6680c947d8318cc9aee2dbff"]
 *                   deleted:
 *                     type: boolean
 *                     example: false
 *                   tokenJWT:
 *                     type: string
 *                     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjA0MjA1YjliYzY4ZDA4NDM4NmJlOSIsImlhdCI6MTcxNzU4NDM4OX0.ap1x81XAMvLws6b5Z4zU_W6e3SFwE1zMoD597th5nes
 *                   createdAt:
 *                     type: string
 *                     example: 2024-06-05T10:46:29.067Z
 *                   updatedAt:
 *                     type: string
 *                     example: 2024-06-25T02:22:22.586Z
 *       400:
 *         description: Error en la solicitud
 */


router.get('/comercios/contenido', getContenido)

//Ruta para consultar todos los contenido por ciudad

/**
 * @swagger
 * /api/user/comercios/contenido/ciudad:
 *   get:
 *     summary: Consultar los contenidos por ciudad
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: ciudad
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la ciudad para filtrar los contenidos
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Ordenar los contenidos por scoring de forma ascendente o descendente
 *     responses:
 *       200:
 *         description: Lista de contenidos por ciudad
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 667fec79fd1c5efd1502a25c
 *                   ciudad:
 *                     type: string
 *                     example: Madrid
 *                   actividad:
 *                     type: string
 *                     example: Vender cosas
 *                   titulo:
 *                     type: string
 *                     example: Tu mercado Dia a dia
 *                   resumen:
 *                     type: string
 *                     example: aaaaaa
 *                   text:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["aaaaaaa", "aaaaaaaa"]
 *                   fotos:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["aaa", "a"]
 *                   scoring:
 *                     type: number
 *                     example: 5
 *                   numScoring:
 *                     type: number
 *                     example: 1
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["6680c492fd1c5efd1502a455"]
 *                   createdAt:
 *                     type: string
 *                     example: 2024-06-29T11:14:01.964Z
 *                   updatedAt:
 *                     type: string
 *                     example: 2024-06-30T16:28:47.199Z
 *       400:
 *         description: Error en la solicitud
 */


router.get('/comercios/contenido/ciudad', getContenidoByCiudad)

//Ruta para consultar todos los contenido por Actividad

/**
 * @swagger
 * /api/user/comercios/contenido/actividad:
 *   get:
 *     summary: Consultar los contenidos por actividad
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: actividad
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la actividad para filtrar los contenidos
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Ordenar los contenidos por scoring de forma ascendente o descendente
 *     responses:
 *       200:
 *         description: Lista de contenidos por actividad
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 666042b8b9bc68d084386bed
 *                   text:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Helados de todos los sabores.", "Ingredientes naturales y frescos."]
 *                   fotos:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["foto1_comercio6.jpg"]
 *                   scoring:
 *                     type: number
 *                     example: 0
 *                   numScoring:
 *                     type: number
 *                     example: 0
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: []
 *                   createdAt:
 *                     type: string
 *                     example: 2024-06-05T10:49:28.820Z
 *                   updatedAt:
 *                     type: string
 *                     example: 2024-06-30T16:28:47.065Z
 *                   actividad:
 *                     type: string
 *                     example: Bar
 *                   ciudad:
 *                     type: string
 *                     example: Granada
 *                   resumen:
 *                     type: string
 *                     example: Los mejores helados artesanales.
 *                   titulo:
 *                     type: string
 *                     example: Helados Frescos
 *       400:
 *         description: Error en la solicitud
 */


router.get('/comercios/contenido/actividad', getContenidoByActividad)

//Ruta para consultar todos los contenido por ciudad y Actividad

/**
 * @swagger
 * /api/user/comercios/contenido/ciudad/actividad:
 *   get:
 *     summary: Consultar los contenidos por ciudad y actividad
 *     tags: [Usuarios]
 *     parameters:
 *       - in: query
 *         name: ciudad
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la ciudad para filtrar los contenidos
 *       - in: query
 *         name: actividad
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la actividad para filtrar los contenidos
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Ordenar los contenidos por scoring de forma ascendente o descendente
 *     responses:
 *       200:
 *         description: Lista de contenidos por ciudad y actividad
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 666042b8b9bc68d084386bed
 *                   text:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Helados de todos los sabores.", "Ingredientes naturales y frescos."]
 *                   fotos:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["foto1_comercio6.jpg"]
 *                   scoring:
 *                     type: number
 *                     example: 0
 *                   numScoring:
 *                     type: number
 *                     example: 0
 *                   reviews:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: []
 *                   createdAt:
 *                     type: string
 *                     example: 2024-06-05T10:49:28.820Z
 *                   updatedAt:
 *                     type: string
 *                     example: 2024-06-30T16:28:47.065Z
 *                   actividad:
 *                     type: string
 *                     example: Bar
 *                   ciudad:
 *                     type: string
 *                     example: Granada
 *                   resumen:
 *                     type: string
 *                     example: Los mejores helados artesanales.
 *                   titulo:
 *                     type: string
 *                     example: Helados Frescos
 *       400:
 *         description: Error en la solicitud
 */


router.get('/comercios/contenido/ciudad/actividad', getContenidoByCiudadAndActividad)

//Ruta para consultar un comercio y su contenido por id

/**
 * @swagger
 * /api/user/comercios/contenido/{id}:
 *   get:
 *     summary: Consultar un comercio y su contenido por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comercio para filtrar el contenido
 *     responses:
 *       200:
 *         description: Comercio y su contenido correspondiente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 66604205b9bc68d084386be9
 *                 nombre:
 *                   type: string
 *                   example: Teteria ben baker
 *                 CIF:
 *                   type: string
 *                   example: CIF5005AR
 *                 direccion:
 *                   type: string
 *                   example: Calle 5
 *                 email:
 *                   type: string
 *                   example: comercio666@example.com
 *                 telefono:
 *                   type: string
 *                   example: 645324515
 *                 paginaID:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 66604205b9bc68d084386be7
 *                     text:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Equipos de última generación.", "Clases dirigidas y entrenadores personales."]
 *                     fotos:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["foto1_comercio5.jpg"]
 *                     scoring:
 *                       type: number
 *                       example: 4.5
 *                     numScoring:
 *                       type: number
 *                       example: 2
 *                     createdAt:
 *                       type: string
 *                       example: 2024-06-05T10:46:29.031Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2024-06-30T16:28:47.272Z
 *                     actividad:
 *                       type: string
 *                       example: Gimnasio
 *                     ciudad:
 *                       type: string
 *                       example: Bilbao
 *                     resumen:
 *                       type: string
 *                       example: Tu gimnasio en Bilbao.
 *                     titulo:
 *                       type: string
 *                       example: Fitness Center
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["6680c55efd1c5efd1502a485", "6680c947d8318cc9aee2dbff"]
 *                 deleted:
 *                   type: boolean
 *                   example: false
 *                 tokenJWT:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjA0MjA1YjliYzY4ZDA4NDM4NmJlOSIsImlhdCI6MTcxNzU4NDM4OX0.ap1x81XAMvLws6b5Z4zU_W6e3SFwE1zMoD597th5nes
 *                 createdAt:
 *                   type: string
 *                   example: 2024-06-05T10:46:29.067Z
 *                 updatedAt:
 *                   type: string
 *                   example: 2024-06-25T02:22:22.586Z
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Comercio no encontrado
 */

router.get('/comercios/contenido/:id', getContenidoByID)

//Ruta para registrar un usuario

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Registrar un nuevo usuario
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
 *                 example: user
 *               password:
 *                 type: string
 *                 example: passwordSegura
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               edad:
 *                 type: number
 *                 example: 18
 *               ciudad:
 *                 type: string
 *                 example: Barcelona
 *               intereses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Restaurante, Cafetería]
 *               ofertas:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Usuario registrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                   example: user
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 password:
 *                   type: string
 *                   example: $2a$10$Bk34oXbAXw64mSwuNk1HYOi9U.lCzlm9cbDNhvx.DazvQAyuBRsMG
 *                 edad:
 *                   type: number
 *                   example: 18
 *                 ciudad:
 *                   type: string
 *                   example: Barcelona
 *                 intereses:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: [Restaurante, Cafetería]
 *                 ofertas:
 *                   type: boolean
 *                   example: true
 *                 _id:
 *                   type: string
 *                   example: 66818f557e4ec78117f039ec
 *                 createdAt:
 *                   type: string
 *                   example: 2024-06-30T17:01:09.238Z
 *                 updatedAt:
 *                   type: string
 *                   example: 2024-06-30T17:01:09.238Z
 *       400:
 *         description: Error en la solicitud
 */


router.post('/register', validatorRegisterUser, registerUser)

//Ruta para obtener los nombres de usuario y la review asociada a un contenido

/**
 * @swagger
 * /api/user/comercios/contenido/reviews/{id}:
 *   get:
 *     summary: Obtener todas las reviews de un contenido
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del contenido para obtener las reviews
 *     responses:
 *       200:
 *         description: Lista de reviews del contenido
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userName:
 *                     type: string
 *                     example: Pepe
 *                   scoring:
 *                     type: number
 *                     example: 5
 *                   comentario:
 *                     type: string
 *                     example: Buenas shishas a buen precio
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Contenido no encontrado
 */


router.get('/comercios/contenido/reviews/:id', getReviewsByContenido);

//--------------------------------------------------------------------------------------------------------------------------
//RUTAS PARA USUARIOS REGISTRADOS
//--------------------------------------------------------------------------------------------------------------------------

//Ruta para iniciar sesion un usuario

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Iniciar sesión de usuario
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
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: passwordSegura
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODE4ZjU1N2U0ZWM3ODExN2YwMzllYyIsImlhdCI6MTcxOTc2NzAwMiwiZXhwIjoxNzE5ODUzNDAyfQ.NyVu7iRTezdF-4uLY0hcg-vbareo1fLNTDdERQoOV0U
 *       400:
 *         description: Credenciales incorrectas
 */


router.post('/login', validatorLoginUser, loginUser)

//Ruta para obtener los datos de un usuario

/**
 * @swagger
 * /api/user/perfil:
 *   get:
 *     summary: Obtener la información del perfil de usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del perfil obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 66818f557e4ec78117f039ec
 *                 nombre:
 *                   type: string
 *                   example: user
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 edad:
 *                   type: integer
 *                   example: 18
 *                 ciudad:
 *                   type: string
 *                   example: Barcelona
 *                 intereses:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Restaurante", "Cafetería"]
 *                 ofertas:
 *                   type: boolean
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-06-30T17:01:09.238Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-06-30T17:01:09.238Z
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */


router.get('/perfil', auth, auth.isUser, getUserProfile)

//Ruta para actualizar un usuario

/**
 * @swagger
 * /api/user/update:
 *   put:
 *     summary: Modificar algún dato del usuario
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
 *                 example: Bilbao
 *               intereses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Museo", "Restaurante"]
 *               ofertas:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario actualizado con éxito
 *                 contenido:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 66818f557e4ec78117f039ec
 *                     nombre:
 *                       type: string
 *                       example: user
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     password:
 *                       type: string
 *                       example: $2a$10$Bk34oXbAXw64mSwuNk1HYOi9U.lCzlm9cbDNhvx.DazvQAyuBRsMG
 *                     edad:
 *                       type: integer
 *                       example: 18
 *                     ciudad:
 *                       type: string
 *                       example: Bilbao
 *                     intereses:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Museo", "Restaurante"]
 *                     ofertas:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-06-30T17:01:09.238Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-06-30T17:05:39.733Z
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */


router.put('/update', auth, auth.isUser, validatorUpdateUser, updateUser)

//Ruta para actualizar el correo de un usuario

/**
 * @swagger
 * /api/user/email:
 *   put:
 *     summary: Actualizar Correo Electrónico
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
 *                 example: megaprueba@example.com
 *     responses:
 *       200:
 *         description: Correo electrónico actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Correo electrónico actualizado con éxito
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 66818f557e4ec78117f039ec
 *                     nombre:
 *                       type: string
 *                       example: user
 *                     email:
 *                       type: string
 *                       example: megaprueba@example.com
 *                     password:
 *                       type: string
 *                       example: $2a$10$Bk34oXbAXw64mSwuNk1HYOi9U.lCzlm9cbDNhvx.DazvQAyuBRsMG
 *                     edad:
 *                       type: integer
 *                       example: 18
 *                     ciudad:
 *                       type: string
 *                       example: Bilbao
 *                     intereses:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Museo", "Restaurante"]
 *                     ofertas:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-06-30T17:01:09.238Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-06-30T17:06:35.634Z
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */


router.put('/email',auth, auth.isUser, validatorUpdateEmail, updateEmail)

//Ruta para actualizar la contraseña de un usuario

/**
 * @swagger
 * /api/user/password:
 *   put:
 *     summary: Actualizar la contraseña del usuario
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
 *                 example: passwordSegura
 *               newPassword:
 *                 type: string
 *                 example: nuevaPasswordSegura
 *     responses:
 *       200:
 *         description: Contraseña actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contraseña actualizada con éxito
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */


router.put('/password',auth, auth.isUser, validatorUpdatePassword, updatePassword)

//Ruta para darse de baja como usuario

/**
 * @swagger
 * /api/user/baja:
 *   delete:
 *     summary: Darse de baja como usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cuenta de usuario y reseñas asociadas eliminadas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cuenta de usuario y reseñas asociadas eliminadas con éxito
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */


router.delete('/baja',auth, auth.isUser, deleteUser)

//Ruta para publicar una reseña

/**
 * @swagger
 * /api/user/{contenidoId}/review:
 *   post:
 *     summary: Publicar una reseña
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contenidoId
 *         required: true
 *         description: ID del contenido para el que se publica la reseña
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comentario:
 *                 type: string
 *                 example: Churros Churros churros !!!!!
 *               puntuacion:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       201:
 *         description: Reseña publicada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reseña publicada correctamente
 *                 review:
 *                   type: object
 *                   properties:
 *                     usuarioID:
 *                       type: string
 *                     contenidoID:
 *                       type: string
 *                     comentario:
 *                       type: string
 *                       example: Churros Churros churros !!!!!
 *                     puntuacion:
 *                       type: integer
 *                       example: 4
 *                     _id:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       400:
 *         description: Error en la solicitud
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Contenido no encontrado
 */


router.post('/:contenidoId/review', auth, auth.isUser, validatorPostReview, postReview)

//Ruta para obtener todas las reviews de un usuario

/**
 * @swagger
 * /api/user/reviews:
 *   get:
 *     summary: Listar todas las reviews del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las reviews del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   usuarioID:
 *                     type: string
 *                   contenidoID:
 *                     type: string
 *                   comentario:
 *                     type: string
 *                   puntuacion:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                 example:
 *                   _id: 668191667f3ee170b2834f53
 *                   usuarioID: 668191547f3ee170b2834f4d
 *                   contenidoID: 6666ee72e2cff37338880429
 *                   comentario: Churros Churros churros !!!!!
 *                   puntuacion: 4
 *                   createdAt: 2024-06-30T17:09:58.894Z
 *                   updatedAt: 2024-06-30T17:09:58.894Z
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
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