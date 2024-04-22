// Este archivo automáticamente registra rutas de Express basadas en los nombres de archivos en el directorio actual, excluyendo 'index'.

const express = require("express")
const fs =  require("fs")
const router = express.Router()

const removeExtension = (fileName) => {  //Funcion para eliminar la extension del nombre de un archivo

    //Retorna solo la primera parte del split (lo de antes del punto)
    return fileName.split('.').shift()
}

// Lee de forma sincrónica el directorio actual y registra archivos como rutas, excluyendo el archivo 'index'.
fs.readdirSync(__dirname).filter((file) =>{

    const name = removeExtension(file) // Obtiene el nombre del archivo sin extensión.

    if(name !== 'index'){ // Ignora el archivo 'index' para evitar bucles de importación.
        router.use('/'+name, require('./'+name)) // http:localhost:3000/api/comercios
    }
})

module.exports = router