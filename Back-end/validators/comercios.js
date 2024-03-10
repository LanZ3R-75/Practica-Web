const {check} = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorCreateItem = [

    check("nombre").exists().notEmpty().isLength({min:2, max:20}),
    check("CIF").exists().notEmpty(),
    check("direccion").exists().notEmpty().isLength({min:5, max:50}),
    check("email").exists().notEmpty().isEmail(),
    check("telefono").exists().notEmpty().isLength({ min: 9, max: 9 }),
    check("id_pagina").exists().notEmpty().isNumeric(),

    (req, res, next) => validateResults(req, res, next)
]

const validatorGetItem = [

    check("cif").exists().notEmpty(),

    (req, res, next) => {

        return validateResults(req, res, next)
    }
]

module.exports = {validatorCreateItem, validatorGetItem}