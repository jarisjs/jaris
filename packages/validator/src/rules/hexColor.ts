import { wrap } from '../helpers';
import regex from './regex';

const hexColor = wrap(regex('^#[0-9a-fA-F]{6}$'));

export default hexColor;
