const { check } = require("express-validator");
const validateResults = require("../utils/handleValidator");

// Validadores para la creación de un administrador

const validatorCreateAdmin = [

    check("username")
        .exists().withMessage('El nombre de usuario es requerido.')
        .notEmpty().withMessage('El nombre de usuario no puede estar vacío.')
        .isLength({ min: 2, max: 20 }).withMessage('El nombre de usuario debe tener entre 2 y 20 caracteres.'),
    
    check("password")
        .exists().withMessage('La contraseña es requerida.')
        .notEmpty().withMessage('La contraseña no puede estar vacía.')
        .isLength({ min: 6, max: 20 }).withMessage('La contraseña debe tener entre 6 y 20 caracteres.'),

    (req, res, next) => validateResults(req, res, next)
];

// Validadores para el login de un administrador

const validatorLoginAdmin = [

    check("username")
        .exists().withMessage('El nombre de usuario es requerido.')
        .notEmpty().withMessage('El nombre de usuario no puede estar vacío.')
        .isLength({ min: 2, max: 20 }).withMessage('El nombre de usuario debe tener entre 2 y 20 caracteres.'),
    
    check("password")
        .exists().withMessage('La contraseña es requerida.')
        .notEmpty().withMessage('La contraseña no puede estar vacía.')
        .isLength({ min: 6, max: 20 }).withMessage('La contraseña debe tener entre 6 y 20 caracteres.'),

    (req, res, next) => validateResults(req, res, next)
];

// Validadores para la creación de un comercio
const validatorCreateComercio = [

    check("nombre")
        .exists().withMessage('El nombre es requerido.')
        .notEmpty().withMessage('El nombre no puede estar vacío.')
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres.'),

    check("CIF")
        .exists().withMessage('El CIF es requerido.')
        .notEmpty().withMessage('El CIF no puede estar vacío.')
        .isLength({ min: 9, max: 9 }).withMessage('El CIF debe tener 9 caracteres.'),

    check("direccion")
        .exists().withMessage('La dirección es requerida.')
        .notEmpty().withMessage('La dirección no puede estar vacía.')
        .isLength({ min: 5, max: 100 }).withMessage('La dirección debe tener entre 5 y 100 caracteres.'),

    check("email")
        .exists().withMessage('El correo electrónico es requerido.')
        .notEmpty().withMessage('El correo electrónico no puede estar vacío.')
        .isEmail().withMessage('Debe ser un correo electrónico válido.'),

    check("telefono")
        .exists().withMessage('El teléfono es requerido.')
        .notEmpty().withMessage('El teléfono no puede estar vacío.')
        .isLength({ min: 9, max: 9 }).withMessage('El teléfono debe tener 9 caracteres.'),

    (req, res, next) => validateResults(req, res, next)
];

// Validadores para la actualización de un comercio

const validatorUpdateComercio = [

    check("nombre")
        .optional()
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres.'),

    check("CIF")
        .optional()
        .isLength({ min: 9, max: 9 }).withMessage('El CIF debe tener 9 caracteres.'),

    check("direccion")
        .optional()
        .isLength({ min: 5, max: 100 }).withMessage('La dirección debe tener entre 5 y 100 caracteres.'),

    check("email")
        .optional()
        .isEmail().withMessage('Debe ser un correo electrónico válido.'),

    check("telefono")
        .optional()
        .isLength({ min: 9, max: 9 }).withMessage('El teléfono debe tener 9 caracteres.'),

    (req, res, next) => validateResults(req, res, next)
];

// Validadores para la actualización de un usuario
const validatorUpdateUser = [

    check("nombre")
        .optional()
        .isLength({ min: 2, max: 20 }).withMessage('El nombre de usuario debe tener entre 2 y 20 caracteres.'),

    check("email")
        .optional()
        .isEmail().withMessage('Debe ser un correo electrónico válido.'),

    check("ciudad")
        .optional(),

    check("intereses")
        .optional()
        .isArray().withMessage('Los intereses deben ser un arreglo.'),
    
    check("ofertas")
        .optional()
        .isBoolean().withMessage('El permiso para recibir ofertas debe ser true o false.'),

    (req, res, next) => validateResults(req, res, next)
];

// Validadores para la actualización de la contraseña de un usuario
const validatorUpdatePassword = [

    check("newPassword")
        .exists().withMessage('La nueva contraseña es requerida.')
        .notEmpty().withMessage('La nueva contraseña no puede estar vacía.')
        .isLength({ min: 6, max: 20 }).withMessage('La nueva contraseña debe tener entre 6 y 20 caracteres.'),

    (req, res, next) => validateResults(req, res, next)
];

// Validadores para la actualización del correo electrónico de un usuario
const validatorUpdateEmail = [

    check("newEmail")
        .exists().withMessage('El nuevo correo electrónico es requerido.')
        .notEmpty().withMessage('El nuevo correo electrónico no puede estar vacío.')
        .isEmail().withMessage('Debe ser un correo electrónico válido.'),

    (req, res, next) => validateResults(req, res, next)
];

module.exports = {
    validatorCreateAdmin,
    validatorLoginAdmin,
    validatorCreateComercio,
    validatorUpdateComercio,
    validatorUpdateUser,
    validatorUpdatePassword,
    validatorUpdateEmail
};
