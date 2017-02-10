'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import request from 'request'

const token = "EAAXUC29wWUQBAHGr37ZCGvZBJtCghFIwGgx9fGbIAx4rwkYz7fzjk0WwhRBzD2PKm6xDJX9iS6TUDZCyzrctW8ke3fhAzJQesXC8lXBIkbZBofubFs1T9xHZCKByY6gUkaIMIViqolpd3ZCnvPpYjvxSdLWKWBFAZCbLnb3s6x60gZDZD"

export function connectFacebook (socket, query) {
    const facebookServer = express()

    facebookServer.set('port', (process.env.PORT || 3030))

    // Process application/x-www-form-urlencoded
    facebookServer.use(bodyParser.urlencoded({extended: false}))

    // Process application/json
    facebookServer.use(bodyParser.json())

    // Index route
    facebookServer.get('/', function (req, res) {
        res.send('Hello world, I am a chat bot')
    })

    // for Facebook verification
    facebookServer.get('/webhook/', function (req, res) {
        if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
            res.send(req.query['hub.challenge'])
        }
        res.send('Error, wrong token')
    })

    // Spin up the server
    facebookServer.listen(facebookServer.get('port'), function() {
        console.log('facebookServer running on port', facebookServer.get('port'))
    })

    // Process Messages
    // Recieve Message
    facebookServer.post('/webhook/', function (req, res) {
        let messaging_events = req.body.entry[0].messaging

        for (let i = 0; i < messaging_events.length; i++) {
            let event = req.body.entry[0].messaging[i]
            let sender = event.sender.id

            if (event.message && event.message.text) {
                let text = event.message.text
                let messageObj = {sender: sender, text: text.substring(0, 200)}
                socket.emit('_ACTION', messageObj);
                
                // if (text === 'Generic') {
                //     sendGenericMessage(sender)
                //     continue
                // }
                // sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
            }
        }
        res.sendStatus(200)
    })

    // Send Message
    function sendTextMessage(sender, text) {
        let messageData = { text:text }
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token:token},
            method: 'POST',
            json: {
                recipient: {id:sender},
                message: messageData,
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
        })
    }

    function sendGenericMessage(sender) {
        let messageData = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "First card",
                        "subtitle": "Element #1 of an hscroll",
                        "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                        "buttons": [{
                            "type": "web_url",
                            "url": "https://www.messenger.com",
                            "title": "web url"
                        }, {
                            "type": "postback",
                            "title": "Postback",
                            "payload": "Payload for first element in a generic bubble",
                        }],
                    }, {
                        "title": "Second card",
                        "subtitle": "Element #2 of an hscroll",
                        "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "Postback",
                            "payload": "Payload for second element in a generic bubble",
                        }],
                    }]
                }
            }
        }
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token:token},
            method: 'POST',
            json: {
                recipient: {id:sender},
                message: messageData,
            }
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
        })
    }

}