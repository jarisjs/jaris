import { validatorSuccess, validatorError } from '../helpers';
import { ValidatorReturn } from '../types';

const exists = (existingValues: any[]) => (value: any): ValidatorReturn =>
  existingValues.indexOf(value) !== -1
    ? validatorSuccess()
    : validatorError(`does not exist`);

export default exists;
