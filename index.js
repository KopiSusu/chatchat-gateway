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
function receiveFacebookMessage(sender, text) {
    const newMessages = {
        "body": text, 
        "created_on": new Date(), 
        "data": null, 
        "img_src": null, 
        "to": '+19179001106',
        "from": sender + '', 
        "source_type": "FBM", 
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
app.post('/facebook/return', function (req, res) {
    console.log('req.body: ', req.body)

    let sender = req.body.sender_facebook_id;

    while(sender.charAt(0) === '+')
    {
        sender = sender.substring(1, 200)
    }

    console.log('sender: ', sender)

    if (req.body.text === 'Generic') {
        sendGenericMessage(sender)
    } else {
        sendFacebookMessage(sender, req.body.text.substring(0, 200))
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


// LINE STUFF


// Process Messages
app.post('/line/', function (req, res) {
    let messaging_events = req.body.events
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.events[i]
        let sender = event.source.userId
        let replyToken =  event.replyToken
        if (event.message && event.message.text) {
            let text = event.message.text
            receiveLineMessage(sender, "Text received from line gateway, echo: " + text.substring(0, 200))
            
        }
    }
    res.sendStatus(200)
})
function receiveLineMessage(sender, text) {
    const newMessages = {
        "body": text, 
        "created_on": new Date(), 
        "data": null, 
        "img_src": null, 
        "to": '+19179001106',
        "from": sender + '', 
        "source_type": "line", 
        "tag": null, 
    }
    console.log('sender: ', sender)
    console.log('newMessages: ', newMessages)

    request
        .post(`http://chatchat.api.everybodysay.com:3000/gateway/line/in`)
        .send(newMessages)
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (err) {
                console.log('some error threw')
            } 
        })
}


app.post('/line/return', function (req, res) {
    console.log('inside /line/return')
    console.log('req.body: ', req.body)

    let sender = req.body.sender_line_id;

    while(sender.charAt(0) === '+')
    {
        sender = sender.substring(1, 200)
    }

    console.log('sender: ', sender)
    pushLineMessage(sender, req.body.text.substring(0, 200))

    res.sendStatus(200)
})
function pushLineMessage(sender, text) {
  console.log('text: ', text)

  request
        .post('https://api.line.me/v2/bot/message/push')
        .send({
            to: sender,
            messages: [ 
              {
                "type":"text",
                "text":text
            }
          ]
        })
        .set('Authorization', `Bearer ${cT}`)
        .end((err, res) => {
            if (err) {
                console.log('err: ', err)
            } 
        })
}
function replyLineMessage(replyToken, text) {
    console.log('text: ', text)

    request
        .post('https://api.line.me/v2/bot/message/reply')
        .send({
            replyToken: replyToken,
            messages: [ 
                {
                    "type":"text",
                    "text":text
                }
            ]
        })
        .set('Authorization', `Bearer ${cT}`)
        .end((err, res) => {
            if (err) {
                console.log('err: ', err)
            } 
        })
}


const cT = 'ToDFVvCpNFbfjtxzR2CDLNTt3aSWAhLN2/9jf03d0VGJSqh4DMSJd+fRm4ZH+TfNmzbWt6VCAosZqxsTmvmbIFLh7nQPLztM7/YIIryklIwG65ds9X11voXd8uPXqjabkrgCZYXnzo3dJNwJQwopIQdB04t89/1O/w1cDnyilFU='