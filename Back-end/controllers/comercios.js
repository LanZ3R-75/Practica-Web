/**
 * El controller se encarga de la interaccion entre el usuario, la logica del programa y la respuesra que devuelve
 * al usuario, siguiendo el patron MVC.
 */

//Importamos las utilidades necesarias
const { matchedData } = require("express-validator")
const{comerciosModel} = require("../models")
const{handleHttpError} = require("../utils/handleError")


//Obtener la lista de comercios

const getItems = async (req, res) => {

    try {
        //Muestra todos los comercios que encuentre en la base de datos
        const data = await comerciosModel.find({})
        res.send(data)

    } catch (error) {
        //Muestra el error con el mensaje 'ERROR_GET_ITEMS' y el codigo de error 403
        handleHttpError(res, 'ERROR_GET_ITEMS', 403)
    }
}

//Obtener un unico comercio (usando el CIF)

const getItem = async (req, res) => {

    const{cif} = matchedData(req) //Estrae el CIF del comercio a buscar

    try {

        const item = await comerciosModel.findOne({CIF:cif})

        if (item) {

            res.send(item) //Si encuentra el comercio lo retorna
            
        }else{

            handleHttpError(res,'ERROR_ITEM_NOT_FOUND',404) //Manejo de error para cuando no existe el comercio
        }
        
    } catch (error) {
        
        handleHttpError(res, 'ERROR_GET_ITEM', 500) //Manejo de error para cuando falla la consulta
    }

}

//Crear un comercio

const createItem = async (req, res) => {

    try {

        const body = matchedData(req) //Estraemos los datos de la consulta y comprobamos el cuerpo de la peticion
        const data = await comerciosModel.create(body) // Crea el comercio en la base de datos
        res.send(data) 

    }catch(error){

        handleHttpError(res, "ERROR_CREATE_ITEM", 403) //Manejo de errores en caso de fallar en la peticion
    }
}

//Modificar un comercio a partir de su CIF

const updateItem = async (req, res) => {

    try {

       const{cif, ...body} = matchedData(req) //Extrae el CIF y el resto lo asigna a la constante body

       const data = await comerciosModel.findOneAndUpdate({CIF:cif}, body)
       res.send(data)

    }catch (error) {

        handleHttpError(res, "ERROR_UPDATE_ITEM", 403) // Manejo de errores en caso de falla al actualizar el registro
        
    }
}

//Borrado de un comercios (permite elegir de forma lógica o física)

const deleteItem = async (req, res) => {

    try {
        
        const{cif} = matchedData(req) // Extrae el CIF del comercio a eliminar
        const deleteMode = req.query.deleteMode //Determina el modo de eliminación a travaes de una query

        if(deleteMode === 'soft'){ // Borrado lógico: marca el comercio como eliminado sin removerlo de la base de datos

            const data = await comerciosModel.delete({CIF:cif})
            res.send({ message: 'Comercio eliminado lógicamente' });

        }else if(deleteMode === 'hard'){ // Borrado físico: elimina el comercio de la base de datos

            const data = await comerciosModel.deleteOne({CIF:cif})
            res.send({ message: 'Comercio eliminado Fisicamente' });

        }else{ 

            handleHttpError(res, 'INVALID_DELETE_MODE',400) // Maneja el error si el modo de borrado no es válido
        }

    } catch (error) {

        handleHttpError(res,'ERROR_DELETE_ITEM',500)  // Manejo de errores en caso de fallar al borrar el registro
    }
}

module.exports = {getItems, getItem, createItem, updateItem, deleteItem}