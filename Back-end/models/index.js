/**
 * Se encarga de centralizar la importacion de modelos de la base de datos.
 */

const models = {

    comerciosModel: require('./nosql/comercios'), //Importa y asigna el modelo 'comercio'
    userModel: require('./nosql/user'),
    adminModel: require('./nosql/admin'),
    contenidoModel: require('./nosql/contenido'),
    reviewModel: require('./nosql/review')

}                                                

module.exports = models