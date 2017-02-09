import Server from 'socket.io';
import Facebook from './../facebook'

export function startServer() {
  	const io = new Server().attach(8090);

  	io.on('connection', (socket) => {
      	// set up facebook
      	Facebook(socket, 'connection')

  		// What to do on inital connections.
    	// socket.emit('state', {});

    	// When a new action comes in.
    	// socket.on('action', store.dispatch.bind(store));
  	});

}
