const Joi = require('@hapi/joi');

// pluralize
const p = (word, num) => (num === 1 ? word : `${word}s`);

const defaultOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

module.exports = ({
  min,
  max,
  lowerCase,
  upperCase,
  numeric,
  symbol,
  requirementCount,
} = defaultOptions, label) => {
  const joiPasswordComplexity = {
    type: 'passwordComplexity',
    base: Joi.string(),
    messages: {
      'passwordComplexity.tooShort':
        `${label || '{{#label}}'} should be at least ${min} ${p('character', min)} long`,
      'passwordComplexity.tooLong':
        `${label || '{{#label}}'} should not be longer than ${max} ${p('character', max)}`,
      'passwordComplexity.lowercase':
        `${label || '{{#label}}'} should contain at least ${lowerCase} lower-cased ${p('letter', lowerCase)}`,
      'passwordComplexity.uppercase':
        `${label || '{{#label}}'} should contain at least ${upperCase} upper-cased ${p('letter', upperCase)}`,
      'passwordComplexity.numeric':
        `${label || '{{#label}}'} should contain at least ${numeric} ${p('number', numeric)}`,
      'passwordComplexity.symbol':
        `${label || '{{#label}}'} should contain at least ${symbol} ${p('symbol', symbol)}`,
      'passwordComplexity.requirementCount':
        `${label || '{{#label}}'} must meet at least ${requirementCount} of the complexity requirements`,
    },
    validate: (value, helpers) => {
      const errors = [];

      if (typeof value === 'string') {
        const lowercaseCount = (value.match(/[a-z]/g) || []).length;
        const upperCaseCount = (value.match(/[A-Z]/g) || []).length;
        const numericCount = (value.match(/[0-9]/g) || []).length;
        const symbolCount = (value.match(/[^a-zA-Z0-9]/g) || []).length;

        const meetsMin = min && value.length >= min;
        const meetsMax = max && value.length <= max;

        const meetsLowercase = lowercaseCount >= lowerCase;
        const meetsUppercase = upperCaseCount >= upperCase;
        const meetsNumeric = numericCount >= numeric;
        const meetsSymbol = symbolCount >= symbol;

        const maxRequirement = (lowerCase > 0) + (upperCase > 0) +
          (numeric > 0) + (symbol > 0);

        const requirement = Math.min(
          Math.max(parseInt(requirementCount, 10) || maxRequirement, 1),
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

        if (maxRequirement - requirementErrors.length < requirement) {
          errors.push(...requirementErrors);
          if (requirement < maxRequirement) {
            errors.push(helpers.error('passwordComplexity.requirementCount', { value }));
          }
        }
      }

      return {
        value,
        errors: errors.length ? errors : null,
      };
    },
  };

  return Joi.extend(joiPasswordComplexity).passwordComplexity();
};
