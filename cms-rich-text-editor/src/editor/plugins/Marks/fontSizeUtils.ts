import { isMarkActive } from '../../internal/queries';
import { addMark, withoutNormalizing } from '../../internal/transforms';
import { PlateEditor } from '../../internal/types';

export const FONT_SIZE_12 = 'fontSize12';
export const FONT_SIZE_16 = 'fontSize16';

export const ALLOWED_FONT_SIZES = [16, 14, 12] as const;
export type FontSize = (typeof ALLOWED_FONT_SIZES)[number];
export const DEFAULT_FONT_SIZE: FontSize = 14;

const IGNORED_FONT_SIZE_KEYWORDS = new Set([
  'smaller',
  'larger',
  'inherit',
  'initial',
  'unset',
  'medium',
  'normal',
]);

export function parseFontSizeToPx(fontSize?: string | null): number | null {
  if (!fontSize) {
    return null;
  }

  const trimmed = fontSize.trim().toLowerCase();
  if (!trimmed || IGNORED_FONT_SIZE_KEYWORDS.has(trimmed)) {
    return null;
  }

  const px = trimmed.match(/^([\d.]+)px$/);
  if (px) {
    return parseFloat(px[1]);
  }

  const pt = trimmed.match(/^([\d.]+)pt$/);
  if (pt) {
    return parseFloat(pt[1]) * (96 / 72);
  }

  const em = trimmed.match(/^([\d.]+)(em|rem)$/);
  if (em) {
    const base = em[2] === 'rem' ? 16 : DEFAULT_FONT_SIZE;
    return parseFloat(em[1]) * base;
  }

  const unitless = trimmed.match(/^([\d.]+)$/);
  if (unitless) {
    return parseFloat(unitless[1]);
  }

  return null;
}

export function snapFontSize(fontSize?: string | null): FontSize | null {
  const px = parseFontSizeToPx(fontSize);
  if (px == null || Number.isNaN(px)) {
    return null;
  }

  let nearest: FontSize = DEFAULT_FONT_SIZE;
  let best = Infinity;
  for (const size of [...ALLOWED_FONT_SIZES].sort((a, b) => a - b)) {
    const dist = Math.abs(size - px);
    if (dist < best) {
      best = dist;
      nearest = size;
    }
  }

  return nearest;
}

export function markForFontSize(size: FontSize): string | null {
  if (size === 12) {
    return FONT_SIZE_12;
  }
  if (size === 16) {
    return FONT_SIZE_16;
  }
  return null;
}

export function getCurrentFontSize(editor: PlateEditor): FontSize {
  if (isMarkActive(editor, FONT_SIZE_16)) {
    return 16;
  }
  if (isMarkActive(editor, FONT_SIZE_12)) {
    return 12;
  }
  return DEFAULT_FONT_SIZE;
}

export function setFontSize(editor: PlateEditor, size: FontSize) {
  withoutNormalizing(editor, () => {
    editor.removeMark(FONT_SIZE_12);
    editor.removeMark(FONT_SIZE_16);

    const mark = markForFontSize(size);
    if (mark) {
      addMark(editor, mark);
    }
  });
}
