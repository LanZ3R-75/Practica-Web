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
router.post('/register', validatorRegisterUser, registerUser)

//Ruta pa obtener los nombres de usuario y la review asociada a un contenido
router.get('/comercios/contenido/reviews/:id', getReviewsByContenido);

//--------------------------------------------------------------------------------------------------------------------------
//RUTAS PARA USUARIOS REGISTRADOS
//--------------------------------------------------------------------------------------------------------------------------

//Ruta para iniciar sesion un usuario
router.post('/login', validatorLoginUser, loginUser)

//Ruta para actualizar un usuario
router.post('/', auth, auth.isUser, validatorUpdateUser, updateUser)

//Ruta para actualizar el correo de un usuario
router.put('/email',auth, auth.isUser, validatorUpdateEmail, updateEmail)

//Ruta para actualizar la contraseña de un usuario
router.put('/password',auth, auth.isUser, validatorUpdatePassword, updatePassword)

//Ruta para darse de baja como usuario
router.delete('/baja',auth, auth.isUser, deleteUser)

//Ruta para publicar una reseña
router.post('/:contenidoId/review', auth, auth.isUser, validatorPostReview, postReview)

//Ruta para obtener todas las reviews de un usuario
router.get('/reviews', auth, auth.isUser, getUserReview)


//--------------------------------------------------------------------------------------------------------------------------
//                                      Prueba de SLACK
//--------------------------------------------------------------------------------------------------------------------------

router.get('/testSlack', pruebaSlack)


module.exports = router;