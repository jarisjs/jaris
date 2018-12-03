import { validatorError, ValidatorReturn, validatorSuccess } from '../index';

export function notAllowed(disallowedValues: any[]) {
  return (value: any): ValidatorReturn =>
    disallowedValues.indexOf(value) !== -1
      ? validatorError(`not allowed`)
      : validatorSuccess();
}
