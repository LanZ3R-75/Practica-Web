//Importamos moongose
const mongoose = require("mongoose")
// Borrado-suave -> const mongooseDelete = require("mongoose-delete") 

//Modelo de Admin
const AdminScheme = new mongoose.Schema(
    {
        email:{
            type: String,
            unique: true
            
        },

        password:{
            type: String,

        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

// BorradoLogico -> AdminScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("admin",AdminScheme);