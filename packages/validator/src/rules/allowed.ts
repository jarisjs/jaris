import { validatorSuccess, validatorError } from '../helpers';
import { ValidatorReturn } from '../types';

export function allowed(allowedValues: any[]) {
  return (value: any): ValidatorReturn =>
    allowedValues.indexOf(value) !== -1
      ? validatorSuccess()
      : validatorError(`not allowed`);
}
