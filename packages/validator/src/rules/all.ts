import { allP } from '../helpers';
import { validatorSuccess, validatorError } from '../helpers';
import { BoolExpCallback } from '../types';

export const all = (evaluator: BoolExpCallback) => async (value: any[]) =>
  (await allP(async (elem: any) => await evaluator(elem), value))
    ? validatorSuccess()
    : validatorError('invalid array');
