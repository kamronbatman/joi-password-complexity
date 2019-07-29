const path = require('path');

/* eslint-disable import/no-dynamic-require */
const Any = require(path.join(path.dirname(require.resolve('@hapi/joi')), 'types/any/index.js'));
const Language = require(path.join(path.dirname(require.resolve('@hapi/joi')), 'language.js'));
/* eslint-enable */

const defaultOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

const PasswordComplexity = class extends Any {
  constructor(options) {
    super();
    this._type = 'string';
    this._invalids.add('');

    this._options = options || defaultOptions;
    if (options && !options.requirementCount) {
      this._options.requirementCount = (options.lowerCase > 0) +
      (options.upperCase > 0) + (options.numeric > 0) + (options.symbol > 0);
    }
  }

  clone() {
    const clone = super.clone();

    clone._options = {};

    clone._options.min = this._options.min;
    clone._options.max = this._options.max;
    clone._options.lowerCase = this._options.lowerCase;
    clone._options.upperCase = this._options.upperCase;
    clone._options.numeric = this._options.numeric;
    clone._options.symbol = this._options.symbol;
    clone._options.requirementCount = this._options.requirementCount;

    return clone;
  }

  _base(value, state, options) {
    const errors = [];

    if (typeof value === 'string') {
      const lowercaseCount = (value.match(/[a-z]/g) || []).length;
      const upperCaseCount = (value.match(/[A-Z]/g) || []).length;
      const numericCount = (value.match(/[0-9]/g) || []).length;
      const symbolCount = (value.match(/[^a-zA-Z0-9]/g) || []).length;

      const meetsMin = this._options.min && value.length >= this._options.min;
      const meetsMax = this._options.max && value.length <= this._options.max;
      const meetsLowercase = lowercaseCount >= this._options.lowerCase;
      const meetsUppercase = upperCaseCount >= this._options.upperCase;
      const meetsNumeric = numericCount >= this._options.numeric;
      const meetsSymbol = symbolCount >= this._options.symbol;
      const meetsRequirementCount = !this._options.requirementCount ||
        meetsLowercase + meetsUppercase + meetsNumeric + meetsSymbol >= this._options.requirementCount;

      if (!meetsMin) errors.push(this.createError('passwordComplexity.tooShort', { value }, state, options));
      if (!meetsMax) errors.push(this.createError('passwordComplexity.tooLong', { value }, state, options));
      if (!meetsLowercase) errors.push(this.createError('passwordComplexity.lowercase', { value }, state, options));
      if (!meetsUppercase) errors.push(this.createError('passwordComplexity.uppercase', { value }, state, options));
      if (!meetsNumeric) errors.push(this.createError('passwordComplexity.numeric', { value }, state, options));
      if (!meetsSymbol) errors.push(this.createError('passwordComplexity.symbol', { value }, state, options));
      if (!meetsRequirementCount) {
        errors.push(this.createError('passwordComplexity.requirementCount', { value }, state, options));
      }
    }

    return {
      value,
      errors: errors.length ? errors : null,
    };
  }
};

Language.errors.passwordComplexity = {
  base: 'must meet password complexity requirements',
  tooShort: 'is too short',
  tooLong: 'is too long',
  lowercase: 'doesn\'t contain the required lowercase characters',
  uppercase: 'doesn\'t contain the required uppercase characters',
  numeric: 'doesn\'t contain the required numeric characters',
  symbol: 'doesn\'t contain the required symbols',
  requirementCount: 'must meet enough of the complexity requirements',
};

module.exports = PasswordComplexity;
