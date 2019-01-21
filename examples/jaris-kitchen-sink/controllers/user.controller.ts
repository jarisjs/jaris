import { Conn, json, status } from '@jaris/core';
import { pipe } from '@jaris/util';
import validate, { string, required, optional } from '@jaris/validator';

interface UserParams {
  userUid: string;
}

const createAndStoreUser = (userUid: string, body: any) => {
  // ... actually store user
  return {};
};

const userController = {
  index: (conn: Conn) => {
    // ... fetch users
    console.log('index');
    return json({ users: [] }, conn);
  },
  show: (conn: Conn, { userUid }: UserParams) => {
    // fetch single user based on userUid
    return json({ user: {} }, conn);
  },
  store: async (conn: Conn, { userUid }: UserParams) => {
    const body = {}; // TODO: Swap when body parsing is built in ;)
    const { data, errors } = await validate(body, {
      firstName: [required(), string()],
      lastName: [required(), string()],
      email: [required(), string()],
      displayName: [optional(), string()],
    });

    if (errors) {
      return pipe(
        json({ errors }),
        status(422),
      )(conn);
    }

    return json({ user: createAndStoreUser(userUid, data) }, conn);
  },
};

export default userController;
