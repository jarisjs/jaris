import { validatorSuccess, validatorError } from '../helpers';
import { BoolExpCallback } from '../types';

const lambda = (
  evaluator: BoolExpCallback,
  message = 'invalid value',
) => async (property: any) =>
  (await evaluator(property)) ? validatorSuccess() : validatorError(message);

export default lambda;
