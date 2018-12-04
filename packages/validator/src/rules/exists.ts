import { validatorSuccess, validatorError } from '../helpers';
import { ValidatorReturn } from '../types';

export function exists(existingValues: any[]) {
  return (value: any): ValidatorReturn =>
    existingValues.indexOf(value) !== -1
      ? validatorSuccess()
      : validatorError(`does not exist`);
}
