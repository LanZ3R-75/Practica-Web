//Importamos mongoose
const mongoose = require("mongoose")
const { Schema } = mongoose

//Modelo de Reviews

const reviewScheme = new mongoose.Schema({

    usuarioID: {

        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true,
    },

    contenidoID:{

        type: Schema.Types.ObjectId,
        ref:'contenido',
        require: true,
    },

    comentario:{

        type: String,
        require: true,
    },

    puntuacion:{

        type: Number,
        require: true,
        min: 0,
        max: 5,
    }

},
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("review", reviewScheme)

