/**
 * El controller se encarga de la interaccion entre el usuario, la logica del programa y la respuesra que devuelve
 * al usuario, siguiendo el patron MVC.
 */

//Importamos las utilidades necesarias
const{comerciosModel, contenidoModel, userModel, reviewModel} = require("../models")
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const { matchedData } = require("express-validator")

// Login de un comercio

const loginComercio = async (req, res, next) => {
    const { email, cif } = matchedData(req);

    try {
        const comercio = await comerciosModel.findOne({ email });
        if (!comercio) {
            return res.status(404).send({ message: 'Comercio no encontrado' });
        }

        if (comercio.CIF !== cif) {
            return res.status(400).send({ message: 'Credenciales incorrectas' });
        }

        // Verificar si el token JWT ya existe
        let token = comercio.tokenJWT;
        if (!token) {
            // Generar un nuevo token JWT si no existe
            token = jwt.sign({ id: comercio._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            comercio.tokenJWT = token;
            await comercio.save();
        }

        res.status(200).send({ token, comercio });

    } catch (error) {
        next(error);
    }
};

// Obtenemos el contenido asociado al comercio
const getComercioyContenido = async (req, res, next) => {
    const { id } = req.user;

    try {
        const comercio = await comerciosModel.findById(id).populate('paginaID');
        if (!comercio) {
            return res.status(404).send({ message: 'Comercio no encontrado' });
        }

        res.status(200).send({
            nombre: comercio.nombre,
            email: comercio.email,
            CIF: comercio.CIF,
            contenido: comercio.paginaID
        });
    } catch (error) {
        next(error);
    }
};


//Creamos la pagina de contenido (Solo si no existe una ya)

const createContenido = async (req, res, next) => {

    const {id} = req.user;

    try {
        // Verificar si el comercio existe
        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        // Verificar si el comercio ya tiene contenido
        if (comercio.paginaID) {
            return res.status(400).send({ message: 'Contenido ya existe para este comercio' });
        }

        // Crear nuevo contenido
        const cleanData = matchedData(req);
        const nuevoContenido = new contenidoModel(cleanData);
        await nuevoContenido.save();

        // Actualizar el comercio con el nuevo id de la pagina
        comercio.paginaID = nuevoContenido._id;
        await comercio.save();

        res.status(200).send({ message: 'Contenido nuevo creado con éxito', contenido: nuevoContenido });

    } catch (error) {

        next(error)
    }
};

//Borrar la pagina de contenido

const deleteContenido = async(req, res, next) =>{

    const {id} = req.user;

    try {

        // Verificar si el comercio existe
        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        //Verificamos que el comercio tenga contenido
        const contenidoID = comercio.paginaID
        if(!contenidoID) return res.status(404).send({ message: 'El comercio no tiene un contenido asociado' });

        //Borramos el contenido
        const deletedContenido = await contenidoModel.findByIdAndDelete(contenidoID)
        if(!deletedContenido) return res.status(404).send({ message: 'Contenido no encontrado' });

        // Borramos todas las reseñas asociadas a este contenido
        await reviewModel.deleteMany({ _id: { $in: deletedContenido.reviews } });

        //Borramos la referencia en el comercio
        comercio.paginaID = null
        await comercio.save()

        res.status(200).send({ message: 'Contenido eliminado con exito'});
        

    } catch (error) {

        next(error)
    }
}

//Ruta para Borrar un comercio 

const deleteComercio = async (req, res, next) => {
    const { id } = req.user;

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

        res.send({ message: 'Comercio y contenido eliminado correctamente' });

    } catch (error) {

        next(error)
    }
};

// Actualizar el contenido de un comercio
const updateContenido = async (req, res, next) => {

    const {id} = req.user;

    try {

        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        const cleanData = matchedData(req);

        const updateContenido = await contenidoModel.findByIdAndUpdate(comercio.paginaID, cleanData, { new: true });
        if (!updateContenido) return res.status(404).send({ message: 'Página web no encontrada' });

        res.status(200).send({ message: 'Página web actualizada con éxito', contenido: updateContenido });

    } catch (error) {

        next(error)
    }
};

//Subir texto

const uploadText = async (req, res, next) => {

    const {id} = req.user;
    const { text } = matchedData(req);

    try {

        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        const contenido = await contenidoModel.findById(comercio.paginaID);
        contenido.text.push(text);

        await contenido.save();

        res.status(200).send({ message: 'Texto añadido correctamente', texto: contenido.text });

    } catch (error) {

        next(error)
    }
};

// Borrar texto
const deleteText = async (req, res, next) => {

    const { textIndex } = req.params;
    const {id} = req.user;

    try {

        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        const contenido = await contenidoModel.findById(comercio.paginaID);
        if (!contenido.text[textIndex]) {
            return res.status(404).send({ message: 'Texto no encontrado' });
        }

        // Eliminar el texto de la base de datos
        contenido.text.splice(textIndex, 1);
        await contenido.save();

        res.status(200).send({ message: 'Texto eliminado correctamente', texto: contenido.text });

    } catch (error) {

        next(error)
    }
};

// Subir foto
const uploadFoto = async (req, res, next) => {

    const {id} = req.user;

    try {

        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        const contenido = await contenidoModel.findById(comercio.paginaID);
        if (!req.file) {
            return res.status(400).send({ message: 'No se ha subido ninguna foto' });
        }

        const photoPath = req.file.path;
        contenido.fotos.push(photoPath);

        await contenido.save();

        res.status(200).send({ message: 'Foto añadida correctamente', fotos: contenido.fotos });

    } catch (error) {
       
        next(error)
    }
};

//Borrar imagenes

const deleteFoto = async (req, res, next) => {

    const {fotoIndex} = req.params;
    const {id} = req.user;

    try {

        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        const contenido = await contenidoModel.findById(comercio.paginaID);
        const fotoPath = contenido.fotos[fotoIndex];

        if (!fotoPath) {
            return res.status(404).send({ message: 'Foto no encontrado' });
        }

        //Eliminar la foto del sistema de archivos
        fs.unlinkSync(path.resolve(fotoPath))

        //Eliminar la foto de la base de datos
        contenido.fotos.splice(fotoIndex, 1)
        await contenido.save()

        res.status(200).send({message: 'Foto eliminada correctamente', fotos: contenido.fotos})

        
    } catch (error) {
        
        next(error)
    }
}

//Optener el correo segun la ciudad y los intereses

const consultarIntereses = async (req, res, next) => {

    const {id} = req.user;

    try {
        // Verificar si el comercio existe
        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        // Buscar usuarios que coincidan con la ciudad y los intereses del contenido del comercio
        const contenido = await contenidoModel.findById(comercio.paginaID);

        const users = await userModel.find({
            ciudad: contenido.ciudad,
            intereses: { $in: [contenido.actividad] },
            ofertas:true
            
        }, 'email');

        const emails = users.map(user => user.email);
        res.status(200).send({ emails });
        
    } catch (error) {
        
        next(error)
    }
};

module.exports = { loginComercio, getComercioyContenido, deleteComercio, createContenido, deleteContenido, updateContenido, uploadText, deleteText ,uploadFoto, deleteFoto, consultarIntereses };
