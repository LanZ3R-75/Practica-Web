/**
 * Definimos y manejamos las rutas CRUD para Admin
 */
const express = require("express")
const router = express.Router()
const auth = require('../utils/auth')
const {postRegisterAdmin, loginAdmin, postComercio, getComercios, putComercio, getComercio, deleteComercio} = require('../controllers/admin')

//Ruta para registar un administrador
router.post('/register',postRegisterAdmin)

//Ruta para loguear un administrador
router.post('/login',loginAdmin)

//Ruta para registrar un nuevo comercio
router.post('/comercios', auth, auth.isAdmin, postComercio)

//Ruta para modificar un comercio
router.put('/comercios/:id',auth, auth.isAdmin, putComercio)

//Ruta para obtener todos los comercios
router.get('/comercios',auth, auth.isAdmin, getComercios)

//Ruta para obtener un comercio en especifico 
router.get('/comercios/:id',auth, auth.isAdmin, getComercio)

//Ruta para asignar borrar un comercio
router.delete('/comercios/:id',auth, auth.isAdmin, deleteComercio)

module.exports = router

