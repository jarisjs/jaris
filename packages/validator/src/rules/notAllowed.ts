import { validatorError, validatorSuccess } from '../helpers';
import { ValidatorReturn } from '../types';

const notAllowed = (disallowedValues: any[]) => (value: any): ValidatorReturn =>
  disallowedValues.indexOf(value) !== -1
    ? validatorError(`not allowed`)
    : validatorSuccess();

export default notAllowed;
