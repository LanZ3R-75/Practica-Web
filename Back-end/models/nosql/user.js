//Importamos Mongoose
const moongose = require("mongoose")
const bcrypt = require('bcryptjs')
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
            require:true,

        },

        ciudad:{
            type: String,
            require:true,

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

//Metodo para aplicar salt a la contraseña

UserScheme.pre('save', async function(next) {

    if(!this.isModified('password')){

        return next()
    }

    try{

        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()

    }catch(err){

        next(err)
        console.log("Error al aplicar el salt")
    }
})

//metodo que compara la contraseña introducida con la "hasheada"

UserScheme.methods.comparePassword = function (candidatePassword){
    return bcrypt.compare(candidatePassword, this.password)
};

//Borrado Logico ->UserScheme.plugin(MongooseDelete, {overrideMethods: "all"})
module.exports = moongose.model("user",UserScheme)