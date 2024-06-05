const {contenidoModel, userModel, reviewModel} = require('../models')
const jwt = require('jsonwebtoken');
const review = require('../models/nosql/review');

//--------------------------------------------------------------------------------------------------------------------------
//                                         GESTION DE USUARIOS PUBLICOS
//--------------------------------------------------------------------------------------------------------------------------

// Consultar todos los contenidos (ordenados o no por el scoring)

const getContenido = async (req, res, next) => {

    const { ordenar } = req.query;

    try {
      
        // Buscar todos los contenidos
        let contenidos = await contenidoModel.find({});

        // Ordenar los contenidos si se especifica el parámetro de ordenación
        if (ordenar) {
            contenidos.sort((a, b) => ordenar === 'desc' ? b.scoring - a.scoring : a.scoring - b.scoring);
        }
        res.status(200).send(contenidos);

    } catch (error) {

        next(error)
    }
};

// Consultar todos los contenidos de los comercios por ciudad (ordenados o no por scoring)

const getContenidoByCiudad = async (req, res, next) => {

    const { ciudad , ordenar } = req.query

    try {
        
        let contenidos = await contenidoModel.find({ciudad})

        if(contenidos.length === 0){
            return res.status(404).send({message : 'No se ha encontrado ningun contenido para la ciudad'})
        }

        if(ordenar) {

            contenidos.sort((a,b) => ordenar === 'desc' ? b.scoring - a.scoring : a.scoring - b.scoring)
        }

        res.status(200).send(contenidos);

    } catch (error) {
        
        next(error)
    }
}

// Consultar contenido de comercios por actividad (ordenados o no por scoring)

const getContenidoByActividad = async (req, res, next) => {

    const {actividad , ordenar } = req.query

    try {

        let contenidos = await contenidoModel.find({actividad})

        if(contenidos.length === 0){
            return res.status(404).send({message : 'No se ha encontrado ningun contenido para la actividad'})
        }

        if(ordenar){

            contenidos.sort((a,b) => ordenar === 'desc' ? b.scoring - a.scoring : a.scoring - b.scoring)
        }

        res.status(200).send(contenidos);

    } catch (error) {

        next(error)
    }

} 

// Consultar contenido de comercios por ciudad y actividad (ordenados o no por scoring)

const getContenidoByCiudadAndActividad = async (req, res, next) => {

    const { ciudad , actividad , ordenar } = req.query

    try {

        let contenidos = await contenidoModel.find({ciudad, actividad})

        if(contenidos.length === 0){

            return res.status(404).send({message : 'No se ha encontrado ningun contenido para la ciudad y actividad'})
        }

        if(ordenar){

            contenidos.sort((a,b) => ordenar === 'desc' ? b.scoring - a.scoring : a.scoring - b.scoring)
        }

        res.status(200).send(contenidos);
        
    } catch (error) {
        
        next(error)
    }
}

// Consultar contenido de un comercio por ID

const getContenidoByID = async (req, res, next) => {

    const { id } = req.params

    try {

        const contenido = await contenidoModel.findById(id)

        if(!contenido){

            return res.status(404).send({message : 'No se ha encontrado ningun contenido para el ID introducido'})
        }

        res.status(200).send(contenido);

    } catch (error) {

        next(error)
    }
}

// Registrar un usuario

const registerUser = async (req, res, next) => {

    const { nombre, email, password, edad, ciudad, intereses, ofertas } = req.body

    try {

        const existingUser = await userModel.findOne({email})
        if(existingUser) return res.status(400).send({message: 'El usuario ya existe'})

        const newUser = new userModel({
            nombre,
            email,
            edad,
            password,
            ciudad,
            intereses,
            ofertas

        })

        await newUser.save()

        res.status(200).send(newUser);

    } catch (error) {
        
        next(error)
    }

}

//--------------------------------------------------------------------------------------------------------------------------
//                                  GESTION DE USUARIOS REGISTRADOS
//--------------------------------------------------------------------------------------------------------------------------

// Iniciar sesion
const loginUser = async (req, res, next) =>{

    const { email , password } = req.body

    try {

        const user = await userModel.findOne({email})
        if(!user) return res.status(404).send({message : 'Usuario no encontrado'})
        
        const isMatch = await user.comparePassword(password)
        if(!isMatch) return res.status(400).send({message : 'Contraseña incorrecta'})
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        
        res.status(200).send(token);

    } catch (error) {
        
        next(error)
    }
}

// Modificar datos de un usuario
const updateUser = async (req, res, next) => {

    const userId = req.user.id
    const { ciudad, intereses , ofertas } = req.body

    try {

        const usuario = await userModel.findById(userId)
        if(!usuario) return res.status(404).send({message: 'Usuario no encontrado'})

        const updateUsuario = await userModel.findByIdAndUpdate(userId, { ciudad, intereses, ofertas }, { new: true })
        if (!updateUsuario) return res.status(404).send({ message: 'Página web no encontrada' });

        res.status(200).send({ message: 'Usuario actualizado con éxito', contenido: updateUsuario });

    } catch (error) {
        
        next(error)
    }
}


// Actualizar el correo electrónico del usuario
const updateEmail = async (req, res, next) => {

    const userId = req.user.id;
    const { email } = req.body;

    try {

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).send({ message: 'Usuario no encontrado' });

        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(400).send({ message: 'El correo electrónico ya está en uso' });

        user.email = email;
        await user.save();

        res.status(200).send({ message: 'Correo electrónico actualizado con éxito', user });

    } catch (error) {

        next(error)
    }
};


// Actualizar la contraseña de un usuario

const updatePassword = async(req, res, next) => {

    const userId = req.user.id
    const { oldPassword, newPassword } = req.body

    try {

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).send({ message: 'Usuario no encontrado' });

        const existingUser = await user.comparePassword(oldPassword);
        if (!existingUser) return res.status(400).send({ message: 'Contraseña antigua incorrecta' });

        user.password = newPassword
        await user.save()

        res.status(200).send({ message: 'Contraseña actualizado con éxito'});
        
    } catch (error) {
        
        next(error)
    }
}

// Darse de baja como usuario

const deleteUser = async (req, res, next) => {

    const userId = req.user.id

    try {

        const user = await userModel.findByIdAndDelete(userId)
        if(!user) return res.status(404).send({message: 'Usuario no encontrado'})
        
        res.status(200).send({ message: 'Usuario dado de baja correctamente'});
        
    } catch (error) {

        next(error)
    }
}

// Publicar una Reseña

const postReview = async (req, res, next) => {

    const { comentario, puntuacion } = req.body
    const { contenidoId } = req.params
    const { userId } = req.user.id

    try {

        const contenido = await contenidoModel.findById(contenidoId)
        if(!contenido) return res.status(404).send({ message: 'Contenido no encontrado' })

        const newReview = new reviewModel({
            usuarioID: userId,
            contenidoID: contenidoId,
            comentario,
            puntuacion,

        })

        await newReview.save()

        //Actualizamos la puntacion del contenido

        contenido.numScoring +=1;
        contenido.scoring = ((contenido.scoring * (contenido.numScoring - 1)) + puntuacion) / contenido.numScoring

        await contenido.save()

        res.status(201).send({ message: 'Reseña publicada correctamente', review : newReview});
        
    } catch (error) {
        
        next(error)
    }

}

//Prueba de error de slack
const pruebaSlack = async (req, res, next) =>{

    try {

        throw new Error('Error forzado para probar Slack')
        
    } catch (error) {

        next(error)
    }
}

module.exports = {  getContenido, 
                    getContenidoByCiudad,
                    getContenidoByActividad, 
                    getContenidoByCiudadAndActividad,
                    getContenidoByID,
                    registerUser,
                    loginUser,
                    updateUser,
                    updateEmail,
                    updatePassword,
                    deleteUser,
                    postReview,
                    pruebaSlack
                }