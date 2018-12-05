import length from './length';

const min = (min: number) =>
  length(min, Infinity, `needs to have length of at least ${min}`);

export default min;
