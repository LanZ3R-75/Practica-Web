const express = require("express")
const router = express.Router()

const { getItems ,getItem, createItem, updateItem, deleteItem } = require("../controllers/comercios")

router.get("/", getItems)
router.get("/:id", getItem)
router.post("/", createItem)
router.update("/:id", updateItem)
router.delete("/:id", deleteItem)

module.exports = router