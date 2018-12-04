import { allP, anyP } from '../src/helpers';
import { hexColor } from '../src/rules/hexColor';

describe('hexColor', () => {
  it('should successfully validate colours', async done => {
    const colourStrings = ['#ffffff', '#000000', '#a73b48'];
    expect(
      await allP(async cstr => (await hexColor()(cstr)).ok, colourStrings),
    ).toBe(true);
    done();
  });

  it('should successfully invalidate non-colours', async done => {
    const colourStrings = ['ffffff', '#00000g', '#0000000'];
    expect(
      await anyP(async cstr => (await hexColor()(cstr)).ok, colourStrings),
    ).toBe(false);
    done();
  });
});
