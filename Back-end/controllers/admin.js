//Importamos las rutas necesarias
const{comerciosModel, adminModel, contenidoModel} = require("../models")
const jwt = require('jsonwebtoken')

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



// Ruta para registrar un nuevo comercio
const postComercio = async (req, res, next) => {

    const {nombre, CIF, direccion, email, telefono} = req.body

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
            return res.status(400).send({ message: 'Comercio ya existe' });
        }

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

        res.status(201).send({ message: 'Comercio registrado con éxito', comercio: newComercio , tokenJWT });
    
    } catch (error) {
        
        next(error)
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

        // Elimina el contenido asociado
        await contenidoModel.findByIdAndDelete(comercio.paginaID);

        // Elimina el comercio
        await comerciosModel.findByIdAndDelete(id);

        res.send({ message: 'Comercio y contenido eliminado físicamente' });

    } catch (error) {

         next(error)
    }
};

module.exports = {postRegisterAdmin, loginAdmin, postComercio, putComercio, getComercios,getComercio, deleteComercio}