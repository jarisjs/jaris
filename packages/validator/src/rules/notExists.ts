import { validatorError, validatorSuccess } from '../helpers';
import { ValidatorReturn } from '../types';

const notExists = (existingValues: any[]) => (value: any): ValidatorReturn =>
  existingValues.indexOf(value) !== -1
    ? validatorError(`already exists`)
    : validatorSuccess();

export default notExists;
