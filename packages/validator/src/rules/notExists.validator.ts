import { validatorError, ValidatorReturn, validatorSuccess } from '../index';

export function notExists(existingValues: any[]) {
  return (value: any): ValidatorReturn =>
    existingValues.indexOf(value) !== -1
      ? validatorError(`already exists`)
      : validatorSuccess();
}
