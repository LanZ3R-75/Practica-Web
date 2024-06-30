const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require('fs');
const morganBody = require('morgan-body');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();

const dbConnect = require('./config/mongo');
dbConnect();
const errorHandler = require('./utils/slackNotifier');

// Al usar cors evitamos errores de Cross-domain
app.use(cors());
app.use(express.json());

// Configuracion de morgan-body para registrar las solicitudes HTTP y sus cuerpos
const log = fs.createWriteStream(path.join(__dirname, 'requests.log'), { flags: 'a' });
morganBody(app, {
    noColors: true,
    stream: log
});

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Comercios || Shogyo',
            version: '1.0.0',
            description: 'Esta API gestiona las rutas y operaciones relacionadas con los comercios en la plataforma Shogyo.'

        },
    },
    apis: ['./routes/*.js'], // Rutas donde se encuentran tus archivos de ruta
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Rutas
app.use("/api", require("./routes")); // Lee los routes/index.js por defecto

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Servidor en el puerto " + port);
});

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app