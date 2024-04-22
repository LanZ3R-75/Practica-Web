//Importamos Mongoose
const moongose = require("mongoose")
const MongooseDelete = require("mongoose-delete")
//Borrado logico -> const mongooseDelete = require("mongoose-delete") 

//Modelo User

const UserScheme = new moongose.Schema(
    {
        nombre:{
            type: String

        },

        email:{
            type: String,
            unique: true

        },

        password:{
            type: String,
            
        },

        edad:{
            type: Number

        },

        ciudad:{
            type: String

        },

        intereses:{
            type: [String]

        },

        ofertas:{
            type: Boolean
        }
    },
    {
        timestamps: true,
        versionKey: false
    }

)

//Borrado Logico ->UserScheme.plugin(MongooseDelete, {overrideMethods: "all"})
module.exports = moongose.model("user",UserScheme)