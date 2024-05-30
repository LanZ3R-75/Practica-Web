const jwt = require('jsonwebtoken')
const adminModel = require('../models/nosql/admin')
const comerciosModel = require('../models/nosql/comercios')


//Middleware para la autenticacion
module.exports = (req, res, next) => {

    const token = req.header('Authorization').replace('Bearer ', '')

    if(!token) return res.status(401).json({message: 'No hay token, autorizacion denegada'})
    
    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()


    }catch(error){

        res.status(401).send({message: 'El token no es valido'})
    }

}

//Middleware que se encarga de verificar si el usuario es administrador

module.exports.isAdmin = async (req, res, next) => {

    try {

        const admin = await adminModel.findByID(req.user.id)

        if(!admin) return res.status(403).send({message: 'Acceso denegado'})

        next()

    }catch(error){

        res.status(500).send({message: 'error.message'})

    }
}

//Middleware que se encarga de verificar si el comercio usa su token

module.exports.isComercio = async (req, res, next) => {

    try {

        const token = req.header('Authorization').replace('Bearer ', '');

        const comercio = await comerciosModel.findOne({ tokenJWT: token });

        if (!comercio) return res.status(403).json({ message: 'Access denied' });

        req.comercio = comercio;
        next();

    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }

}