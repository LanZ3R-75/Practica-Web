const { IncomingWebhook } = require('@slack/webhook')

// Configuramos el webhook de Slack
const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK)

// Funcion para enviar los mensajes a Slack
const sendSlackNotification = async ( message ) => {

    try {
        
        await webhook.send({ text: message })

    } catch (error) {

        console.error('Error enviando el mensaje a Slack', error.message)
        
    }
}

// Middleware de manejo de errores
const errorHandler = async (err, req, res, next) => {

    console.error(err.stack)

    // Enviar mensaje a Slack
    await sendSlackNotification(`Error en el servidor: ${err.message}\nStack Trace:\n${err.stack}\nEndpoint: ${req.method} ${req.originalUrl}\nBody: ${JSON.stringify(req.body)}\nQuery: ${JSON.stringify(req.query)}`);

    res.status(500).send({message: 'El servidor se fue de madre...'})

}

module.exports = errorHandler