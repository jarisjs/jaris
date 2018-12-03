import validate, {
  ValidatorReturn,
  validatorSuccess,
  validatorError,
} from '../index';

export interface RuleObject {
  [key: string]: ((...args: any[]) => ValidatorReturn)[];
}

async function applyRules(rules: RuleObject, obj: object) {
  const { errors } = await validate(obj, rules);
  return errors;
}

const object = (rules: RuleObject = {}) => {
  return async (obj: object): ValidatorReturn => {
    const formErrors = await applyRules(rules, obj);
    return !formErrors ? validatorSuccess() : validatorError(formErrors);
  };
};

export default object;
