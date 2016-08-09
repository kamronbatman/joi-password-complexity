## Joi Password Complexity

Creates a Joi object that validates password complexity.

## Installation

`npm install joi-password-complexity`

## Example

```
const Joi = require('joi');
const joiPasswordComplexity = require('joi-password-complexity');

Joi.validate('aPassword123!', joiPasswordComplexity(), (err, value) => {
  ...
})
```

with options

```
const Joi = require('joi');
const joiPasswordComplexity = require('joi-password-complexity');

const complexityOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 3,
}

Joi.validate('aPassword123!', joiPasswordComplexity(complexityOptions), (err, value) => {
  ...
})
```

## License

MIT
