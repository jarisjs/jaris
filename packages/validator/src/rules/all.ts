import { allP, validatorSuccess, validatorError } from '../helpers';
import { BoolExpCallback } from '../types';

const all = (evaluator: BoolExpCallback) => async (value: any[]) =>
  (await allP(async (elem: any) => await evaluator(elem), value))
    ? validatorSuccess()
    : validatorError('invalid array');

export default all;
