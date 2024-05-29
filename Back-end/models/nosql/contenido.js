//Importamos mongoose
const mongoose = require("mongoose")
const { Schema } = mongoose

//Modelo Pagina Web

const ContenidoScheme = new mongoose.Schema(
    {
        //Identificador del comercio asociado

        comercioID:{
            type: Schema.Types.ObjectId,
            ref:"comercios",
            require:true,

        },
        

        //Datos que puedes ser Actualizados por el comercio

        ciudad:{
            type: String,
            require:true,

        },

        actividad:{
            type: String,
            require:true,

        },

        titulo:{
            type: String,
            require:true,

        },

        resumen:{
            type: String,
            require:true,

        },

        text:{
            type: [String],
            require:true,

        },

        fotos:{
            type: [String],
            require:true,

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

        reviews:[

            {
                user:{
                    type: Schema.Types.ObjectId,
                    ref: "user"

                },

                text:{
                    type: String

                },

                rating:{
                    type: Number

                },

                creacion:{
                    type: Date,
                    default: Date.now

                }
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false
    }
    
)

module.exports = mongoose.model("contenido",ContenidoScheme)