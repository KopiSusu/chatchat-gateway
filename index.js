'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('superagent')
const facebookConnect = require('./facebook')
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

facebookConnect.initiateWebhook(app, fbT)