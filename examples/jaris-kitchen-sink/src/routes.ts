import { Conn, text } from '@jaris/core';
import { get, group, post } from '../../../packages/router/src';
import userController from '../controllers/user.controller';

const routes = [
  get('/', (conn: Conn) => {
    return text('Home page :)', conn);
  }),

  ...group({ prefix: '/users' }, () => [
    get('/', userController.index), // /users

    get('/:userUid', userController.show), // /users/1234

    // Another way to write the above, if you have multiple routes at /users/:userUid/x
    ...group({ prefix: '/:userUid' }, () => [
      post('/', userController.store), // /users/1234
    ]),
  ]),
];

export default routes;
