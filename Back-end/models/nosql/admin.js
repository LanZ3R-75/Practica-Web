//Importamos moongose
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
// Borrado-suave -> const mongooseDelete = require("mongoose-delete") 

//Modelo de Admin
const AdminScheme = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            
        },

        password:{
            type: String,
            required: true,

        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

//Metodo para aplicar salt a la contraseña

AdminScheme.pre('save', async function(next){

    if(!this.isModified('password')){
        return next();
    }

    try{

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
        next()

    }catch(err){

        next(err)
        console.log("Error al aplicar el salt")
    }

});

//metodo que compara la contraseña introducida con la "hasheada"

AdminScheme.methods.comparePassword = function (candidatePassword){
    return bcrypt.compare(candidatePassword, this.password)
};


// BorradoLogico -> AdminScheme.plugin(mongooseDelete, {overrideMethods: "all"})
module.exports = mongoose.model("admin",AdminScheme);