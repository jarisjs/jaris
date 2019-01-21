# @jaris/core

**jaris is still in very early alpha, production usage is not recommended**

Jaris. A 0 dependency, functional (phoenix) inspired, node / typescript web framework.

# Installation

```
$ npm install -S @jaris/core
```

# Usage

The core concept behind `jaris` is that the `conn` object gets passed through a series of functions (middleware), and the final resulting `conn` determines what is sent.

The `conn` object should never be mutated directly, only copied via spread (`...conn`), or modified using one of the conn helper functions provided.

A simple hello world would look like:

```javascript
import server, { text } from '@jaris/core';

server([conn => text('Hello, world!', conn)]);
```

An example using multiple middleware would look like:

```javascript
import server, { text } from '@jaris/core';

server([
  (conn) => ({
    ...conn,
    body: 'I will be overwritten',
  }),
  (conn) => text('Hello, world!', conn),
  (conn) => {
    console.log('I dont modify the connection at all, I just do some logging'),
    return conn;
  }
])
```

Since the `conn` object is simply modified to achieve a response, and all of the response helper functions provided by `jaris` are automatically curried, we can combine them using the `pipe` helper:

```javascript
import server, { json, status, header } from '@jaris/core';
import { pipe } from '@jaris/util';

server([
  conn =>
    pipe(
      status(200),
      header('X-Custom', 'my value'),
      json({ ok: true }),
    )(conn),
]);
```

Which becomes even more useful when you start making re-usable responses

```javascript
import server, { json, status, header } from '@jaris/core';
import { pipe } from '@jaris/util';

const formErrors = (errors: any) =>
  pipe(
    status(422),
    json({ errors }),
  );

server([
  conn =>
    formErrors({
      name: 'is required',
    })(conn),
]);
```

A simple request-time example:

```javascript
import server, { header } from '@jaris/core';
import { pipe } from '@jaris/util';

const currentTimestamp = () => Math.round((new Date()).getTime() / 1000);

server([
  conn => header('X-Start-Time', `${currentTimestamp()}`),
  conn => {
    // ...perform some relatively long task
    return conn;
  },
  conn => {
    const startTime = parseInt(conn.headers['X-Start-Time']);
    const endTime = currentTimestamp();

    return pipe(
      header('X-End-Time', `${endTime}`)
      header('X-Total-Time', `${endTime - startTime} seconds`)
    )
  }
]);
```
