import * as React from 'react';

import { isText } from '../../internal/queries';
import { unsetNodes } from '../../internal/transforms';
import { PlatePlugin, RenderLeafProps, Text } from '../../internal/types';
import { FONT_SIZE_12, FONT_SIZE_16, snapFontSize } from './fontSizeUtils';

function FontSize12(props: RenderLeafProps) {
  return (
    <span {...props.attributes} style={{ fontSize: '12px' }}>
      {props.children}
    </span>
  );
}

function FontSize16(props: RenderLeafProps) {
  return (
    <span {...props.attributes} style={{ fontSize: '16px' }}>
      {props.children}
    </span>
  );
}

function createFontSizeMarkPlugin(
  mark: typeof FONT_SIZE_12 | typeof FONT_SIZE_16,
  px: 12 | 16,
  component: (props: RenderLeafProps) => React.ReactElement
): PlatePlugin {
  const plugin: PlatePlugin = {
    key: mark,
    type: mark,
    isLeaf: true,
    component,
    deserializeHtml: {
      rules: [{ validNodeName: '*' }],
      query: (el) => snapFontSize(el.style?.fontSize) === px,
    },
  };

  if (mark === FONT_SIZE_16) {
    plugin.normalizer = [
      {
        match: isText,
        validNode: (_editor, [node]) => {
          const text = node as Text;
          return !(text.fontSize12 && text.fontSize16);
        },
        transform: (editor, [, path]) => {
          unsetNodes(editor, FONT_SIZE_12, { at: path });
        },
      },
    ];
  }

  return plugin;
}

export const createFontSize12Plugin = (): PlatePlugin =>
  createFontSizeMarkPlugin(FONT_SIZE_12, 12, FontSize12);

export const createFontSize16Plugin = (): PlatePlugin =>
  createFontSizeMarkPlugin(FONT_SIZE_16, 16, FontSize16);
