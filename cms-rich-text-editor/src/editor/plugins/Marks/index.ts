import { PlatePlugin } from '../../internal/types';
import { createBoldPlugin } from './Bold';
import { createCodePlugin } from './Code';
import { createFontSize12Plugin, createFontSize16Plugin } from './FontSize';
import { createItalicPlugin } from './Italic';
import { createSubscriptPlugin } from './Subscript';
import { createSuperscriptPlugin } from './Superscript';
import { createUnderlinePlugin } from './Underline';

export const createMarksPlugin = (): PlatePlugin => ({
  key: 'Marks',
  plugins: [
    createBoldPlugin(),
    createCodePlugin(),
    createItalicPlugin(),
    createUnderlinePlugin(),
    createSuperscriptPlugin(),
    createSubscriptPlugin(),
    createFontSize12Plugin(),
    createFontSize16Plugin(),
  ],
});
