//Importamos las caracteristicas necesarias de mongoose para gestionar la base de datos
const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

const { Schema } = mongoose

//Creamos el modelo de la base de datos

const ComerciosScheme = new mongoose.Schema(
    {
        nombre: {

            type: String,
            required: true,
        },

        CIF: {

            type: String,
            required: true,
            unique:true,
        },

        direccion: {

            type: String,
            required: true,

        },

        email: {

            type: String,
            required: true,
            unique:true,
        },

        telefono: {

            type: String,
            required: true,
            unique:true,
        },

        tokenJWT:{

            type: String,
            unique:true,
            required:true,
            

        },

        paginaID:{

            type: Schema.Types.ObjectId,
            ref:"contenido",
            unique: true,
            
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

ComerciosScheme.plugin(mongooseDelete, {overrideMethods: "all"}) //Este plugin nos permite establecer tanto borrado logico/como borrado físico
module.exports = mongoose.model("comercios",ComerciosScheme) //"comercio" es el nombre de la coleccion/tabla en mongoDB