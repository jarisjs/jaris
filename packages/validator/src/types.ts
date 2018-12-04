export interface ValidatorReturnObject {
  ok: boolean;
  next: boolean;
  error?: string | { [key: string]: string[] | string };
}

export type ValidatorReturn = Promise<ValidatorReturnObject>;

export type BoolExpCallback = (property: any) => boolean | Promise<boolean>;

export interface RuleObject {
  [key: string]: ((...args: any[]) => ValidatorReturn)[];
}
