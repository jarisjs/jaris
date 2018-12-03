export interface ValidatorReturnObject {
  ok: boolean;
  next: boolean;
  error?: string | { [key: string]: string[] | string };
}

export type ValidatorReturn = Promise<ValidatorReturnObject>;

export async function validatorSuccess(next: boolean = true): ValidatorReturn {
  return {
    ok: true,
    next,
  };
}

export async function validatorError(
  error: string | { [key: string]: string[] | string },
  next: boolean = true,
): ValidatorReturn {
  return {
    ok: false,
    next,
    error,
  };
}

export function wrap(value: any) {
  return () => value;
}

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
