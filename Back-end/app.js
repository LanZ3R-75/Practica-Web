const express = require("express")
const cors = require("cors")
const path = require("path");

require('dotenv').config()

const app = express()

const dbConnect = require('./config/mongo')
dbConnect()

//Al usar cors evitamos errores de Cross-domain
app.use(cors())
app.use(express.json())

// Rutas
app.use("/api", require("./routes")) //Lee los routes/index.js por defecto

// Middleware para servir archivos estáticos
app.use('/subidas', express.static(path.join(__dirname, 'subidas')));

const port = process.env.PORT || 3000

app.listen(port, () => {

    console.log("Servidor en el puerto " + port)
})
