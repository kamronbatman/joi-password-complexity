## Joi Password Complexity

Creates a Joi object that validates password complexity.

## Installation

`npm install joi-password-complexity`

## Example

### No options specified

```javascript
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');

Joi.validate('aPassword123!', new PasswordComplexity(), (err, value) => {
  //...
})
```

When no options are specified, the following are used:
```javascript
{
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1
}
```

### Options specified

```javascript
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');

const complexityOptions = {
  min: 10,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1
}

Joi.validate('aPassword123!', new PasswordComplexity(complexityOptions), (errors, value) => {
  //...
})
```

## License

MIT
