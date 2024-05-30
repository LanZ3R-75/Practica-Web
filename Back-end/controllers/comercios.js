/**
 * El controller se encarga de la interaccion entre el usuario, la logica del programa y la respuesra que devuelve
 * al usuario, siguiendo el patron MVC.
 */

//Importamos las utilidades necesarias
const{comerciosModel, contenidoModel, userModel} = require("../models")
const jwt = require('jsonwebtoken')

// Actualizar página web
const updatecontenido = async (req, res) => {
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

// Subida de imagenes

const uploadPhoto = async (req, res) => {

    const { id } = req.params

    try {

        const comercio = await comerciosModel.findById(id)
        if(!comercio) return res.statust(404).send({message: 'Comercio no encontrado'})
        
        const token = req.header('Authorization').replace('Bearer ', '')
        if(comercio.tokenJWT !== token){

            return res.status(403).send({message: 'Acceso denegado'})
        }

        const contenido = await contenidoModel.findById(comercio.paginaID)
        if(!req.file){

            res.status(400).send({message: 'No se ha subido ninguna foto'})
        }

        const photoPath = req.file.path.replace(/\\/g, '/');
        contenido.fotos.push(photoPath)

        await contenido.save()

        res.status(200).send({message: 'Foto añadida correctamente', fotos: contenido.fotos})
        
    } catch (error) {
        
        res.status(500).send({ error: error.message });
    }
}

module.exports = { updatecontenido, uploadText, uploadPhoto };
