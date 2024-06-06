//Importamos las rutas necesarias
const{comerciosModel, adminModel, contenidoModel, reviewModel, userModel} = require("../models")
const jwt = require('jsonwebtoken')

//--------------------------------------------------------------------------------------------------------------------------
//                                  GESTION DE ADMINISTRADORES
//--------------------------------------------------------------------------------------------------------------------------

//Ruta para Registro de Admin
const postRegisterAdmin = async (req, res, next) => {

    const {username, password} = req.body

    try{

        const existingAdmin = await adminModel.findOne({username})

        if(existingAdmin){

            return res.status(400).send({message: 'Adminstrador ya existente'})

        }

        const newAdmin = new adminModel({username, password})
        await newAdmin.save()
        res.status(201).send({mesage: 'Administrador registrado con exito'})


    }catch(error){

        next(error)
    }
}

//Ruta para Login de Administradores
const loginAdmin = async (req, res, next) => {

    const { username, password } = req.body;

    try {

        const admin = await adminModel.findOne({ username });
        if (!admin) return res.status(400).send({ message: 'Administrador no encontrado' });

        const isMatch = await admin.comparePassword(password); // Asegúrate de usar el nombre correcto del método
        if (!isMatch) return res.status(400).send({ message: 'Credenciales no válidas' });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).send({ token });

    } catch (error) {

        next(error)
    }
};

//--------------------------------------------------------------------------------------------------------------------------
//                                  GESTION DE COMERCIOS
//--------------------------------------------------------------------------------------------------------------------------

// Ruta para registrar un nuevo comercio
const postComercio = async (req, res, next) => {

    const { nombre, CIF, direccion, email, telefono } = req.body;

    try {
        // Verificar si ya existe un comercio con el mismo CIF, email o teléfono
        const existingComercio = await comerciosModel.findOne({
            $or: [
                { CIF },
                { email },
                { telefono }
            ]
        });

        if (existingComercio) {
            return res.status(400).send({ message: 'Comercio ya existe' })
        }

        // Creamos la pagina del contenido que podrá modificar luego el comercio
        const contenido = new contenidoModel()
        await contenido.save()

        if (!contenido._id) {
            throw new Error('Error al crear pagina web interna.')
        }

        // Creamos el comercio
        const newComercio = new comerciosModel({ nombre, CIF, direccion, email, telefono, paginaID: contenido._id })

        // Generamos el token JWT para el comercio
        const tokenJWT = jwt.sign({ id: newComercio._id }, process.env.JWT_SECRET )

        // Guardamos el token JWT en el comercio
        newComercio.tokenJWT = tokenJWT
        await newComercio.save();

        res.status(201).send({ message: 'Comercio registrado con éxito', comercio: newComercio })

    } catch (error) {

        next(error);
    }
};

//Ruta para modificar un nuevo comercio
const putComercio = async (req, res, next) =>{

    const { id } = req.params; // Obtener el ID del comercio desde la URL
    const updateData = req.body; // Datos para actualizar

    try {

        const updatedComercio = await comerciosModel.findByIdAndUpdate(id, updateData);

        if (!updatedComercio) {

            return res.status(404).send({ message: 'Comercio no encontrado' });

        }

        res.status(200).send({ message: 'Comercio actualizado', comercio: updatedComercio });

    } catch (error) {

        next(error)
    }
}

//Ruta para obtener todos los comercios
const getComercios = async (req, res, next)=>{

    try {

        //Muestra todos los comercios que encuentre en la base de datos
        const data = await comerciosModel.find({})
        res.send(data)

    } catch (error) {
        //Muestra el error 
        next(error)
    }

}


//Ruta para Obtener un comercio por su id
const getComercio = async (req, res, next)=>{

    const { id } = req.params;

    try {

        //Muestra todos el comercio especificado por el id
        const data = await comerciosModel.findById(id)
        if(!data) return res.status(404).send({message: 'No se ha encontrado el comercio'})

        res.send(data)

    } catch (error) {
        //Muestra el error 
        next(error)
    }

}

//Ruta para Borrar un comercio 
const deleteComercio = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Encuentra el comercio para obtener el id del contenido asociado
        const comercio = await comerciosModel.findById(id);
        if (!comercio) {
            return res.status(404).send({ message: 'Comercio no encontrado' });
        }

        const contenidoBorrado = await contenidoModel.findById(comercio.paginaID)

        //Elimina las reseñas asociadas al contenido
        await reviewModel.deleteMany({ _id: { $in: contenidoBorrado.reviews } });

        // Elimina el contenido asociado
        await contenidoModel.findByIdAndDelete(comercio.paginaID);

        // Elimina el comercio
        await comerciosModel.findByIdAndDelete(id);

        res.send({ message: 'Comercio y contenido eliminado físicamente' });

    } catch (error) {

         next(error)
    }
};

//--------------------------------------------------------------------------------------------------------------------------
//                                  GESTION DE USUARIOS REGISTRADOS
//--------------------------------------------------------------------------------------------------------------------------

// Obtener la lista de todos los usuarios registrados

const getAllUsers = async (req, res, next) => {

    try {

        const users = await userModel.find({})

        res.status(200).send(users)

    } catch (error) {

        next(error)
    }
}

// Obtener un usuario por el id

const getUser = async (req, res, next) => {

    const { id } = req.params

    try {

        const user = await userModel.findById(id)
        if(!user) return res.status(404).send({message: 'Usuario no encontrado'})
        
        res.status(200).send(user)
        
    } catch (error) {
        
        next(error)
    }
}

// Actualizar un usuario

const updateUser =  async( req, res, next) => {

    const { id } = req.params

    try {

        const user = await userModel.findByIdAndUpdate(id, req.body, {new: true})
        if(!user) return res.status(404).send({message: 'Usuario no encontrado'})
        
        res.status(200).send({message : 'Usuario actualizado correctamente',user})
        
    } catch (error) {
        
        next(error)
    }

}

// Actualizar la contraseña del usuario

const updateUserPassword =  async( req, res, next) => {

    const { id } = req.params
    const { newPassword } = req.body 

    try {

        const user = await userModel.findById(id);
        if (!user) return res.status(404).send({ message: 'Usuario no encontrado' });

        user.password = newPassword
        await user.save()
        
        res.status(200).send({message : 'Cotraseña actualizada con exito' })
        
    } catch (error) {
        
        next(error)
    }

}

// Actualizar el correo del usuario

const updateUserEmail = async (req, res, next) => {

    const { id } = req.params;
    const { newEmail } = req.body;

    try {

        const existingEmail = await userModel.findOne({ email: newEmail });
        if (existingEmail) return res.status(400).send({ message: 'El correo electrónico ya está en uso' });

        const user = await userModel.findById(id);
        if (!user) return res.status(404).send({ message: 'Usuario no encontrado' });

        user.email = newEmail;
        await user.save();

        res.status(200).send({ message: 'Correo electrónico actualizado correctamente', user });

    } catch (error) {

        next(error);
    }
}

// Borrar un usuario

const deleteUser = async (req, res, next) => {

    const {id} = req.params

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
}

module.exports = {  postRegisterAdmin,
                    loginAdmin, 
                    postComercio, 
                    putComercio, 
                    getComercios,
                    getComercio, 
                    deleteComercio,
                    getAllUsers,
                    getUser,
                    updateUser,
                    updateUserPassword,
                    updateUserEmail,
                    deleteUser
                }