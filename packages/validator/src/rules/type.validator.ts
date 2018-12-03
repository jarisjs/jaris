import { validatorSuccess, validatorError, wrap } from '../index';

export function type(valueType: string) {
  return (value: any) => {
    if (valueType === 'Array') {
      return value instanceof Array
        ? validatorSuccess()
        : validatorError('expected list', false);
    }
    return typeof value === valueType
      ? validatorSuccess()
      : validatorError(`expected ${valueType} but got ${typeof value}`, false);
  };
}

export const number = wrap(type('number'));
export const boolean = wrap(type('boolean'));
export const string = wrap(type('string'));
export const array = wrap(type('Array'));
