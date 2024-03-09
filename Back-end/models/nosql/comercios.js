const mongoose = require("mongoose")

//Creamos el modelo de la base de datos

const ComerciosScheme = new mongoose.Schema(
    {
        name: {
            type: String
        },

        CIF: {
            type: String,
            unique:true
        },

        direccion: {
            type: String

        },

        email: {
            type: String,
            unique:true
        },

        telefono: {
            type: String
        },

        id_pagina: {
            type: Number
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model("comercios",ComerciosScheme) //"comercio" es el nombre de la coleccion/tabla en mongoDB