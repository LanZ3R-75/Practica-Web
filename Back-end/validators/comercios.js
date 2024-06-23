// Importa la función check de express-validator para validar campos de la solicitud y la función validateResults para manejar los resultados de la validación.
const {check, param} = require("express-validator")
const validateResults = require("../utils/handleValidator")

// Validador para crear un contenido nuevo
const validatorCreateContenido = [

    check("ciudad")
        .exists().withMessage("La ciudad es obligatoria")
        .notEmpty().withMessage("La ciudad no puede estar vacia"),

    check("actividad")
        .exists().withMessage("La actividad es obligatoria")
        .notEmpty().withMessage("La actividad no puede estar vacia"),

    check("titulo")
        .exists().withMessage("El titulo es obligatorio")
        .notEmpty().withMessage("El titulo no puede estar vacio"),

    check("resumen")
        .exists().withMessage("La ciudad es obligatoria")
        .notEmpty().withMessage("La ciudad no puede estar vacia"),

    check("text")
        .optional()
        .isArray(),
    
    check("fotos")
        .optional()
        .isArray(),

    (req, res, next) => validateResults(req, res, next)  
]

// Validador para la actualizacion de un contenido
const validatorUpdateContenido = [

    check("ciudad")
        .optional()
        .notEmpty().withMessage("La ciudad no puede estar vacia"),

    check("actividad")
        .optional()
        .notEmpty().withMessage("La actividad no puede estar vacia"),

    check("titulo")
        .optional()
        .notEmpty().withMessage("El titulo no puede estar vacio"),

    check("resumen")
        .optional()
        .notEmpty().withMessage("La ciudad no puede estar vacia"),

    check("text")
        .optional()
        .isArray(),
    
    check("fotos")
        .optional()
        .isArray(),

    (req, res, next) => validateResults(req, res, next)  
]

// Validador para crear un texto
const validatorUploadText = [

    check("text")
        .exists().withMessage("El texto es obligatorio")
        .notEmpty().withMessage("El texto no puede estar vacio"),

    (req, res, next) => validateResults(req, res, next)  
]

// Validador para borrar un texto
const validatorDeleteText = [

    param("textIndex")
        .exists().withMessage("El indice del texto a borrar es obligatorio")
        .isInt({min:0}).withMessage("El indice del texto a borrar tiene que ser un entero"),

    (req, res, next) => validateResults(req, res, next)  
]

// Validador para subir una foto
const validatorUploadFoto = [

    (req, res, next) => {

        if (!req.file){
            return res.status(400).send({message: "No se ha subido ninguna foto"})
        }

        next()
    }
]

// Validador para borrar una foto
const validatorDeleteFoto = [

    param("fotoIndex")
        .exists().withMessage("El indice de la foto a borrar es obligatorio")
        .isInt({min:0}).withMessage("El indice de la foto a borrar tiene que ser un entero"),

    (req, res, next) => validateResults(req, res, next)  
]

module.exports = {validatorCreateContenido, validatorUpdateContenido, validatorUploadText, validatorDeleteText, validatorUploadFoto, validatorDeleteFoto}