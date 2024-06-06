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

    const {id} = req.user
    const { ciudad, intereses , ofertas } = req.body

    try {

        const usuario = await userModel.findById(id)
        if(!usuario) return res.status(404).send({message: 'Usuario no encontrado'})

        const updateUsuario = await userModel.findByIdAndUpdate(id, { ciudad, intereses, ofertas }, { new: true })
        if (!updateUsuario) return res.status(404).send({ message: 'Página web no encontrada' });

        res.status(200).send({ message: 'Usuario actualizado con éxito', contenido: updateUsuario });

    } catch (error) {
        
        next(error)
    }
}


// Actualizar el correo electrónico del usuario
const updateEmail = async (req, res, next) => {

    const {id} = req.user;
    const { email } = req.body;

    try {

        const user = await userModel.findById(id);
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

    const {id} = req.user
    const { oldPassword, newPassword } = req.body

    try {

        const user = await userModel.findById(id);
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

    const {id} = req.user

    try {
        const user = await userModel.findById(id);
        if (!user) return res.status(404).send({ message: 'Usuario no encontrado' });

        // Buscar todas las reseñas del usuario
        const userReviews = await reviewModel.find({ usuarioID: id });

        // Eliminar las reseñas del contenido asociado
        for (let review of userReviews) {
            
            const contenido = await contenidoModel.findById(review.contenidoID);

            if (contenido) {

                // Filtra el array de reseñas de 'contenido' para eliminar la reseña cuyo '_id' coincide con 'review._id'
                contenido.reviews = contenido.reviews.filter(r => r.toString() !== review._id.toString());
                contenido.numScoring -= 1;
                contenido.scoring = contenido.numScoring > 0 ? 
                    ((contenido.scoring * (contenido.numScoring + 1)) - review.puntuacion) / contenido.numScoring : 0;

                await contenido.save();

            } else {
                
            }
        }

        // Eliminar las reseñas del usuario
        await reviewModel.deleteMany({ usuarioID: id });

        // Eliminar la cuenta del usuario
        await userModel.findByIdAndDelete(id);

        res.status(200).send({ message: 'Cuenta de usuario y reseñas asociadas eliminadas con éxito' });

    } catch (error) {

        next(error);
    }
};
// Publicar una Reseña

const postReview = async (req, res, next) => {

    const { comentario, puntuacion } = req.body
    const { contenidoId } = req.params
    const { id } = req.user

    try {

        const contenido = await contenidoModel.findById(contenidoId)
        if(!contenido) return res.status(404).send({ message: 'Contenido no encontrado' })

        //Verificar si el usuario ya ha escrito una reseña para un contenido
        const existingReview = await reviewModel.findOne({usuarioID: id , contenidoID: contenidoId})
        if(existingReview) return res.status(400).send({message: 'Ya has escrito una reseña para este contenido'})

        const newReview = new reviewModel({
            usuarioID: id,
            contenidoID: contenidoId,
            comentario,
            puntuacion,

        })

        await newReview.save()

        //Actualizamos la puntacion del contenido

        contenido.numScoring +=1;
        contenido.scoring = ((contenido.scoring * (contenido.numScoring - 1)) + puntuacion) / contenido.numScoring
        contenido.reviews.push(newReview._id);

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