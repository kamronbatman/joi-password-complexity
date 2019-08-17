const Joi = require('@hapi/joi');

const PasswordComplexity = require('../lib/index');

describe('JoiPasswordComplexity', () => {
  it('should reject a password that is too short', () => {
    const password = '123';

    const result = Joi.validate(password, new PasswordComplexity());
    const errors = result.error.details.filter((e) => e.type === 'passwordComplexity.tooShort');
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('"value" is too short');
  });
  it('should reject a password that is too long', () => {
    const password = '123456791234567912345679123';

    const result = Joi.validate(password, new PasswordComplexity());
    const errors = result.error.details.filter((e) => e.type === 'passwordComplexity.tooLong');

    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('"value" is too long');
  });

  it('should reject a password that doesn\'t meet the required lowercase count', () => {
    const password = 'ABCDEFG';

    const result = Joi.validate(password, new PasswordComplexity());
    const errors = result.error.details.filter((e) => e.type === 'passwordComplexity.lowercase');

    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('"value" doesn\'t contain the required lowercase characters');
  });

  it('should reject a password that doesn\'t meet the required uppercase count', () => {
    const password = 'abcdefg';

    const result = Joi.validate(password, new PasswordComplexity());
    const errors = result.error.details.filter((e) => e.type === 'passwordComplexity.uppercase');

    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('"value" doesn\'t contain the required uppercase characters');
  });

  it('should reject a password that doesn\'t meet the required numeric count', () => {
    const password = 'ABCDEFG';

    const result = Joi.validate(password, new PasswordComplexity());
    const errors = result.error.details.filter((e) => e.type === 'passwordComplexity.numeric');

    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('"value" doesn\'t contain the required numeric characters');
  });

  it('should reject a password that doesn\'t meet the required symbol count', () => {
    const password = 'ABCDEFG';

    const result = Joi.validate(password, new PasswordComplexity());
    const errors = result.error.details.filter((e) => e.type === 'passwordComplexity.symbol');

    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('"value" doesn\'t contain the required symbols');
  });

  it('should accept a valid password with default options', () => {
    const password = 'abCD12#$';
    const result = Joi.validate(password, new PasswordComplexity());

    expect(result.error).toBeNull();
  });

  it('should accept a password that meets a requirement count', () => {
    const password = 'Password123';
    const result = Joi.validate(password, new PasswordComplexity({
      min: 8,
      max: 30,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 3,
    }));

    expect(result.error).toBeNull();
  });

  it('should accept a password that has no requirement count', () => {
    const password = 'Password123';
    const result = Joi.validate(password, new PasswordComplexity({
      min: 8,
      max: 30,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 0,
      requirementCount: 0,
    }));

    expect(result.error).toBeNull();
  });

  it('should reject a password that fails other requirements without a requirement count', () => {
    const password = 'Password';
    const result = Joi.validate(password, new PasswordComplexity({
      min: 8,
      max: 30,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 0,
      requirementCount: 0,
    }));

    const errors = result.error.details.filter((e) => e.type === 'passwordComplexity.numeric');

    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('"value" doesn\'t contain the required numeric characters');
  });

  it('should treat a requirement count that is higher than 4 as no requirement count', () => {
    const password = 'Password12';
    const result = Joi.validate(password, new PasswordComplexity({
      min: 8,
      max: 30,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 0,
      requirementCount: 100,
    }));

    expect(result.error).toBeNull();
  });
});
