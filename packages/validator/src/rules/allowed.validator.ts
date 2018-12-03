import { ValidatorReturn, validatorSuccess, validatorError } from '../index';

export function allowed(allowedValues: any[]) {
  return (value: any): ValidatorReturn =>
    allowedValues.indexOf(value) !== -1
      ? validatorSuccess()
      : validatorError(`not allowed`);
}
