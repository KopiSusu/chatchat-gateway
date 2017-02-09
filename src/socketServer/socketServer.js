import SocketIo from 'socket.io'
import express from 'express'
import path from 'path'

import Facebook from './../facebook'

const PORT = process.env.PORT || 8090;

export function startServer() {

	const server = express()
	  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

	const io = SocketIo(server);

  	io.on('connection', (socket) => {
	  	console.log('Client connected');
      	// Facebook(socket, 'connection')

	  	socket.on('disconnect', () => console.log('Client disconnected'));
	});

}
