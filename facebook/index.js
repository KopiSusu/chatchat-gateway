'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('superagent')

module.exports = {
	initiateWebhook: (app, token) => {
		// for Facebook verification
		app.get('/facebook/', function (req, res) {
		    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		        res.send(req.query['hub.challenge'])
		    }
		    res.send('Error, wrong token')
		})

		// Process Messages
		app.post('/facebook/', function (req, res) {

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
		        .get(`https://graph.facebook.com/v2.6/${sender}?fields=first_name,last_name&access_token=${token}`)
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
		        "from": sender, 
		        "source_type": "fbm", 
		        "tag": null, 
		    }

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
                continue
            }
            sendFacebookMessage(req.body.sender_facebook_id, req.body.sender_facebook_id.text.substring(0, 200))

		    res.sendStatus(200)
		})
		function sendFacebookMessage(sender, text) {
		    console.log('sender: ', sender)
		    console.log('text: ', text)

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
		            } 
		        })

		}

	}
}