import { type } from './type.validator';

describe('type validator', () => {
  it('should return true for primitive types', async done => {
    expect((await type('boolean')(true)).ok).toBe(true);
    expect((await type('string')('true')).ok).toBe(true);
    expect((await type('number')(1)).ok).toBe(true);
    done();
  });

  it('should return false for wrong primitive types', async done => {
    expect((await type('boolean')('true')).ok).toBe(false);
    expect((await type('string')(123)).ok).toBe(false);
    expect((await type('number')('1')).ok).toBe(false);
    done();
  });

  it('should work with arrays', async done => {
    expect((await type('Array')(123)).ok).toBe(false);
    expect((await type('Array')({ 1: 2 })).ok).toBe(false);
    expect((await type('Array')([1, 2, 3])).ok).toBe(true);
    expect(
      (await type('Array')([{ a: [1, 2, 3] }, [[[]]], [1, 2, [895845953]]])).ok,
    ).toBe(true);
    done();
  });
});
