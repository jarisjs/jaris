import { validatorSuccess, validatorError } from '../helpers';
import { ValidatorReturn } from '../types';

const allowed = (allowedValues: any[]) => (value: any): ValidatorReturn =>
  allowedValues.indexOf(value) !== -1
    ? validatorSuccess()
    : validatorError(`not allowed`);

export default allowed;
