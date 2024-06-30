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
 * /api/register:
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
 *       400:
 *         description: Administrador ya existente
 */

router.post('/register',validatorCreateAdmin, postRegisterAdmin)

//Ruta para loguear un administrador

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Loguea un administrador
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
 *       200:
 *         description: Administrador logueado con éxito
 *       400:
 *         description: Credenciales no válidas o administrador no encontrado
 */

router.post('/login',validatorLoginAdmin, loginAdmin)


//--------------------------------------------------------------------------------------------------------------------------
//                                  RUTAS DE COMERCIOS
//--------------------------------------------------------------------------------------------------------------------------

//Ruta para registrar un nuevo comercio

/**
 * @swagger
 * /api/comercios:
 *   post:
 *     summary: Registra un nuevo comercio
 *     tags: [Administradores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Comercio XYZ
 *               CIF:
 *                 type: string
 *                 example: B12345678
 *               direccion:
 *                 type: string
 *                 example: Calle Falsa 123
 *               email:
 *                 type: string
 *                 example: comercio@xyz.com
 *               telefono:
 *                 type: string
 *                 example: 987654321
 *                  
 *     responses:
 *       201:
 *         description: Comercio registrado con éxito
 *       400:
 *         description: Comercio ya existe
 */

router.post('/comercios', auth, auth.isAdmin, validatorCreateComercio, postComercio)

//Ruta para modificar un comercio

/**
 * @swagger
 * /api/comercios/{id}:
 *   put:
 *     summary: Modifica un comercio existente
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 60c72b2f5f1b2c001f8e4c2e
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Comercio XYZ
 *               CIF:
 *                 type: string
 *                 example: B12345678
 *               direccion:
 *                 type: string
 *                 example: Calle Falsa 123
 *               email:
 *                 type: string
 *                 example: comercio@xyz.com
 *               telefono:
 *                 type: string
 *                 example: 987654321
 *     responses:
 *       200:
 *         description: Comercio actualizado
 *       404:
 *         description: Comercio no encontrado
 */

router.put('/comercios/:id',auth, auth.isAdmin, validatorUpdateComercio, putComercio)

//Ruta para obtener todos los comercios
/**
 * @swagger
 * /api/comercios:
 *   get:
 *     summary: Obtiene todos los comercios
 *     tags: [Administradores]
 *     responses:
 *       200:
 *         description: Lista de comercios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                   CIF:
 *                     type: string
 *                   direccion:
 *                     type: string
 *                   email:
 *                     type: string
 *                   telefono:
 *                     type: string
 */

router.get('/comercios',auth, auth.isAdmin, getComercios)

//Ruta para obtener un comercio en especifico 

/**
 * @swagger
 * /api/comercios/{id}:
 *   get:
 *     summary: Obtiene un comercio por su ID
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 60c72b2f5f1b2c001f8e4c2e
 *     responses:
 *       200:
 *         description: Comercio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                 CIF:
 *                   type: string
 *                 direccion:
 *                   type: string
 *                 email:
 *                   type: string
 *                 telefono:
 *                   type: string
 *       404:
 *         description: Comercio no encontrado
 */

router.get('/comercios/:id',auth, auth.isAdmin, getComercio)

//Ruta para asignar borrar un comercio

/**
 * @swagger
 * /api/comercios/{id}:
 *   delete:
 *     summary: Elimina un comercio por su ID
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 60c72b2f5f1b2c001f8e4c2e
 *     responses:
 *       200:
 *         description: Comercio y contenido eliminado correctamente
 *       404:
 *         description: Comercio no encontrado
 */

router.delete('/comercios/:id',auth, auth.isAdmin, deleteComercio)

//--------------------------------------------------------------------------------------------------------------------------
//                                  RUTAS DE USUARIOS REGISTRADOS
//--------------------------------------------------------------------------------------------------------------------------

//Ruta para obtener todos los usuarios

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios registrados
 *     tags: [Administradores]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 */

router.get('/users', auth, auth.isAdmin, getAllUsers)

//Ruta para obtener un usuario especifico

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 60c72b2f5f1b2c001f8e4c2e
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 */

router.get('/user/:id', auth, auth.isAdmin, getUser )

//Ruta para actualizar un usuario

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 60c72b2f5f1b2c001f8e4c2e
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 */

router.put('/user/:id', auth, auth.isAdmin, validatorUpdateUser, updateUser)

//Ruta para actualizar la contraseña de un usuario

/**
 * @swagger
 * /api/user/{id}/password:
 *   put:
 *     summary: Actualiza la contraseña de un usuario
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 60c72b2f5f1b2c001f8e4c2e
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Contraseña actualizada con éxito
 *       404:
 *         description: Usuario no encontrado
 */

router.put('/user/:id/password', auth, auth.isAdmin, validatorUpdatePassword, updateUserPassword)

//Ruta para actualizar el email de un usuario

/**
 * @swagger
 * /api/user/{id}/email:
 *   put:
 *     summary: Actualiza el correo electrónico de un usuario
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 60c72b2f5f1b2c001f8e4c2e
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newEmail:
 *                 type: string
 *                 example: nuevoemail@example.com
 *     responses:
 *       200:
 *         description: Correo electrónico actualizado correctamente
 *       400:
 *         description: El correo electrónico ya está en uso
 *       404:
 *         description: Usuario no encontrado
 */

router.put('/user/:id/email', auth, auth.isAdmin,validatorUpdateEmail, updateUserEmail)

//Ruta para eliminar un usuario

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags: [Administradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 60c72b2f5f1b2c001f8e4c2e
 *     responses:
 *       200:
 *         description: Cuenta de usuario y reseñas asociadas eliminadas con éxito
 *       404:
 *         description: Usuario no encontrado
 */

router.delete('/user/:id', auth, auth.isAdmin, deleteUser)

module.exports = router

