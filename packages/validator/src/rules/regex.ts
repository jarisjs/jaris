import { validatorSuccess, validatorError } from '../helpers';

export function regex(pattern: string) {
  return (value: string) =>
    RegExp(pattern).test(value)
      ? validatorSuccess()
      : validatorError('invalid value');
}
