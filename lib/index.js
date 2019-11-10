const Joi = require('@hapi/joi');

// pluralize
const p = (word, num) => num === 1
  ? word
  : `${word}s`;

const defaultOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

module.exports = (options = defaultOptions) => {
  const extendWithClosure = Joi.extend({
    type: 'passwordComplexity',
    base: Joi.string(),
    messages: {
      'passwordComplexity.tooShort':
        `"{{#label}}" should be at least ${
          options.min
        } ${p('character', options.min)} long`,
      'passwordComplexity.tooLong':
        `"{{#label}}" should not be longer than ${
          options.max
        } ${p('character', options.max)}`,
      'passwordComplexity.lowercase':
        `"{{#label}}" should contain at least ${
          options.lowerCase
        } lowercased ${p('letter', options.lowerCase)}`,
      'passwordComplexity.uppercase':
        `"{{#label}}" should contain at least ${
          options.upperCase
        } uppercased ${p('letter', options.upperCase)}`,
      'passwordComplexity.numeric':
        `"{{#label}}" should contain at least ${
          options.numeric
        } ${p('number', options.numeric)}`,
      'passwordComplexity.symbol':
        `"{{#label}}" should contain at least ${
          options.symbol
        } ${p('symbol', options.symbol)}`,
      'passwordComplexity.requirementCount':
        `"{{#label}}" must meet at least ${
          options.requirementCount
        } of the complexity requirements`
    },
    validate(value, helpers) {
      const errors = [];

      if (typeof value === 'string') {
        const lowercaseCount = (value.match(/[a-z]/g) || []).length;
        const upperCaseCount = (value.match(/[A-Z]/g) || []).length;
        const numericCount = (value.match(/[0-9]/g) || []).length;
        const symbolCount = (value.match(/[^a-zA-Z0-9]/g) || []).length;

        const meetsMin = options.min && value.length >= options.min;
        const meetsMax = options.max && value.length <= options.max;

        const meetsLowercase = lowercaseCount >= options.lowerCase;
        const meetsUppercase = upperCaseCount >= options.upperCase;
        const meetsNumeric = numericCount >= options.numeric;
        const meetsSymbol = symbolCount >= options.symbol;

        const maxRequirement = (options.lowerCase > 0) + (options.upperCase > 0) +
          (options.numeric > 0) + (options.symbol > 0);

        const requirementCount = Math.min(
          Math.max(parseInt(options.requirementCount, 10) || maxRequirement, 1),
          maxRequirement,
        );

        const requirementErrors = [];

        if (!meetsMin) errors.push(helpers.error('passwordComplexity.tooShort', { value }));
        if (!meetsMax) errors.push(helpers.error('passwordComplexity.tooLong', { value }));
        if (!meetsLowercase) {
          requirementErrors.push(helpers.error('passwordComplexity.lowercase', { value }));
        }
        if (!meetsUppercase) {
          requirementErrors.push(helpers.error('passwordComplexity.uppercase', { value }));
        }
        if (!meetsNumeric) {
          requirementErrors.push(helpers.error('passwordComplexity.numeric', { value }));
        }
        if (!meetsSymbol) {
          requirementErrors.push(helpers.error('passwordComplexity.symbol', { value }));
        }

        if (maxRequirement - requirementErrors.length < requirementCount) {
          errors.push(...requirementErrors);
          if (requirementCount < maxRequirement) {
            errors.push(helpers.error('passwordComplexity.requirementCount', { value }));
          }
        }
      }

      return {
        value,
        errors: errors.length ? errors : null,
      };
    },
  });

  return extendWithClosure.passwordComplexity();
};