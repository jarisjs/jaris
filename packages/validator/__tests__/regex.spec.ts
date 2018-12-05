import { allP, range } from '../src/helpers';
import regex from '../src/rules/regex';

describe('regex', () => {
  it('successfully validates regex expressions', async done => {
    const randomStrings = range(0, 20).map(_ =>
      Math.random()
        .toString(36)
        .substring(7),
    );
    let pattern = '.*';
    expect(
      await allP(async rstr => (await regex(pattern)(rstr)).ok, randomStrings),
    ).toBe(true);
    done();
  });
});
