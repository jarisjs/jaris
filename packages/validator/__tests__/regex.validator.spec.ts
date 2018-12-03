import * as R from 'ramda';
import { allP, anyP } from '../helpers/promise.helper';
import { regex, webColor } from './regex.validator';

describe('regexValidator', () => {
  describe('regex', () => {
    it('successfully validates regex expressions', async done => {
      const randomStrings = R.map(
        _ =>
          Math.random()
            .toString(36)
            .substring(7),
        R.range(0, 20),
      );
      let pattern = '.*';
      expect(
        await allP(
          async rstr => (await regex(pattern)(rstr)).ok,
          randomStrings,
        ),
      ).toBe(true);
      done();
    });
  });

  describe('webColor', () => {
    it('should successfully validate colours', async done => {
      const colourStrings = ['#ffffff', '#000000', '#a73b48'];
      expect(
        await allP(async cstr => (await webColor()(cstr)).ok, colourStrings),
      ).toBe(true);
      done();
    });

    it('should successfully invalidate non-colours', async done => {
      const colourStrings = ['ffffff', '#00000g', '#0000000'];
      expect(
        await anyP(async cstr => (await webColor()(cstr)).ok, colourStrings),
      ).toBe(false);
      done();
    });
  });
});
