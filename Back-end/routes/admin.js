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
router.post('/register',validatorCreateAdmin, postRegisterAdmin)

//Ruta para loguear un administrador
router.post('/login',validatorLoginAdmin, loginAdmin)


//--------------------------------------------------------------------------------------------------------------------------
//                                  RUTAS DE COMERCIOS
//--------------------------------------------------------------------------------------------------------------------------

//Ruta para registrar un nuevo comercio
router.post('/comercios', auth, auth.isAdmin, validatorCreateComercio, postComercio)

//Ruta para modificar un comercio
router.put('/comercios/:id',auth, auth.isAdmin, validatorUpdateComercio, putComercio)

//Ruta para obtener todos los comercios
router.get('/comercios',auth, auth.isAdmin, getComercios)

//Ruta para obtener un comercio en especifico 
router.get('/comercios/:id',auth, auth.isAdmin, getComercio)

//Ruta para asignar borrar un comercio
router.delete('/comercios/:id',auth, auth.isAdmin, deleteComercio)

//--------------------------------------------------------------------------------------------------------------------------
//                                  RUTAS DE USUARIOS REGISTRADOS
//--------------------------------------------------------------------------------------------------------------------------

//Ruta para obtener todos los usuarios
router.get('/users', auth, auth.isAdmin, getAllUsers)

//Ruta para obtener un usuario especifico
router.get('/user/:id', auth, auth.isAdmin, getUser )

//Ruta para actualizar un usuario
router.put('/user/:id', auth, auth.isAdmin, validatorUpdateUser, updateUser)

//Ruta para actualizar la contraseña de un usuario
router.put('/user/:id/password', auth, auth.isAdmin, validatorUpdatePassword, updateUserPassword)

//Ruta para actualizar el email de un usuario
router.put('/user/:id/email', auth, auth.isAdmin,validatorUpdateEmail, updateUserEmail)

//Ruta para eliminar un usuario
router.delete('/user/:id', auth, auth.isAdmin, deleteUser)

module.exports = router

