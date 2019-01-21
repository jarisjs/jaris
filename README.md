# jaris

**jaris is still in very early alpha, production usage is not recommended**

# Features

- 🔒 0 Dependencies
- 🤓 Functional (encourages function composition, immutable data flow)
- 🐦 Inspired by [Phoenix](https://github.com/phoenixframework/phoenix) (`conn` pipeline)

# Concepts

The core concept behind `jaris` is that the `conn` object gets passed through a series of functions (middleware), and the final resulting `conn` determines what is sent.

The `conn` object should never be mutated directly, only copied via spread (`...conn`), or modified using one of the conn helper functions provided.

A simple hello world would look like:

```javascript
import server, { text } from '@jaris/core';

server([conn => text('Hello, world!', conn)]);
```

Documentation is still a WIP but you can read more by clicking into the packages and reading their `README` files.

- [@jaris/core](https://github.com/jarisjs/jaris/tree/master/packages/core)
- [@jaris/router](https://github.com/jarisjs/jaris/tree/master/packages/router)
- [@jaris/validator](https://github.com/jarisjs/jaris/tree/master/packages/validator)
- [@jaris/util](https://github.com/jarisjs/jaris/tree/master/packages/util)
