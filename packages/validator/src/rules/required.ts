import { validatorError, validatorSuccess } from '../helpers';
import { ValidatorReturn } from '../types';

const required = () => async (value: any): ValidatorReturn =>
  value === null || value === undefined
    ? validatorError('is required', false)
    : validatorSuccess();

export default required;
