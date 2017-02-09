'use strict'

import SocketIo from 'socket.io'
import express from 'express'
import path from 'path'

import Facebook from './../facebook'

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

export function startServer(server) {

	const server = express()
	  .use((req, res) => res.sendFile(INDEX) )
	  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

	const io = socketIO(server);

  	io.on('connection', (socket) => {
	  	console.log('Client connected');
      	Facebook(socket, 'connection')

	  	socket.on('disconnect', () => console.log('Client disconnected'));
	});

}
