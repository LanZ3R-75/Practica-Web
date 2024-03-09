const{comerciosModel} = require("../models")

//Obtener la lista de comercios

const getItems = (req, res) => {

    const data = ["hola", "mundo", "lista completa"]
    res.send({data}) 
}

//Obtener un unico comercio (usando el CIF)

const getItem = (req, res) => {

    const data = ["hola", "mundo", "item unico"]
    res.send({data}) 
}

//Crear un comercio

const createItem = (req, res) => {

    const data = ["hola", "mundo", "create"]
    res.send({data}) 
}

//Modificar un comercio a partir de su CIF

const updateItem = (req, res) => {

    const data = ["hola", "mundo", "update"]
    res.send({data}) 
}

//Borrado de un comercios (permite elegir de forma lógica o física)

const deleteItem = (req, res) => {

    const data = ["hola", "mundo", "delete"]
    res.send({data}) 
}

module.exports = {getItems, getItem, createItem, updateItem, deleteItem}