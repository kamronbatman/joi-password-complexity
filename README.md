## Joi Password Complexity

Creates a Joi object that validates password complexity.

## Requirements

- Joi v17 or higher

## Installation

`npm install joi-password-complexity`

## Examples

### No options specified

```javascript
const passwordComplexity = require("joi-password-complexity");
passwordComplexity().validate("aPassword123!");
```

When no options are specified, the following are used:

```javascript
{
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
}
```

### Options specified

```javascript
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
  min: 10,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 2,
};

passwordComplexity(complexityOptions).validate("aPassword123!");
```

### Error Label (optional) Specified

```javascript
const label = "Password"

const passwordComplexity = require("joi-password-complexity");
```
- For default options:

```javascript
passwordComplexity(undefined, label).validate("aPassword123!");
```

- For specified options:

```javascript
passwordComplexity(complexityOptions, label).validate("aPassword123!");
```

The resulting error message:
'Password should be at least 8 characters long'

## License

MIT
