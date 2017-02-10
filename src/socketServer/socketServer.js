import SocketIo from 'socket.io'
import express from 'express'
import path from 'path'

import {connectFacebook} from './../facebook'

const PORT = process.env.PORT || 8090;

export function startServer() {

	const socketServer = express()
	  .listen(PORT, () => console.log(`socketServer Listening on ${ PORT }`));

	const io = SocketIo(socketServer);

  	io.on('connection', (socket) => {
	  	console.log('Client connected');

	  	socket.on('disconnect', () => console.log('Client disconnected'));

	  	socket.on('connect_facebook', () => {

	  		console.log('Client connect_facebook')

	  		connectFacebook(socket, 'connection')

	  	});
	});

}
