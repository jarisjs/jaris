import { allP, anyP } from '../helpers/promise.helper';
import { timestamp } from './timestamp.validator';
describe('timestamp', () => {
  it('should work for correctly formed h:mm stamps', async done => {
    const dates = ['01:00', '10:00', '23:59'];
    expect(await allP(async date => (await timestamp()(date)).ok, dates)).toBe(
      true,
    );
    done();
  });
  it('should not work for malformed timestamps', async done => {
    const dates = [453, '2459', 'qdaddaasd'];
    expect(await anyP(async date => (await timestamp()(date)).ok, dates)).toBe(
      false,
    );
    done();
  });
});
