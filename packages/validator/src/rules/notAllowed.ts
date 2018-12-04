import { validatorError, validatorSuccess } from '../helpers';
import { ValidatorReturn } from '../types';

export function notAllowed(disallowedValues: any[]) {
  return (value: any): ValidatorReturn =>
    disallowedValues.indexOf(value) !== -1
      ? validatorError(`not allowed`)
      : validatorSuccess();
}
