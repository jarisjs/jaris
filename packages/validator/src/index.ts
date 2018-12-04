export * from './rules';
export * from './types';
export { validatorError, validatorSuccess } from './helpers';

//TODO rewrite this, eliminate for loops
const validate = async (data: any, rules: any) => {
  const errors = {};

  const fieldNames = Object.keys(rules);

  let returnData = {};

  for (let i = 0; i < fieldNames.length; i++) {
    const validators = rules[fieldNames[i]];
    const value = data[fieldNames[i]];

    for (let x = 0; x < validators.length; x++) {
      const response = await validators[x](value, data);

      if (response.error) {
        if (typeof response.error === 'object') {
          errors[fieldNames[i]] = response.error;
        } else {
          errors[fieldNames[i]] = errors[fieldNames[i]] || [];
          errors[fieldNames[i]].push(response.error);
        }
      }

      if (response.ok) {
        returnData[fieldNames[i]] = data[fieldNames[i]];
      }

      if (response.next === false) {
        break;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      data: null,
      errors,
    };
  }

  return {
    data,
    errors: null,
  };
};

export default validate;
