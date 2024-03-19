/**
 * Esta funcion se encarga de conectar con la base de datos.
 */

const mongoose = require('mongoose')

const dbConnect = () => {

    const db_uri = process.env.DB_URI //Obtenemos la URI de conexion de las variables de entorno.

    mongoose.set('strictQuery', false) //Configuramos la base de datos para que no aplique estrictamente los filtros de consultas.

    try{ //tratamos de conectarnos y en caso de fallo mostramos un error.
        mongoose.connect(db_uri)

    }catch(error){

        console.log("Error conectando a la BD:", error)
    }

    //Listen events
    mongoose.connection.on("connected", () => console.log("Conectado a la BD"))

}

module.exports = dbConnect