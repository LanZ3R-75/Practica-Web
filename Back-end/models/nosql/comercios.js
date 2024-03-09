const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

//Creamos el modelo de la base de datos

const ComerciosScheme = new mongoose.Schema(
    {
        nombre: {
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
            type: String
        },

        telefono: {
            type: String
        },

        id_pagina: {
            type: Number,
            unique:true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

ComerciosScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("comercios",ComerciosScheme) //"comercio" es el nombre de la coleccion/tabla en mongoDB