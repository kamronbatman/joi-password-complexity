declare module 'joi-password-complexity'{

  import { Expression } from 'objection';

  export type Types = 'any' | 'alternatives' | 'array' | 'boolean' | 'binary' | 'date' | 'function' | 'lazy' | 'number' | 'object' | 'string';

  type ComplexityOptions = {
    min?: number,
    max?: number,
    lowerCase?: number,
    upperCase?: number,
    numeric?: number,
    symbol?: number,
    requirementCount?: number,
  };

  interface Context {
    [key: string]: any;
    key?: string;
    label?: string;
  }

  type LanguageOptions = string | boolean | null | {
    [key: string]: LanguageOptions;
  };

  type LanguageRootOptions = {
    root?: string;
    key?: string;
    messages?: { wrapArrays?: boolean; };
  } & Partial<Record<Types, LanguageOptions>> & { [key: string]: LanguageOptions; };

  interface ValidationOptions {
    abortEarly?: boolean;
    convert?: boolean;
    allowUnknown?: boolean;
    skipFunctions?: boolean;
    stripUnknown?: boolean | { arrays?: boolean; objects?: boolean };
    language?: LanguageRootOptions;
    presence?: 'optional' | 'required' | 'forbidden';
    context?: Context;
    noDefaults?: boolean;
  }

  interface ValidationErrorItem {
    message: string;
    type: string;
    path: string[];
    options?: ValidationOptions;
    context?: Context;
  }

  interface ValidationError extends Error {
    details: ValidationErrorItem[];
    annotate(): string;
    _object: any;
  }

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
    validate: (value: string | Expression<string>) => {
      value: string
      error?: ValidationError,
    };
  };

  export default function (options: ComplexityOptions, label?: string): ComplexityObject;
}
