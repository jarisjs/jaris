import length from './length';

const max = (max: number) => length(0, max, `cannot exceed length of ${max}`);

export default max;
