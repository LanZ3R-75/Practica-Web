//Importamos mongoose
const mongoose = require("mongoose")
const { Schema } = mongoose

//Modelo Pagina Web

const ContenidoScheme = new mongoose.Schema(
    {
        //Datos que puedes ser Actualizados por el comercio

        ciudad:{
            type: String,
            

        },

        actividad:{
            type: String,
            

        },

        titulo:{
            type: String,
            

        },

        resumen:{
            type: String,
            

        },

        text:{
            type: [String],
            

        },

        fotos:{
            type: [String],
            

        },

        //Datos no modificables por el comercio

        scoring:{
            type: Number,
            default: 0

        },

        numScoring:{
            type: Number,
            default: 0

        },

        reviews:{

            type: [Schema.Types.ObjectId],
            ref: 'reviews',

        },

       
    },
    {
        timestamps: true,
        versionKey: false
    }
    
)

module.exports = mongoose.model("contenido",ContenidoScheme)