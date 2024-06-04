/**
 * Definimos y manejamos las rutas CRUD para User
 */
const express = require("express")
const router = express.Router()
const { getContenido, 
        getContenidoByCiudad, 
        getContenidoByActividad, 
        getContenidoByCiudadAndActividad,
        getContenidoByID,
        registerUser,
        loginUser,
        } = require ('../controllers/user')

//--------------------------------------------------------------------------------------------------------------------------
//RUTA PARA USUARIOS PUBLICOS
//--------------------------------------------------------------------------------------------------------------------------

//Ruta para consultar todos los contenidos
router.get('/comercios/contenido', getContenido)

//Ruta para consultar todos los contenido por ciudad
router.get('/comercios/contenido/ciudad', getContenidoByCiudad)

//Ruta para consultar todos los contenido por Actividad
router.get('/comercios/contenido/actividad', getContenidoByActividad)

//Ruta para consultar todos los contenido por ciudad y Actividad
router.get('/comercios/contenido/ciudad/actividad', getContenidoByCiudadAndActividad)

//Ruta para consultar todos los contenidos
router.get('/comercios/contenido/:id', getContenidoByID)

//Ruta para registrar un usuario
router.post('/register', registerUser)

//--------------------------------------------------------------------------------------------------------------------------
//RUTAS PARA USUARIOS REGISTRADOS
//--------------------------------------------------------------------------------------------------------------------------

//Ruta para iniciar sesion un usuario
router.post('/login', loginUser)

module.exports = router;