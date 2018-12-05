import { validatorSuccess, validatorError } from '../helpers';

const regex = (pattern: string) => (value: string) =>
  RegExp(pattern).test(value)
    ? validatorSuccess()
    : validatorError('invalid value');

export default regex;
