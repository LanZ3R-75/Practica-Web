//Importamos mongoose
const mongoose = require("mongoose")
const { Schema } = mongoose

//Modelo Pagina Web

const WebpageScheme = new mongoose.Schema(
    {
        //Identificador del comercio asociado

        comercio:{
            type: Schema.Types.ObjectId,
            ref:"comercios"

        },
        

        //Datos que puedes ser Actualizados por el comercio

        ciudad:{
            type: String

        },

        actividad:{
            type: String

        },

        titulo:{
            type: String

        },

        resumen:{
            type: String

        },

        text:{
            type: [String]

        },

        fotos:{
            type: [String]

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

module.exports = mongoose.model("webpage",WebpageScheme)