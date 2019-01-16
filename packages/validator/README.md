# `@jaris/validator`

Easily validate any data using an easily testable and extendable approach. AKA plain functions.

## Usage

```javascript
import validate from '@jaris/validator';
import { optional, required, string, object } from '@jaris/validator/rules';

const userController = {
  async store(ctx) {
    const { data, errors } = await validate(ctx.request.body, {
      firstName: [required(), string()],
      lastName: [optional(), string()],
      team: [
        optional(),
        object({
          name: [string()],
          sport: [string()],
        }),
      ],
    });

    if (errors) {
      return errorResponse(errors);
    }

    const user = createSomeUser(data);

    return successResponse(user);
  },
};

export default userController;
```

## Available Rules

- all
- allowed
- array
- boolean
- exists
- hexColor
- lambda
- length
- max
- min
- notAllowed
- notExists
- number
- object
- optional
- regex
- required
- requiredWith
- string
- type

### all

When you want to check that all items in an array meet a certain condition.

```javascript
await validate(
  { evenNumbers: [2, 4, 6] },
  {
    evenNumbers: [array(), all(item => item % 2 === 0)],
  },
);
```

### allowed

Makes sure that the item being validated is in the provided array

```javascript
await validate(
  { day: 'Saturday' },
  {
    day: [string(), allowed(['Saturday', 'Sunday'])],
  },
);
```

### array

Makes sure that the value being validated is an array

```javascript
await validate(
  { days: ['Monday', 'Wednesday'] },
  {
    day: [array()],
  },
);
```

### boolean

Makes sure that the value being validated is either true or false

```javascript
await validate(
  { termsOfService: true },
  {
    termsOfService: [boolean()],
  },
);
```

### exists

Alias of `allowed`

### hexColor

Checks that the value being validated is a hex color

```javascript
await validate(
  { color: '#AFAFAF' },
  {
    color: [hexColor()],
  },
);
```

### lambda

Takes a function that gets the value being validated passed as the first argument and either returns true or false.

```javascript
await validate(
  { username: 'nehero' },
  {
    username: [lambda(username => usernameDoesntExist(username))],
  },
);
```

### length

Verifies that the value being validated is of a certain length.

```javascript
await validate(
  { username: 'nehero' },
  {
    username: [length(0, 64)],
  },
);
```

### max

Verifies that the value being validated is not greater than the provided value

```javascript
await validate(
  { username: 'nehero' },
  {
    username: [max(64)],
  },
);
```

### min

Verifies that the value being validated is not less than the provided value

```javascript
await validate(
  { username: 'nehero' },
  {
    username: [min(0)],
  },
);
```

### notAllowed

Verifies that the value being validated is not in the provided array

```javascript
await validate(
  { day: 'Tuesday' },
  {
    day: [notAllowed(['Saturday', 'Sunday'])],
  },
);
```

### notExists

alias of notAllowed

### number

Verifies that the value being validated is of type `number`

```javascript
await validate(
  { day: 16 },
  {
    day: [number()],
  },
);
```

### object

Verifies that the value being validated is of type `object` and allows you to test any keys.

```javascript
await validate(
  { team: { name: 'Test Team', userIds: [4, 5, 6] } },
  {
    team: [
      required(),
      object({
        name: [required(), string()],
        userIds: [required(), array(), all(userId => userIdExists(id))],
      }),
    ],
  },
);
```

### optional

Allows the value to not be present in the body. Note that `null` and other falsy values still count as being present. Does not continue on with other validators in the same array if value isn't present.

```javascript
await validate(
  { firstName: 'Ozzie' },
  {
    firstName: [required(), string()],
    lastName: [optional(), string()],
  },
);
```

### regex

Allows the value to be tested against a regex pattern.

```javascript
await validate(
  { username: 'nehero' },
  {
    username: [regex(/[A-Za-z0-9]+/g)],
  },
);
```

### required

Ensures that the value is present in the body

```javascript
await validate(
  { firstName: 'Ozzie' },
  {
    firstName: [required(), string()],
    lastName: [optional(), string()],
  },
);
```

### requiredWith

Only marks the value as required if the other key specified is present on the body. Works with nested values using `dot` syntax.

```javascript
await validate(
  { firstName: 'Ozzie' },
  {
    firstName: [required(), string()],
    lastName: [requiredWith('team.name'), string()],
    team: [
      optional(),
      object({
        name: [string()],
      }),
    ],
  },
);
```

### string

Ensures the value is a string.

```javascript
await validate(
  { firstName: 'Ozzie' },
  {
    firstName: [required(), string()],
  },
);
```

### type

Ensures the value is of the provided type. Evaluated using `typeof`. For array either use `array()` helper or pass in `Array`.

```javascript
await validate(
  { firstName: 'Ozzie' },
  {
    firstName: [required(), type('string')],
  },
);
```
