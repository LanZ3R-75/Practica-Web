const {contenidoModel, userModel, reviewModel} = require('../models')
const jwt = require('jsonwebtoken')

//GESTION DE USUARIOS PUBLICOS

//Consultar todos los contenidos (ordenados o no por el scoring)

const getContenido = async (req, res) => {

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

        res.status(500).send({ message: error.message });
    }
};

//Consultar todos los contenidos de los comercios por ciudad (ordenados o no por scoring)

const getContenidoByCiudad = async (req, res) => {

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
        
        res.status(500).send({ message: error.message });
    }
}

//Consultar contenido de comercios por actividad (ordenados o no por scoring)

const getContenidoByActividad = async (req, res) => {

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

        res.status(500).send({ message: error.message });
    }

} 

//Consultar contenido de comercios por ciudad y actividad (ordenados o no por scoring)

const getContenidoByCiudadAndActividad = async (req, res) => {

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
        
        res.status(500).send({ message: error.message });
    }
}

//Consultar contenido de un comercio por ID

const getContenidoByID = async (req, res) => {

    const { id } = req.params

    try {

        const contenido = await contenidoModel.findById(id)

        if(!contenido){

            return res.status(404).send({message : 'No se ha encontrado ningun contenido para el ID introducido'})
        }

        res.status(200).send(contenido);

    } catch (error) {

        res.status(500).send({ message: error.message });
    }
}

//Registrar un usuario

const registerUser = async (req, res) => {

    const { nombre, email, password, edad, ciudad, intereses, ofertas } = req.body

    try {

        const existingUser = await userModel.findOne({email})
        if(existingUser) return res.status(400).send({message: 'El usuario ya existe'})

        const newUser = new userModel({
            nombre,
            email,
            password,
            ciudad,
            intereses,
            ofertas

        })

        await newUser.save()

        res.status(200).send(newUser);

    } catch (error) {
        
        res.status(500).send({ message: error.message });
    }

}

//GESTION DE USUARIOS REGISTRADOS

//Iniciar sesion
const loginUser = async (req, res) =>{

    const { email , password } = req.body

    try {

        const user = await userModel.findOne({email})
        if(!user) return res.status(404).send({message : 'Usuario no encontrado'})
        
        const isMatch = await user.comparePassword(password)
        if(!isMatch) return res.status(400).send({message : 'Contraseña incorrecta'})
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        
        res.status(200).send(token);

    } catch (error) {
        
        res.status(500).send({ message: error.message });
    }
}


module.exports = {  getContenido, 
                    getContenidoByCiudad,
                    getContenidoByActividad, 
                    getContenidoByCiudadAndActividad,
                    getContenidoByID,
                    registerUser,
                    loginUser

                }