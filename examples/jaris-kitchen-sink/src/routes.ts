import { Conn } from '@jaris/core';
import { get, put, group, text } from '@jaris/router';
import userController from '../controllers/user.controller';

const routes = [
  get('/', (conn: Conn) => {
    return text(conn, 'Home page :)');
  }),

  ...group({ prefix: '/users' }, () => [
    get('/', userController.index), // /users

    get('/:userUid', userController.show), // /users/1234

    // Another way to write the above, if you have multiple routes at /users/:userUid/x
    ...group({ prefix: '/:userUid' }, () => [
      put('/', userController.update), // /users/1234
    ]),
  ]),
];

export default routes;
