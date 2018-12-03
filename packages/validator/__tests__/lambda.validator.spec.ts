import * as R from 'ramda';
import lambda from './lambda.validator';
import { allP, anyP } from '../helpers/promise.helper';

describe('lambda', () => {
  it('should properly validate when callback is boolean', async done => {
    const closure = (value: number) => value < 10;
    const nums = R.range(0, 9);
    expect(await allP(async num => (await lambda(closure)(num)).ok, nums)).toBe(
      true,
    );
    const moreNums = R.range(10, 20);
    expect(
      await anyP(async num => (await lambda(closure)(num)).ok, moreNums),
    ).toBe(false);
    done();
  });

  it('should properly validate when callback is promise that returns boolean', async done => {
    const closure = async (value: number) => await Promise.resolve(value < 10);
    const nums = R.range(0, 9);
    expect(await allP(async num => (await lambda(closure)(num)).ok, nums)).toBe(
      true,
    );
    const moreNums = R.range(10, 20);
    expect(
      await anyP(async num => (await lambda(closure)(num)).ok, moreNums),
    ).toBe(false);
    done();
  });
});
