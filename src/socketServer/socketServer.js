import SocketIo from 'socket.io'
import express from 'express'
import path from 'path'

import Facebook from './../facebook'

const PORT = process.env.PORT || 8090;

export function startServer() {

	const server = express()
	  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

	const socket = SocketIo(server);

	// const facebookApp = express()
	// 	.set('port', (process.env.PORT || 5000));

 //  	Facebook(facebookApp, socket, 'connection')

  	socket.on('connection', (socket) => {
	  	console.log('Client connected');

	  	socket.on('disconnect', () => console.log('Client disconnected'));
	});

}
