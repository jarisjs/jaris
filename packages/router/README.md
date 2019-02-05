# @jaris/router

**jaris is still in very early alpha, production usage is not recommended**

Router for `@jaris/core`

# Installation

```
$ npm install -S @jaris/core @jaris/router
```

# Usage

## Hello, world

```javascript
import server, { text } from '@jaris/core';
import router, { get } from '@jaris/router';

server([router([get('/', conn => text('Hello, world!', conn))])]);
```

## Multi file structure

```javascript
// user.controller.ts
import { json } from '@jaris/core';

const userController = {
  // method can be async!
  index: async conn => {
    // fetch users, etc
    return json({ users: [] }, conn);
  },
};

export default userController;
```

```javascript
// api.routes.ts
import { get } from '@jaris/router';
import userController from './user.controller';

const apiRoutes = [get('/users', userController.index)];

export default apiRoutes;
```

```javascript
// index.ts
import server  from '@jaris/core';
import router from '@jaris/router';
import apiRoutes from './api.routes.ts';

server([
  (conn) => {
    console.log('Since the router is also just a middleware itself, we can have as many middleware before or after that we want!');
    return conn;
  }
  router(apiRoutes)
])
```

## Route Parameters

Route parameters are defined using a colon in the route definition and are set as object values on `conn.params`.

```javascript
import server, { text } from '@jaris/core';
import router, { get } from '@jaris/router';

server([
  router([
    get('/users/:userId', conn =>
      text(`Hello, user ${conn.params.userId}!`, conn),
    ),
  ]),
]);
```

## More complex routing

Prefixes & Middleware

```javascript
import server, { json, status, halt } from '@jaris/core';
import router, { get, post, group } from '@jaris/router';

// Middleware are the same as @jaris/core
// so they need to follow the same rule
// of returning a new connection
const companyMiddleware = conn => {
  const token = conn.headers['Authorization'];

  // ... parse token
  // fetch user it belongs to
  // check if user has access to company

  // if you want to continue, return the connection
  if (userHasAccess) {
    return conn;
  }

  // otherwise we set errors and tell jaris
  // to stop by using the "halt" helper
  return pipe(
    status(403),
    json({ error: 'You do not have permission' }),
    halt,
  )(conn);
};

server([
  router([
    // groups need to be spread since
    // they return an array of routes
    ...group({ prefix: 'v1' }, () => [
      // will evaluate to /v1/users
      get('/users', userController.index),

      // leading / trailing slashes are optional
      post('users', userController.store),

      // groups can be nested
      ...group(
        {
          prefix: '/companies/:companyId',
          middleware: [companyMiddleware],
        },
        () => [
          // /v1/companies/:companyUid
          get('/', companyController.show),
        ],
      ),
    ]),
  ]),
]);
```
