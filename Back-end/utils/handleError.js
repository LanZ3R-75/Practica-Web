/**
 * Función para manejar errores HTTP enviando una respuesta personalizada al cliente.
 * 
 * @param {Object} res - Objeto de respuesta de Express para enviar la respuesta al cliente.
 * @param {String} message - Mensaje de error personalizado para enviar al cliente.
 * @param {Number} code - Código de estado HTTP para la respuesta, indica el tipo de error.
 */

const handleHttpError = (res, message, code) => {
    
    res.status(code).send(message) // Establece el código de estado HTTP de la respuesta y envía el mensaje de error.
}

module.exports = {handleHttpError}