declare module 'joi-password-complexity'{
  import { ValidationError } from '@hapi/joi';

  export type ComplexityOptions = {
    min?: number,
    max?: number,
    lowerCase?: number,
    upperCase?: number,
    numeric?: number,
    symbol?: number,
    requirementCount?: number,
  };

  export type ComplexityObject = {
    type: string,
    base: string,
    messages: {
      'passwordComplexity.tooShort': string,
      'passwordComplexity.tooLong': string,
      'passwordComplexity.lowercase': string,
      'passwordComplexity.uppercase': string,
      'passwordComplexity.numeric': string,
      'passwordComplexity.symbol': string,
      'passwordComplexity.requirementCount': string,
    },
    validate: (value: string) => {
      value: string
      error: ValidationError | undefined,
    };
  };

  export default function (options: ComplexityOptions, label?: string): ComplexityObject;
}
