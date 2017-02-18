'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('superagent')
const app = express()

const fbT = "EAAXUC29wWUQBAHGr37ZCGvZBJtCghFIwGgx9fGbIAx4rwkYz7fzjk0WwhRBzD2PKm6xDJX9iS6TUDZCyzrctW8ke3fhAzJQesXC8lXBIkbZBofubFs1T9xHZCKByY6gUkaIMIViqolpd3ZCnvPpYjvxSdLWKWBFAZCbLnb3s6x60gZDZD"

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat gateway')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.get('/facebook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Process Messages
app.post('/facebook/', function (req, res) {

    console.log('did this work? inside /facebook/')

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
            receiveFacebookMessage(sender, text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

function getSenderName(sender, text) {
    request
        .get(`https://graph.facebook.com/v2.6/${sender}?fields=first_name,last_name&access_token=${fbT}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (!err) {
                receiveFacebookMessage(`${res.body.first_name} ${res.body.first_name}`, sender, text)
            } 
        })
}
function receiveFacebookMessage(sender, text) {
    const newMessages = {
        "body": text, 
        "created_on": new Date(), 
        "data": null, 
        "img_src": null, 
        "to": +19179001106,
        "from": sender, 
        "source_type": "fbm", 
        "tag": null, 
    }
    console.log('sender: ', sender)
    console.log('newMessages: ', newMessages)

    request
        .post(`http://chatchat.api.everybodysay.com:3000/gateway/fbm/in`)
        .send(newMessages)
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (err) {
                console.log('some error threw')
            } 
        })
}


app.post('/facebook/return', function (req, res) {
    console.log('req.body: ', req.body)

    if (text === 'Generic') {
        sendGenericMessage(sender)
    } else {
        sendFacebookMessage(req.body.sender_facebook_id, req.body.sender_facebook_id.text.substring(0, 200))
    }

    res.sendStatus(200)
})
function sendFacebookMessage(sender, text) {
    console.log('sender: ', sender)
    console.log('text: ', text)

    let messageData = { text:text }

    request
        .post(`https://graph.facebook.com/v2.6/me/messages?access_token=${fbT}`)
        .send({
            recipient: {id:sender},
            message: messageData,
        })
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (err) {
                console.log('some error threw')
            } 
        })

}