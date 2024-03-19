// Importa la función check de express-validator para validar campos de la solicitud y la función validateResults para manejar los resultados de la validación.
const {check} = require("express-validator")
const validateResults = require("../utils/handleValidator")

// Define un arreglo de validaciones para la creación de un ítem.
const validatorCreateItem = [

    check("nombre").exists().notEmpty().isLength({min:2, max:20}), // Verifica que el campo 'nombre' exista, no esté vacío, y tenga una longitud entre 2 y 20 caracteres.
    check("CIF").exists().notEmpty(), // Verifica que el campo 'CIF' exista y no esté vacío.
    check("direccion").exists().notEmpty().isLength({min:5, max:50}),  // Verifica que el campo 'direccion' exista, no esté vacío, y tenga una longitud entre 5 y 50 caracteres.
    check("email").exists().notEmpty().isEmail(),  // Verifica que el campo 'email' exista, no esté vacío, y sea un correo electrónico válido.
    check("telefono").exists().notEmpty().isLength({ min: 9, max: 9 }), // Verifica que el campo 'telefono' exista, no esté vacío, y tenga exactamente 9 caracteres.
    check("id_pagina").exists().notEmpty().isNumeric(),// Verifica que el campo 'id_pagina' exista, no esté vacío, y sea numérico

    (req, res, next) => validateResults(req, res, next)  // Middleware personalizado que utiliza validateResults para manejar los errores de validación.
]

// Define un arreglo de validaciones para la comprobar que existe el CIF de un ítem.
const validatorGetItem = [

    check("cif").exists().notEmpty(),  // Verifica que el parámetro 'cif' exista y no esté vacío.

    (req, res, next) => {

        return validateResults(req, res, next) // Utiliza validateResults como middleware para procesar y manejar los resultados de la validación.
    }
]

module.exports = {validatorCreateItem, validatorGetItem}