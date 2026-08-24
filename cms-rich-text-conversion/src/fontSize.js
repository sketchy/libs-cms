export const FONT_SIZE_12 = 'fontSize12';
export const FONT_SIZE_16 = 'fontSize16';
const ALLOWED_FONT_SIZES = [12, 14, 16];
const DEFAULT_FONT_SIZE = 14;

const IGNORED_FONT_SIZE_KEYWORDS = new Set([
  'smaller',
  'larger',
  'inherit',
  'initial',
  'unset',
  'medium',
  'normal',
]);

function parseFontSizeToPx(fontSize) {
  if (!fontSize) {
    return null;
  }

  const trimmed = String(fontSize).trim().toLowerCase();
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

function snapFontSize(fontSize) {
  const px = parseFontSizeToPx(fontSize);
  if (px == null || Number.isNaN(px)) {
    return null;
  }

  let nearest = DEFAULT_FONT_SIZE;
  let best = Infinity;
  for (const size of ALLOWED_FONT_SIZES) {
    const dist = Math.abs(size - px);
    if (dist < best) {
      best = dist;
      nearest = size;
    }
  }

  return nearest;
}

function withFontSizeMark(marks, size) {
  const next = (marks || []).filter(
    (mark) => mark.type !== FONT_SIZE_12 && mark.type !== FONT_SIZE_16
  );

  if (size === 12) {
    next.push({ type: FONT_SIZE_12 });
  }
  if (size === 16) {
    next.push({ type: FONT_SIZE_16 });
  }

  return next;
}

function collectHtmlCharSizes(html) {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const chars = [];

  const walk = (node, currentSize) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      for (let i = 0; i < text.length; i += 1) {
        chars.push({ char: text[i], size: currentSize });
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    const own = snapFontSize(node.style && node.style.fontSize);
    const nextSize = own != null ? own : currentSize;

    for (const child of node.childNodes) {
      walk(child, nextSize);
    }
  };

  walk(parsed.body, null);
  return chars;
}

function splitTextNode(node, sizes) {
  const value = node.value || '';
  if (!value.length) {
    return [node];
  }

  if (!sizes || sizes.length !== value.length) {
    return [node];
  }

  const parts = [];
  let start = 0;
  let current = sizes[0];

  for (let i = 1; i <= sizes.length; i += 1) {
    if (i === sizes.length || sizes[i] !== current) {
      parts.push({
        nodeType: 'text',
        value: value.slice(start, i),
        data: node.data || {},
        marks: withFontSizeMark(node.marks, current),
      });
      start = i;
      current = sizes[i];
    }
  }

  return parts;
}

export function applyFontSizeMarks(document, html) {
  const htmlChars = collectHtmlCharSizes(html);
  let cursor = 0;

  const findSizesForValue = (value) => {
    if (!value) {
      return [];
    }

    const remaining = htmlChars.slice(cursor);
    const remainingText = remaining.map((entry) => entry.char).join('');
    const idx = remainingText.indexOf(value);
    if (idx === -1) {
      return null;
    }

    cursor += idx + value.length;
    return remaining.slice(idx, idx + value.length).map((entry) => entry.size);
  };

  const walk = (node) => {
    if (node.nodeType === 'text') {
      const sizes = findSizesForValue(node.value || '');
      if (!sizes) {
        return node;
      }
      const parts = splitTextNode(node, sizes);
      return parts;
    }

    if (Array.isArray(node.content)) {
      return {
        ...node,
        content: node.content.flatMap((child) => {
          const result = walk(child);
          return Array.isArray(result) ? result : [result];
        }),
      };
    }

    return node;
  };

  return walk(document);
}

export const fontSizeRenderMark = {
  [FONT_SIZE_12]: (text) => `<span style="font-size:12px">${text}</span>`,
  [FONT_SIZE_16]: (text) => `<span style="font-size:16px">${text}</span>`,
};
