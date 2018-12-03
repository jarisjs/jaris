import { validatorSuccess, validatorError, ValidatorReturn } from '../index';

export function exists(existingValues: any[]) {
  return (value: any): ValidatorReturn =>
    existingValues.indexOf(value) !== -1
      ? validatorSuccess()
      : validatorError(`does not exist`);
}
