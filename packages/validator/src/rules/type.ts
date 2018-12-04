import { validatorSuccess, validatorError } from '../helpers';

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
