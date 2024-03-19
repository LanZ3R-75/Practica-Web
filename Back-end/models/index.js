/**
 * Se encarga de centralizar la importacion de modelos de la base de datos.
 */

const models = {

    comerciosModel: require('./nosql/comercios') //Importa y asigna el modelo 'comercio'
}                                                

module.exports = models