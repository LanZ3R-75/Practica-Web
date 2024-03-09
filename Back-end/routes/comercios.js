const express = require("express")
const router = express.Router()

const { getItems ,getItem, createItem, updateItem, deleteItem } = require("../controllers/comercios")

router.get("/", getItems)
router.get("/:cif", getItem)
router.post("/", createItem)
router.put("/:cif", updateItem)
router.delete("/:cif", deleteItem)

module.exports = router