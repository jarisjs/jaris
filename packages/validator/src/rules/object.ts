import { validatorSuccess, validatorError } from '../helpers';
import { ValidatorReturn, RuleObject } from '../types';
import validate from '../index';

async function applyRules(rules: RuleObject, obj: object) {
  const { errors } = await validate(obj, rules);
  return errors;
}

export const object = (rules: RuleObject = {}) => {
  return async (obj: object): ValidatorReturn => {
    const formErrors = await applyRules(rules, obj);
    return !formErrors ? validatorSuccess() : validatorError(formErrors);
  };
};
