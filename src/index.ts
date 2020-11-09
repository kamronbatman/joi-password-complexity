import Joi, { CustomHelpers, Extension } from 'joi';

// pluralize
const p = (word: string, num = 0): string => (num === 1 ? word : `${word}s`);
const isPositive = (num = 0): number => Number(num > 0);
const clamp = (value: number, min: number, max: number): number => (value < min ? min : value > max ? max : value);

const defaultOptions: ComplexityOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

export interface JoiPasswordComplexity extends Joi.StringSchema {
  passwordComplexity(): this;
}

export interface ComplexityOptions {
  min?: number;
  max?: number;
  lowerCase?: number;
  upperCase?: number;
  numeric?: number;
  symbol?: number;
  requirementCount?: number;
}

export default ({
  min = 0,
  max = 0,
  lowerCase = 0,
  upperCase = 0,
  numeric = 0,
  symbol = 0,
  requirementCount = 0,
}: ComplexityOptions = defaultOptions, label = '{{#label}}'): JoiPasswordComplexity => {
  const joiPasswordComplexity: Extension = {
    type: 'passwordComplexity',
    base: Joi.string(),
    messages: {
      'passwordComplexity.tooShort':
        `${label} should be at least ${min} ${p('character', min)} long`,
      'passwordComplexity.tooLong':
        `${label} should not be longer than ${max} ${p('character', max)}`,
      'passwordComplexity.lowercase':
        `${label} should contain at least ${lowerCase} lower-cased ${p('letter', lowerCase)}`,
      'passwordComplexity.uppercase':
        `${label} should contain at least ${upperCase} upper-cased ${p('letter', upperCase)}`,
      'passwordComplexity.numeric':
        `${label} should contain at least ${numeric} ${p('number', numeric)}`,
      'passwordComplexity.symbol':
        `${label} should contain at least ${symbol} ${p('symbol', symbol)}`,
      'passwordComplexity.requirementCount':
        `${label} must meet at least ${requirementCount} of the complexity requirements`,
    },
    validate: (value: unknown, helpers: CustomHelpers) => {
      const errors = [];

      if (typeof value === 'string') {
        const lowercaseCount = value.match(/[a-z]/g)?.length ?? 0;
        const upperCaseCount = value.match(/[A-Z]/g)?.length ?? 0;
        const numericCount = value.match(/[0-9]/g)?.length ?? 0;
        const symbolCount = value.match(/[^a-zA-Z0-9]/g)?.length ?? 0;

        const meetsMin = min && value.length >= min;
        const meetsMax = max && value.length <= max;

        const meetsLowercase = lowercaseCount >= (lowerCase);
        const meetsUppercase = upperCaseCount >= (upperCase);
        const meetsNumeric = numericCount >= (numeric);
        const meetsSymbol = symbolCount >= (symbol);

        const maxRequirement = isPositive(lowerCase) + isPositive(upperCase) +
          isPositive(numeric) + isPositive(symbol);

        const requirement = clamp(requirementCount || maxRequirement, 1, maxRequirement);

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

  return (Joi.extend(joiPasswordComplexity) as JoiPasswordComplexity).passwordComplexity();
};
