import { flatten } from '../lib';

describe('util', () => {
  describe('flatten', () => {
    it('should not modify flat array', () => {
      expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
    });
    it('should flatten 2d array', () => {
      expect(flatten([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toEqual([
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
      ]);
    });
    it('should flatten 4d array', () => {
      expect(flatten([[[[1, 2, 3]]], [4, [5], 6], [7, 8, 9]])).toEqual([
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
      ]);
    });
  });
});
