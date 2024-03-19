// Importa la función validationResult de express-validator para verificar los resultados de la validación.

const {validationResult} = require("express-validator")


/**
 * Middleware para validar los resultados de las solicitudes en Express.
 * Utiliza express-validator para revisar si hubo errores en la validación de la solicitud.
 *
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Callback para pasar al siguiente middleware en la cadena.
 */

const validateResults = (req, res, next) => {

    try {
        //lanzamos una excepción si se encuentran errores de validación en la solicitud.
        validationResult(req).throw()

        // Si no hay errores, continúa con el siguiente middleware
        return next()
        
    } catch (err) {

         // En caso de errores de validación, responde con el estado 403 (Forbidden) y los errores específicos.
        res.status(403)
        res.send({errors: err.array()})
    }

}

module.exports = validateResults