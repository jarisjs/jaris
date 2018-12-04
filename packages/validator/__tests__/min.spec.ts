import { min } from '../src/rules/min';

describe('min', () => {
  it('should return success when the value is more than the min length required', async done => {
    expect(await min(2)('abc')).toHaveProperty('ok', true);
    expect(await min(2)([1, 2, 3])).toHaveProperty('ok', true);
    done();
  });

  it('should return success when the value is the min length required', async done => {
    expect(await min(2)('ab')).toHaveProperty('ok', true);
    expect(await min(2)([1, 2])).toHaveProperty('ok', true);
    done();
  });

  it('should return failure when the value is under the min length required', async done => {
    expect(await min(4)('ab')).toHaveProperty('ok', false);
    expect(await min(4)([1, 2])).toHaveProperty('ok', false);
    done();
  });

  it('should return failure on non array like', async done => {
    expect(await min(4)(null as any)).toHaveProperty('ok', false);
    expect(await min(4)(undefined as any)).toHaveProperty('ok', false);
    expect(await min(4)((() => {}) as any)).toHaveProperty('ok', false);
    expect(await min(4)(true as any)).toHaveProperty('ok', false);
    done();
  });
});
