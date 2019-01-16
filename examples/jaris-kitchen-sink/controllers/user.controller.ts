import { Conn } from '@jaris/core';
import { json } from '@jaris/router';
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
    return json(conn, { users: [] });
  },
  show: (conn: Conn, { userUid }: UserParams) => {
    // fetch single user based on userUid
    return json(conn, { user: {} });
  },
  update: async (conn: Conn, { userUid }: UserParams) => {
    const body = {}; // TODO: Swap when body parsing is built in ;)
    const { data, errors } = await validate(body, {
      firstName: [required(), string()],
      lastName: [required(), string()],
      email: [required(), string()],
      displayName: [optional(), string()],
    });

    if (errors) {
      return json(conn, { errors }, 422);
    }

    return json(conn, { user: createAndStoreUser(userUid, data) });
  },
};

export default userController;
