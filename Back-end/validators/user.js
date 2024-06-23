const { check, param } = require("express-validator")
const validateResults = require("../utils/handleValidator")

// Validador para el registro de un usuario
const validatorRegisterUser = [

    check("nombre")
        .exists().withMessage("El nombre es obligatorio")
        .notEmpty().withMessage("El nombre no puede estar vacio"),
    
    check("email")
        .exists().withMessage("El nombre es obligatorio")
        .notEmpty().withMessage("El nombre no puede estar vacio")
        .isEmail().withMessage("El correo electronico debe de ser valido"),
    
    check("password")
        .exists().withMessage("La contraseña es obligatoria")
        .notEmpty().withMessage("La contraseña no puede estar vacia"),
    
    check("edad")
        .exists().withMessage("La edad es obligatoria")
        .notEmpty().withMessage("La edad no puede estar vacia")
        .isInt({min:18}).withMessage("Has de ser mayor de edad para registrarse"),
    
    check("ciudad")
        .exists().withMessage("La ciudad es obligatoria")
        .notEmpty().withMessage("La ciudad no puede estar vacia"),
    
    check("intereses")
        .exists().withMessage("Los intereses son obligatorios")
        .isArray().withMessage("Los intereses deben de ser un array"),

    check("ofertas")
        .exists().withMessage("El campo de ofertas es obligatorio")
        .isBoolean().withMessage("El campo de ofertas debe de ser un valor booleano"),
    
    (req, res, next)=> validateResults(req, res, next)
]

// Validador para el inicio de sesion
const validatorLoginUser = [

    check("email")
        .exists().withMessage("El nombre es obligatorio")
        .notEmpty().withMessage("El nombre no puede estar vacio")
        .isEmail().withMessage("El correo electronico debe de ser valido"),

    check("password")
        .exists().withMessage("La contraseña es obligatoria")
        .notEmpty().withMessage("La contraseña no puede estar vacia"),
    
    (req, res, next)=> validateResults(req, res, next)
]

// Validador para actualizar los datos del usuario
const validatorUpdateUser = [

    check("ciudad")
        .optional()
        .notEmpty().withMessage("La ciudad no puede estar vacia"),

    check("intereses")
        .optional()
        .isArray().withMessage("Los intereses deben de ser un array"),
    
    check("ofertas")
        .optional()
        .isBoolean().withMessage("El campo de ofertas debe de ser un valor booleano"),

    (req, res, next)=> validateResults(req, res, next)
]

// Validador para actualizar el correo electronico de un usuario
const validatorUpdateEmail = [

    check("email")
    .exists().withMessage("El nombre es obligatorio")
    .notEmpty().withMessage("El nombre no puede estar vacio")
    .isEmail().withMessage("El correo electronico debe de ser valido"),

    (req, res, next)=> validateResults(req, res, next)
]

// validador para actualizar la contraseña de un usuario
const validatorUpdatePassword = [

    check("oldPassword")
        .exists().withMessage("La contraseña antigua es obligatoria")
        .notEmpty().withMessage("La contraseña antigua no puede estar vacia"),
    
    check("newPassword")
        .exists().withMessage("La contraseña nueva es obligatoria")
        .notEmpty().withMessage("La contraseña nueva no puede estar vacia"),


    (req, res, next)=> validateResults(req, res, next)
]

// validador para publicar una reseña
const validatorPostReview = [

    check("comentario")
        .exists().withMessage("El comentario es obligatorio")
        .notEmpty().withMessage("El comentario no puede estar vacio"),
    
    check("puntuacion")
        .exists().withMessage("La puntuacion es obligatoria")
        .isInt({ min:1, max:5 }).withMessage("La puntuacion a de ser un numero entero entre 1 y 5"),
    
    param("contenidoId")
        .exists().withMessage("El ID del contenido es obligatorio")
        .isMongoId().withMessage("El ID del contenido debe de ser valido"),
    
    
    (req, res, next)=> validateResults(req, res, next)
]


module.exports = {
        validatorRegisterUser,
        validatorLoginUser,
        validatorUpdateUser,
        validatorUpdateEmail,
        validatorUpdatePassword,
        validatorPostReview,
}