import { validatorSuccess } from '../helpers';
import { ValidatorReturn } from '../types';

const optional = () => async (value?: string): ValidatorReturn =>
  typeof value === 'undefined' ? validatorSuccess(false) : validatorSuccess();

export default optional;
