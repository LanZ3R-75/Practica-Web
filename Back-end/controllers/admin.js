//Importamos las rutas necesarias
const{comerciosModel, adminModel, contenidoModel} = require("../models")
const jwt = require('jsonwebtoken')

//Ruta para Registro de Admin
const postRegisterAdmin = async (req, res) => {

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

        res.status(500).send({message: error.message})
    }
}

//Ruta para Login de Administradores
const loginAdmin = async (req, res) => {

    const { username, password } = req.body;

    try {

        const admin = await adminModel.findOne({ username });
        if (!admin) return res.status(400).send({ message: 'Administrador no encontrado' });

        const isMatch = await admin.comparePassword(password); // Asegúrate de usar el nombre correcto del método
        if (!isMatch) return res.status(400).send({ message: 'Credenciales no válidas' });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).send({ token });

    } catch (error) {

        res.status(500).send({ message: error.message });
    }
};



// Ruta para registrar un nuevo comercio
const postComercio = async (req, res) => {

    const {nombre, CIF, direccion, email, telefono} = req.body

    try {

        //Generamos el token JWT para el comercio
        const tokenJWT = jwt.sign({email}, process.env.JWT_SECRET)
        
        //Creamos la pagina del contenido que podra modificar luego el comercio
        const contenido = new contenidoModel();
        await contenido.save();

        if (!contenido._id) {
            throw new Error('Error al crear pagina web interna.');
        }

        //Creamos el comercio
        const newComercio = new comerciosModel({nombre, CIF, direccion, email, telefono, tokenJWT, paginaID:contenido._id});
        await newComercio.save();

        res.status(201).send({ message: 'Comercio registrado con éxito', comercio: newComercio , token });
    
    } catch (error) {
        
        res.status(500).send({ error: error.message });
    }
};

//Ruta para modificar un nuevo comercio
const putComercio = async (req, res) =>{

    const { id } = req.params; // Obtener el ID del comercio desde la URL
    const updateData = req.body; // Datos para actualizar

    try {

        const updatedComercio = await comerciosModel.findByIdAndUpdate(id, updateData);

        if (!updatedComercio) {

            return res.status(404).send({ message: 'Comercio no encontrado' });

        }

        res.status(200).send({ message: 'Comercio actualizado', comercio: updatedComercio });

    } catch (error) {

        res.status(500).send({ error: error.message });
    }
}

//Ruta para obtener todos los comercios
const getComercios = async (req, res)=>{

    try {

        //Muestra todos los comercios que encuentre en la base de datos
        const data = await comerciosModel.find({})
        res.send(data)

    } catch (error) {
        //Muestra el error 
        res.status(500).send({ error: error.message });
    }

}


//Ruta para Obtener un comercio por su id
const getComercio = async (req, res)=>{

    const { id } = req.params;

    try {

        //Muestra todos el comercio especificado por el id
        const data = await comerciosModel.findById(id)
        res.send(data)

    } catch (error) {
        //Muestra el error 
        res.status(500).send({ error: error.message });
    }

}

//Ruta para Borrar un comercio 
const deleteComercio = async (req, res)=>{

    const { id } = req.params

    try {

        const data = await comerciosModel.findByIdAndDelete(id)
        res.send({ message: 'Comercio eliminado Fisicamente' })
        
        
    } catch (error) {

        res.status(500).send({ error: error.message });
    }

}

module.exports = {postRegisterAdmin, loginAdmin, postComercio, putComercio, getComercios,getComercio, deleteComercio}