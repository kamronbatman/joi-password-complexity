const Joi = require('joi');
const PasswordComplexity = require('../lib/index');

describe('JoiPasswordComplexity defaultOptions', () => {
    /*
    *   Meets Length
    */
    it('should reject a password that is too short', () => {
        const password = "123";

        const result = Joi.validate(password, new PasswordComplexity());
        const errors = result.error.details.filter(e => {
            return e.type === "passwordComplexity.tooShort";
        });
        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe('"value" is too short');

    });
    it('should reject a password that is too long', () => {
        const password = "123456791234567912345679123";

        const result = Joi.validate(password, new PasswordComplexity());
        const errors = result.error.details.filter(e => {
            return e.type === "passwordComplexity.tooLong";
        });

        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe('"value" is too long');
    });

    /*
    *   Lower case / uppercase reqs
    */
    it(`should reject a password that doesn't meet the required lowercase count`, () => {
        const password = "ABCDEFG";

        const result = Joi.validate(password, new PasswordComplexity());
        const errors = result.error.details.filter(e => {
            return e.type === "passwordComplexity.lowercase";
        });

        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe(`"value" doesn't contain the required lowercase characters`);
    });
    it(`should reject a password that doesn't meet the required uppercase count`, () => {
        const password = "abcdefg";

        const result = Joi.validate(password, new PasswordComplexity());
        const errors = result.error.details.filter(e => {
            return e.type === "passwordComplexity.uppercase";
        });

        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe(`"value" doesn't contain the required uppercase characters`);
    });

    /*
    *  Numeric & symbol
    * */
    it(`should reject a password that doesn't meet the required numeric count`, () => {
        const password = "ABCDEFG";

        const result = Joi.validate(password, new PasswordComplexity());
        const errors = result.error.details.filter(e => {
            return e.type === "passwordComplexity.numeric";
        });

        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe(`"value" doesn't contain the required numeric characters`);
    });

    it(`should reject a password that doesn't meet the required symbol count`, () => {
        const password = "ABCDEFG";

        const result = Joi.validate(password, new PasswordComplexity());
        const errors = result.error.details.filter(e => {
            return e.type === "passwordComplexity.symbol";
        });

        expect(errors.length).toBe(1);
        expect(errors[0].message).toBe(`"value" doesn't contain the required symbols`);
    });

    /*
    *   Good password
    * */
    it('should accept a valid password', () => {
        const password = "abCD12#$";
        const result = Joi.validate(password, new PasswordComplexity());

        expect(result.error).toBeNull();
    });
});