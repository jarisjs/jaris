import { wrap } from '../helpers';
import { regex } from './regex';

export const hexColor = wrap(regex('^#[0-9a-fA-F]{6}$'));
