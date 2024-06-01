/**
 * El controller se encarga de la interaccion entre el usuario, la logica del programa y la respuesra que devuelve
 * al usuario, siguiendo el patron MVC.
 */

//Importamos las utilidades necesarias
const{comerciosModel, contenidoModel, userModel} = require("../models")
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

//Creamos la pagina de contenido (Solo si no existe una ya)

const createContenido = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el comercio existe
        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        const token = req.header('Authorization').replace('Bearer ', '');
        if (comercio.tokenJWT !== token) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }

        // Verificar si el comercio ya tiene contenido
        if (comercio.paginaID) {
            return res.status(400).send({ message: 'Contenido ya existe para este comercio' });
        }

        // Crear nuevo contenido
        const nuevoContenido = new contenidoModel({ ...req.body });
        await nuevoContenido.save();

        // Actualizar el comercio con el nuevo id de la pagina
        comercio.paginaID = nuevoContenido._id;
        await comercio.save();

        res.status(200).send({ message: 'Contenido nuevo creado con éxito', contenido: nuevoContenido });

    } catch (error) {

        res.status(500).send({ error: error.message });
    }
};

//Borrar la pagina de contenido

const deleteContenido = async(req, res) =>{

    const { id } = req.params;

    try {

        // Verificar si el comercio existe
        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        const token = req.header('Authorization').replace('Bearer ', '');
        if (comercio.tokenJWT !== token) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }

        //Verificamos que el comercio tenga contenido
        const contenidoID = comercio.paginaID
        if(!contenidoID) return res.status(404).send({ message: 'El comercio no tiene un contenido asociado' });

        //Borramos el contenido
        const deletedContenido = await contenidoModel.findByIdAndDelete(contenidoID)
        if(!deletedContenido) return res.status(404).send({ message: 'Contenido no encontrado' });

        //Borramos la referencia en el comercio
        comercio.paginaID = null
        await comercio.save()

        res.status(200).send({ message: 'Contenido eliminado con exito'});
        

    } catch (error) {

        res.status(500).send({ error: error.message });
    }
}

// Actualizar el contenido de un comercio
const updateContenido = async (req, res) => {

    const { id } = req.params;

    try {
        const comercio = await comerciosModel.findById(id);

        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        const token = req.header('Authorization').replace('Bearer ', '');

        if (comercio.tokenJWT !== token) {

            return res.status(403).send({ message: 'Acceso denegado' });
        }

        const updateContenido = await contenidoModel.findByIdAndUpdate(comercio.paginaID, req.body, { new: true });
        if (!updateContenido) return res.status(404).send({ message: 'Página web no encontrada' });

        res.status(200).send({ message: 'Página web actualizada con éxito', contenido: updateContenido });

    } catch (error) {

        res.status(500).send({ error: error.message });
    }
};

//Subir texto

const uploadText = async (req, res) => {

    const { id } = req.params;
    const { text } = req.body;

    try {

        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        const token = req.header('Authorization').replace('Bearer ', '');
        if (comercio.tokenJWT !== token) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }

        const contenido = await contenidoModel.findById(comercio.paginaID);
        contenido.text.push(text);

        await contenido.save();

        res.status(200).send({ message: 'Texto añadido correctamente', texto: contenido.text });

    } catch (error) {

        res.status(500).send({ error: error.message });
    }
};

// Borrar texto
const deleteText = async (req, res) => {

    const { id, textIndex } = req.params;

    try {

        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        const token = req.header('Authorization').replace('Bearer ', '');
        if (comercio.tokenJWT !== token) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }

        const contenido = await contenidoModel.findById(comercio.paginaID);
        if (!contenido.text[textIndex]) {
            return res.status(404).send({ message: 'Texto no encontrado' });
        }

        // Eliminar el texto de la base de datos
        contenido.text.splice(textIndex, 1);
        await contenido.save();

        res.status(200).send({ message: 'Texto eliminado correctamente', texto: contenido.text });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Subir foto
const uploadFoto = async (req, res) => {
    const { id } = req.params;

    try {
        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        const token = req.header('Authorization').replace('Bearer ', '').trim();
        if (comercio.tokenJWT !== token) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }

        const contenido = await contenidoModel.findById(comercio.paginaID);
        if (!req.file) {
            return res.status(400).send({ message: 'No se ha subido ninguna foto' });
        }

        const photoPath = req.file.path;
        contenido.fotos.push(photoPath);

        await contenido.save();

        res.status(200).send({ message: 'Foto añadida correctamente', fotos: contenido.fotos });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

//Borrar imagenes

const deleteFoto = async (req, res) => {

    const { id, fotoIndex} = req.params;

    try {

        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        const token = req.header('Authorization').replace('Bearer ', '');
        if (comercio.tokenJWT !== token) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }

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
        
        res.status(500).send({ error: error.message });
    }
}

//Optener el correo segun la ciudad y los intereses

const consultarIntereses = async (req, res) => {

    const { id } = req.params;

    try {
        // Verificar si el comercio existe
        const comercio = await comerciosModel.findById(id);
        if (!comercio) return res.status(404).send({ message: 'Comercio no encontrado' });

        const token = req.header('Authorization').replace('Bearer ', '');
        if (comercio.tokenJWT !== token) {
            return res.status(403).send({ message: 'Acceso denegado' });
        }

        // Buscar usuarios que coincidan con la ciudad y los intereses del contenido del comercio
        const contenido = await contenidoModel.findById(comercio.paginaID);

        const users = await userModel.find({
            ciudad: contenido.ciudad,
            intereses: contenido.actividad,
            ofertas:true
            
        }, 'email');

        const emails = users.map(user => user.email);
        res.status(200).send({ emails });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = { createContenido, deleteContenido, updateContenido, uploadText, deleteText ,uploadFoto, deleteFoto, consultarIntereses };
