import server, { Conn } from '@jaris/core';
import router from '../../../packages/router/src/index';
import routes from './routes';

server([
  (conn: Conn) => {
    console.log('I always run before!');
    return conn;
  },

  // Routes registered here
  router(routes),

  // You could also do something like this for versioned routes
  // router(v1Routes),
  // router(v2Routes),
  // etc...

  (conn: Conn) => {
    console.log('I always run after!');
    return conn;
  },
]);
