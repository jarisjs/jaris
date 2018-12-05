import { validatorSuccess, validatorError } from '../helpers';

const type = (valueType: string) => (value: any) => {
  if (valueType === 'Array') {
    return value instanceof Array
      ? validatorSuccess()
      : validatorError('expected list', false);
  }
  return typeof value === valueType
    ? validatorSuccess()
    : validatorError(`expected ${valueType} but got ${typeof value}`, false);
};

export default type;
