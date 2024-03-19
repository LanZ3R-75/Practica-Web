/**
 * Definimos y manejamos las rutas CRUD para comercios
 */

const express = require("express") //Importamos el modulo express para crear un enrutador que maneje las rutas
const router = express.Router()
const{validatorCreateItem, validatorGetItem} = require("../validators/comercios") //Importamos los validadores necesarios

const { getItems ,getItem, createItem, updateItem, deleteItem } = require("../controllers/comercios") //Importamos las funciones controladoras

router.get("/", getItems) // Ruta para obtener todos los comercios. No requiere validadores.
router.get("/:cif", validatorGetItem, getItem) //Ruta para obtener un comercio especifico por el CIF. Valida que el CIF sea correcto
router.post("/", validatorCreateItem, createItem) //Ruta para crear un comercio. Valida que los datos sean correctos y completos
router.put("/:cif",validatorGetItem,validatorCreateItem, updateItem) //Ruta para encontrar un comercio especifico por el CIF y actualizar sus datos. Valida tanto que su CIF sea correcto como que el contenido sea correcto
router.delete("/:cif", validatorGetItem, deleteItem) //Ruta para eliminar un comercio especifico por el CIF. Valida que el CIF seacorrecto

module.exports = router