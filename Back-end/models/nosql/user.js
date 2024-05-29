//Importamos Mongoose
const moongose = require("mongoose")
const MongooseDelete = require("mongoose-delete")
//Borrado logico -> const mongooseDelete = require("mongoose-delete") 

//Modelo User

const UserScheme = new moongose.Schema(
    {
        nombre:{
            type: String,
            require:true,

        },

        email:{
            type: String,
            require:true,
            unique: true,

        },

        password:{
            type: String,
            require:true,
            
        },

        edad:{
            type: Number,

        },

        ciudad:{
            type: String

        },

        intereses:{
            type: [String]

        },

        ofertas:{
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
        versionKey: false
    }

)

//Borrado Logico ->UserScheme.plugin(MongooseDelete, {overrideMethods: "all"})
module.exports = moongose.model("user",UserScheme)