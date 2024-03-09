const express = require("express")
const cors = require("cors")
require('dotenv').config()

const app = express()

const dbConnect = require('./config/mongo')
dbConnect()

//Al usar cors evitamos errores de Cross-domain
app.use(cors())
app.use(express.json())
app.use("/api", require("./routes")) //Lee los routes/index.js por defecto

const port = process.env.PORT || 3000

app.listen(port, () => {

    console.log("Servidor en el puerto " + port)
})
