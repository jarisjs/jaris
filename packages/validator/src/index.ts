export * from './rules';
export * from './types';
export { validatorError, validatorSuccess } from './helpers';

//TODO rewrite this, eliminate for loops
const validate = async (data: any, rules: any) => {
  const errors = {};

  const fieldNames = Object.keys(rules);

  let returnData = {};

  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i];
    const validators = rules[fieldName];
    const value = data[fieldName];

    for (let x = 0; x < validators.length; x++) {
      const response = await validators[x](value, data);

      if (response.error) {
        if (typeof response.error === 'object') {
          errors[fieldName] = response.error;
        } else {
          errors[fieldName] = [...(errors[fieldName] || []), response.error];
        }
      }

      if (response.ok) {
        returnData[fieldName] = data[fieldName];
      }

      if (response.next === false) {
        break;
      }
    }
  }

  return Object.keys(errors).length > 0
    ? {
        data: null,
        errors,
      }
    : {
        data,
        errors: null,
      };
};

export default validate;
