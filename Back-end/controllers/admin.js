const{comerciosModel} = require("../models")
const jwt = require('jsonwebtoken')


//Ruta para registrar un nuevo comercio
const postComercio = async (req, res) =>{

    try{
        const comercio = new comerciosModel(req.body)
        await comercio.save()

        //crear y enviar el token JWT
        const token = jwt.sign({_id: comercio._id}, process.env.JWT_SECRET)
        res.status(201).send({comercio: comercio, comercio: token})

    }catch(error){
        
        res.status(500).send({error: error.message})

    }
}

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

        const data = await comerciosModel.deleteOne({_id: id})
        res.send({ message: 'Comercio eliminado Fisicamente' })
        
        
    } catch (error) {

        res.status(500).send({ error: error.message });
    }

}

module.exports = {postComercio, putComercio, getComercios,getComercio, deleteComercio}