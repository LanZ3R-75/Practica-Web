const express = require("express")
const cors = require("cors")
const path = require("path");
const fs = require('fs')
const morganBody = require('morgan-body')

require('dotenv').config()

const app = express()

const dbConnect = require('./config/mongo')
dbConnect()
const errorHandler = require('./utils/slackNotifier');
//const { truncateSync } = require("fs");

// Al usar cors evitamos errores de Cross-domain
app.use(cors())
app.use(express.json())

// Configuracion de morgan-body para registrar las solicitudes HTTP y sus cuerpos
const log = fs.createWriteStream(path.join(__dirname, 'requests.log'),{ flags : 'a'})
morganBody(app, {
    noColors: true,
    stream: log
})

// Rutas
app.use("/api", require("./routes")) //Lee los routes/index.js por defecto

// Middleware para servir archivos estáticos
app.use('/subidas', express.static(path.join(__dirname, 'subidas')));

const port = process.env.PORT || 3000

app.listen(port, () => {

    console.log("Servidor en el puerto " + port)
})

// Middleware de manejo de errores
app.use(errorHandler)
