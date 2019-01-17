# jaris

**jaris is still in very early alpha, production usage is not recommended**

Jaris. A (soon-to-be) 0 dependency, functional (phoenix) inspired, node / typescript web framework.

# Concepts

The core concept behind `jaris` is that the `conn` object gets passed through a series of functions (middleware), and the final resulting `conn` determines what is sent.

The `conn` object should never be mutated directly, only copied via spread (`...conn`), or modified using one of the conn helper functions provided.

A simple hello world would look like:

```javascript
import server, { text } from '@jaris/core';

server([conn => text('Hello, world!', conn)]);
```

Documentation is still a WIP but you can read more by clicking into the packages and reading their `README` files.

- [@jaris/core]()
- [@jaris/router]()
- [@jaris/validator]()
- [@jaris/util]()
