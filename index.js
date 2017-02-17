'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('superagent')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

// Process Messages
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            if (text === 'Generic') {
                sendGenericMessage(sender)
                continue
            }
            sendFacebookMessage(sender, "Text received from facebook gateway, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

function sendFacebookMessage(sender, text) {
    console.log('sender: ', sender)
    let messageData = { text:text }
    
    request
        .post(`https://graph.facebook.com/v2.6/me/messages?access_token=${token}`)
        .send({
            recipient: {id:sender},
            message: messageData,
        })
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (err) {
                console.log('some error threw')
                // console.log('err: ', err)
            } 
        })

}
const token = "EAAXUC29wWUQBAHGr37ZCGvZBJtCghFIwGgx9fGbIAx4rwkYz7fzjk0WwhRBzD2PKm6xDJX9iS6TUDZCyzrctW8ke3fhAzJQesXC8lXBIkbZBofubFs1T9xHZCKByY6gUkaIMIViqolpd3ZCnvPpYjvxSdLWKWBFAZCbLnb3s6x60gZDZD"