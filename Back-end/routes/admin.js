/**
 * Definimos y manejamos las rutas CRUD para Admin
 */

const express = require("express")
const router = express.Router()

const {postComercio, getComercios, putComercio, getComercio, deleteComercio} = require('../controllers/admin')

//Ruta para registrar un nuevo comercio
router.post('/', postComercio)

//Ruta para modificar un comercio
router.put('/:id', putComercio)

//Ruta para obtener todos los comercios
router.get('/',getComercios)

//Ruta para obtener un comercio en especifico 
router.get('/:id',getComercio)

//Ruta para asignar borrar un comercio
router.delete('/:id',deleteComercio)

module.exports = router

