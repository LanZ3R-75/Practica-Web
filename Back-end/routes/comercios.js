const express = require("express")
const router = express.Router()
const{validatorCreateItem, validatorGetItem} = require("../validators/comercios")

const { getItems ,getItem, createItem, updateItem, deleteItem } = require("../controllers/comercios")

router.get("/", getItems)
router.get("/:cif", validatorGetItem, getItem)
router.post("/", validatorCreateItem, createItem)
router.put("/:cif",validatorGetItem,validatorCreateItem, updateItem)
router.delete("/:cif", validatorGetItem, deleteItem)

module.exports = router