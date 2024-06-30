/**
 * Definimos y manejamos las rutas CRUD para Admin
 */
const express = require("express")
const router = express.Router()
const auth = require('../utils/auth')
const { postRegisterAdmin,
        loginAdmin, 
        postComercio, 
        getComercios, 
        putComercio, 
        getComercio, 
        deleteComercio,
        getAllUsers,
        getUser,
        updateUser,
        updateUserPassword,
        updateUserEmail,
        deleteUser
    } = require('../controllers/admin')

const {
        validatorCreateAdmin,
        validatorLoginAdmin,
        validatorCreateComercio,
        validatorUpdateComercio,
        validatorUpdateUser,
        validatorUpdatePassword,
        validatorUpdateEmail
    } = require('../validators/admin')

//--------------------------------------------------------------------------------------------------------------------------
//                                  RUTAS DE ADMINISTRADOR
//--------------------------------------------------------------------------------------------------------------------------

//Ruta para registar un administrador

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Registra un nuevo administrador
 *     tags: [Administradores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin123
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Administrador registrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mesage:
 *                   type: string
 *                   example: Administrador registrado con exito
 *       400:
 *         description: Administrador ya existente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Adminstrador ya existente
 */


router.post('/register',validatorCreateAdmin, postRegisterAdmin)

//Ruta para loguear un administrador

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Iniciar sesión como administrador
 *     tags: [Administradores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin1
 *               password:
 *                 type: string
 *                 example: admin1
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
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODEzYzlmMWNjZDNhZDk2OTdjMTU2NiIsImlhdCI6MTcxOTc0NTg4MiwiZXhwIjoxNzE5ODMyMjgyfQ.yuWK99kFLlmZg9mZGSsnEmHpLbaQmqvS4vWfgX1dgkg
 *       400:
 *         description: Credenciales no válidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Credenciales no válidas
 *       404:
 *         description: Administrador no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Administrador no encontrado
 */


router.post('/login',validatorLoginAdmin, loginAdmin)


//--------------------------------------------------------------------------------------------------------------------------
//                                  RUTAS DE COMERCIOS
//--------------------------------------------------------------------------------------------------------------------------

//Ruta para registrar un nuevo comercio

/**
 * @swagger
 * /api/admin/comercios:
 *   post:
 *     summary: Crear un nuevo comercio
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Comercio Prueba Admin
 *               CIF:
 *                 type: string
 *                 example: CIF0007AD
 *               direccion:
 *                 type: string
 *                 example: Calle P
 *               email:
 *                 type: string
 *                 example: pruebaadminD@example.com
 *               telefono:
 *                 type: string
 *                 example: 667788776
 *     responses:
 *       201:
 *         description: Comercio registrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comercio registrado con éxito
 *                 comercio:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       example: Comercio Prueba Admin
 *                     CIF:
 *                       type: string
 *                       example: CIF0007AD
 *                     direccion:
 *                       type: string
 *                       example: Calle P
 *                     email:
 *                       type: string
 *                       example: pruebaadminD@example.com
 *                     telefono:
 *                       type: string
 *                       example: 667788776
 *                     paginaID:
 *                       type: string
 *                       example: 66813e0442450cbfd1a43f55
 *                     _id:
 *                       type: string
 *                       example: 66813e0442450cbfd1a43f57
 *                     deleted:
 *                       type: boolean
 *                       example: false
 *                     tokenJWT:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODEzZTA0NDI0NTBjYmZkMWE0M2Y1NyIsImlhdCI6MTcxOTc0NjA1Mn0.cLptkKzmm-z5knnvC20wFkaelZe9MalHwO8krXiZy6A
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-06-30T11:14:12.777Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-06-30T11:14:12.777Z
 *       400:
 *         description: Comercio ya existente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comercio ya existe
 */

router.post('/comercios', auth, auth.isAdmin, validatorCreateComercio, postComercio)

//Ruta para modificar un comercio

/**
 * @swagger
 * /api/admin/comercios/{id}:
 *   put:
 *     summary: Actualizar un comercio existente
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comercio a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Super Comercio 1111111111
 *               direccion:
 *                 type: string
 *                 example: Calle Verdadera 456
 *     responses:
 *       200:
 *         description: Comercio actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comercio actualizado
 *                 comercio:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 66813e0442450cbfd1a43f57
 *                     nombre:
 *                       type: string
 *                       example: Super Comercio 1111111111
 *                     CIF:
 *                       type: string
 *                       example: CIF0007AD
 *                     direccion:
 *                       type: string
 *                       example: Calle Verdadera 456
 *                     email:
 *                       type: string
 *                       example: pruebaadminD@example.com
 *                     telefono:
 *                       type: string
 *                       example: 667788776
 *                     paginaID:
 *                       type: string
 *                       example: 66813e0442450cbfd1a43f55
 *                     deleted:
 *                       type: boolean
 *                       example: false
 *                     tokenJWT:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODEzZTA0NDI0NTBjYmZkMWE0M2Y1NyIsImlhdCI6MTcxOTc0NjA1Mn0.cLptkKzmm-z5knnvC20wFkaelZe9MalHwO8krXiZy6A
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-06-30T11:14:12.777Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-06-30T15:54:31.219Z
 *       400:
 *         description: Datos inválidos o comercio no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comercio no encontrado
 */


router.put('/comercios/:id',auth, auth.isAdmin, validatorUpdateComercio, putComercio)

//Ruta para obtener todos los comercios
/**
 * @swagger
 * /api/admin/comercios:
 *   get:
 *     summary: Consultar todos los comercios
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los comercios
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
 *                     type: string
 *                     example: 66604205b9bc68d084386be7
 *                   deleted:
 *                     type: boolean
 *                     example: false
 *                   tokenJWT:
 *                     type: string
 *                     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjA0MjA1YjliYzY4ZDA4NDM4NmJlOSIsImlhdCI6MTcxNzU4NDM4OX0.ap1x81XAMvLws6b5Z4zU_W6e3SFwE1zMoD597th5nes
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-06-05T10:46:29.067Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-06-25T02:22:22.586Z
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No autorizado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */


router.get('/comercios',auth, auth.isAdmin, getComercios)

//Ruta para obtener un comercio en especifico 

/**
 * @swagger
 * /api/admin/comercios/{id}:
 *   get:
 *     summary: Consultar comercio por ID
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6666e82d3a61f396bd4a1994
 *         description: ID del comercio a consultar
 *     responses:
 *       200:
 *         description: Detalles del comercio consultado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 66813e0442450cbfd1a43f57
 *                 nombre:
 *                   type: string
 *                   example: Super Comercio 1111111111
 *                 CIF:
 *                   type: string
 *                   example: CIF0007AD
 *                 direccion:
 *                   type: string
 *                   example: Calle Verdadera 456
 *                 email:
 *                   type: string
 *                   example: pruebaadminD@example.com
 *                 telefono:
 *                   type: string
 *                   example: 667788776
 *                 paginaID:
 *                   type: string
 *                   example: 66813e0442450cbfd1a43f55
 *                 deleted:
 *                   type: boolean
 *                   example: false
 *                 tokenJWT:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODEzZTA0NDI0NTBjYmZkMWE0M2Y1NyIsImlhdCI6MTcxOTc0NjA1Mn0.cLptkKzmm-z5knnvC20wFkaelZe9MalHwO8krXiZy6A
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-06-30T11:14:12.777Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-06-30T15:54:31.219Z
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No autorizado
 *       404:
 *         description: Comercio no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comercio no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */

router.get('/comercios/:id',auth, auth.isAdmin, getComercio)

//Ruta para asignar borrar un comercio

/**
 * @swagger
 * /api/admin/comercios/{id}:
 *   delete:
 *     summary: Borrar Comercio
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 66813e0442450cbfd1a43f57
 *         description: ID del comercio a borrar
 *     responses:
 *       200:
 *         description: Comercio y contenido eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comercio y contenido eliminado correctamente
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No autorizado
 *       404:
 *         description: Comercio no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comercio no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */


router.delete('/comercios/:id',auth, auth.isAdmin, deleteComercio)

//--------------------------------------------------------------------------------------------------------------------------
//                                  RUTAS DE USUARIOS REGISTRADOS
//--------------------------------------------------------------------------------------------------------------------------

//Ruta para obtener todos los usuarios

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Obtener todos los usuarios registrados
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios registrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 665fbef2560e494814e15cf8
 *                   nombre:
 *                     type: string
 *                     example: Daniel
 *                   email:
 *                     type: string
 *                     example: daniel12345@example.com
 *                   password:
 *                     type: string
 *                     example: $2a$10$P/a.CZVuGjBhleHz1D9eoeuXZnUwrpkL0TCubzosbSCZ5phhb.23i
 *                   edad:
 *                     type: integer
 *                     example: 21
 *                   ciudad:
 *                     type: string
 *                     example: Madrid
 *                   intereses:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Restaurante", "Cafetería"]
 *                   ofertas:
 *                     type: boolean
 *                     example: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-06-05T01:27:14.856Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-06-29T10:57:41.224Z
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No autorizado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor
 */


router.get('/users', auth, auth.isAdmin, getAllUsers)

//Ruta para obtener un usuario especifico

/**
 * @swagger
 * /api/admin/user/{id}:
 *   get:
 *     summary: Obtener un usuario registrado en específico
 *     tags: [Administradores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 665fbef2560e494814e15cf8
 *                 nombre:
 *                   type: string
 *                   example: Daniel
 *                 email:
 *                   type: string
 *                   example: daniel12345@example.com
 *                 password:
 *                   type: string
 *                   example: $2a$10$P/a.CZVuGjBhleHz1D9eoeuXZnUwrpkL0TCubzosbSCZ5phhb.23i
 *                 edad:
 *                   type: integer
 *                   example: 21
 *                 ciudad:
 *                   type: string
 *                   example: Madrid
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
 *                   example: 2024-06-05T01:27:14.856Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-06-29T10:57:41.224Z
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 *      
 */


router.get('/user/:id', auth, auth.isAdmin, getUser )

//Ruta para actualizar un usuario

/**
 * @swagger
 * /api/admin/user/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: nuevoNombre
 *               email:
 *                 type: string
 *                 example: nuevoEmail@gmail.com
 *               ciudad:
 *                 type: string
 *                 example: Madrid
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario actualizado correctamente
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 665fbef2560e494814e15cf8
 *                     nombre:
 *                       type: string
 *                       example: nuevoNombre
 *                     email:
 *                       type: string
 *                       example: nuevoEmail@gmail.com
 *                     password:
 *                       type: string
 *                       example: $2a$10$P/a.CZVuGjBhleHz1D9eoeuXZnUwrpkL0TCubzosbSCZ5phhb.23i
 *                     edad:
 *                       type: integer
 *                       example: 21
 *                     ciudad:
 *                       type: string
 *                       example: Madrid
 *                     intereses:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [Restaurante, Cafetería]
 *                     ofertas:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       example: 2024-06-05T01:27:14.856Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2024-06-30T16:23:19.988Z
 *       400:
 *         description: Datos inválidos o correo electrónico ya en uso
 *       404:
 *         description: Usuario no encontrado
 */



router.put('/user/:id', auth, auth.isAdmin, validatorUpdateUser, updateUser)

//Ruta para actualizar la contraseña de un usuario

/**
 * @swagger
 * /api/admin/user/{id}/password:
 *   put:
 *     summary: Actualiza la contraseña de un usuario existente
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario cuya contraseña se actualizará
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: P@ssw0rd
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
 *         description: Datos inválidos o contraseña no cumple con los requisitos
 *       404:
 *         description: Usuario no encontrado
 */


router.put('/user/:id/password', auth, auth.isAdmin, validatorUpdatePassword, updateUserPassword)

//Ruta para actualizar el email de un usuario

/**
 * @swagger
 * /api/admin/user/{id}/email:
 *   put:
 *     summary: Actualiza el correo electrónico de un usuario existente
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario cuyo correo electrónico se actualizará
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newEmail:
 *                 type: string
 *                 example: nueviiiiiiiiiiiisimoEmail@gmail.com
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
 *                   example: Correo electrónico actualizado correctamente
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 665fbef2560e494814e15cf8
 *                     nombre:
 *                       type: string
 *                       example: Daniel
 *                     email:
 *                       type: string
 *                       example: nueviiiiiiiiiiiisimoEmail@gmail.com
 *                     password:
 *                       type: string
 *                       example: $2a$10$hSJXN8U8sCtNr7YcvOFHieBP4YedS6PRwQuSu76AkSxibCJcMBnhC
 *                     edad:
 *                       type: integer
 *                       example: 21
 *                     ciudad:
 *                       type: string
 *                       example: Madrid
 *                     intereses:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [Restaurante, Cafetería]
 *                     ofertas:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       example: 2024-06-05T01:27:14.856Z
 *                     updatedAt:
 *                       type: string
 *                       example: 2024-06-30T16:27:34.467Z
 *       400:
 *         description: Correo electrónico ya está en uso
 *       404:
 *         description: Usuario no encontrado
 */


router.put('/user/:id/email', auth, auth.isAdmin,validatorUpdateEmail, updateUserEmail)

//Ruta para eliminar un usuario

/**
 * @swagger
 * /api/admin/user/{id}:
 *   delete:
 *     summary: Elimina un usuario registrado específico junto con sus reseñas asociadas
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
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
 *       404:
 *         description: Usuario no encontrado
 */


router.delete('/user/:id', auth, auth.isAdmin, deleteUser)

module.exports = router

