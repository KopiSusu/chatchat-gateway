import {startServer} from './src/socketServer/socketServer';

startServer();

// First thing the server does on startup (for already registered)
// 1. Wait for request for user (login).
// 2. Begin api init process.
// 3. Return keys for all api requests so we can keep this stateless?

// store.dispatch({
//   type: 'SET_ENTRIES',
//   entries: require('./entries.json')
// });
// store.dispatch({type: 'NEXT'});

