const path = require('path');
const Any = require(path.join(path.dirname(require.resolve('joi')), 'types/any/index.js'));
const Language = require(path.join(path.dirname(require.resolve('joi')), 'language.js'));

const defaultOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 3,
};

const PasswordComplexity = class extends Any {
  constructor(options) {
    super();
    this._type = 'string';
    this._invalids.add('');

    this._options = options || defaultOptions;
    if (options && !options.requirementCount) {
      this._options.requirementCount = (options.lowerCase > 0)
      + (options.upperCase > 0) + (options.numeric > 0) + (options.symbol > 0);
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
    let validated = 0;
    let matchMin = false;
    let matchMax = false;

    if (typeof value === 'string') {
      matchMin = this._options.min && value.length >= this._options.min;
      matchMax = this._options.max && value.length <= this._options.max;

      validated += (value.match(/[a-z]/g) || []).length >= this._options.lowerCase;
      validated += (value.match(/[A-Z]/g) || []).length >= this._options.upperCase;
      validated += (value.match(/[0-9]/g) || []).length >= this._options.numeric;
      validated += (value.match(/[^a-zA-Z0-9]/g) || []).length >= this._options.symbol;
    }

    return {
      value,
      errors: (matchMin && matchMax && validated >= this._options.requirementCount) ? null
        : this.createError('passwordComplexity.base', { value }, state, options),
    };
  }
};

Language.errors.passwordComplexity = {
  base: 'must meet password complexity requirements',
};

module.exports = PasswordComplexity;
