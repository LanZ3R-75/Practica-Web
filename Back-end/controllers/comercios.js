const { matchedData } = require("express-validator")
const{comerciosModel} = require("../models")
const{handleHttpError} = require("../utils/handleError")

//Obtener la lista de comercios

const getItems = async (req, res) => {

    try {

        const data = await comerciosModel.find({})
        res.send(data)

    } catch (error) {
        
        handleHttpError(res, 'ERROR_GET_ITEMS', 403)
    }
}

//Obtener un unico comercio (usando el CIF)

const getItem = async (req, res) => {

    const{cif} = matchedData(req)

    try {

        const item = await comerciosModel.findOne({CIF:cif})

        if (item) {

            res.send(item)
            
        }else{

            handleHttpError(res,'ERROR_ITEM_NOT_FOUND',404)
        }
        
    } catch (error) {
        
        handleHttpError(res, 'ERROR_GET_ITEM', 500)
    }

}

//Crear un comercio

const createItem = async (req, res) => {

    try {

        const body = matchedData(req)
        const data = await comerciosModel.create(body)
        res.send(data)

    }catch(error){

        handleHttpError(res, "ERROR_CREATE_ITEM", 403)
    }
}

//Modificar un comercio a partir de su CIF

const updateItem = async (req, res) => {

    try {

       const{cif, ...body} = matchedData(req) //Extrae el CIF y el resto lo asigna a la constante body

       const data = await comerciosModel.findOneAndUpdate({CIF:cif}, body)
       res.send(data)

    }catch (error) {

        handleHttpError(res, "ERROR_UPDATE_ITEM", 403)
        
    }
}

//Borrado de un comercios (permite elegir de forma lógica o física)

const deleteItem = async (req, res) => {

    try {
        
        const{cif} = matchedData(req)
        const deleteMode = req.query.deleteMode

        if(deleteMode === 'soft'){

            const data = await comerciosModel.delete({CIF:cif})
            res.send({ message: 'Comercio eliminado lógicamente' });

        }else if(deleteMode === 'hard'){

            const data = await comerciosModel.deleteOne({CIF:cif})
            res.send({ message: 'Comercio eliminado Fisicamente' });

        }else{

            handleHttpError(res, 'INVALID_DELETE_MODE',400)
        }

    } catch (error) {

        handleHttpError(res,'ERROR_DELETE_ITEM',500)
    }
}

module.exports = {getItems, getItem, createItem, updateItem, deleteItem}