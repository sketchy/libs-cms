
import * as React from 'react';
import { INLINES } from '@contentful/rich-text-types';
import { AnyObject, HotkeyPlugin } from '@udecode/plate-common';
import isHotkey from 'is-hotkey';

import { isLinkActive, unwrapLink } from '../../helpers/editor';
import { transformRemove } from '../../helpers/transformers';
import { KeyboardHandler, PlatePlugin } from '../../internal/types';
import { UrlHyperlink } from './components/UrlHyperlink';
import { addOrEditLink } from './HyperlinkModal';
import { hasText } from './utils';

const isAnchor = (element: HTMLElement) =>
  element.nodeName === 'A' &&
  !!element.getAttribute('href') &&
  element.getAttribute('href') !== '#';

const buildHyperlinkEventHandler =
  (): KeyboardHandler<HotkeyPlugin> =>
    (editor, { options: { hotkey } }) => {
      return (event: React.KeyboardEvent) => {
        if (!editor.selection) {
          return;
        }

        if (hotkey && !isHotkey(hotkey, event)) {
          return;
        }

        if (isLinkActive(editor)) {
          unwrapLink(editor);
          editor.tracking.onShortcutAction('unlinkHyperlinks');
        } else {
          addOrEditLink(editor, editor.tracking.onShortcutAction);
        }
      };
    };

const getNodeOfType = (type: INLINES) => (el: HTMLElement, node: AnyObject) => ({
  type,
  children: node.children,
  data:
    type === INLINES.HYPERLINK
      ? {
        uri: el.getAttribute('href'),
      }
      : type === INLINES.RESOURCE_HYPERLINK
        ? {
          target: {
            sys: {
              urn: el.getAttribute('data-resource-link-urn'),
              linkType: el.getAttribute('data-resource-link-type'),
              type: 'ResourceLink',
            },
          },
        }
        : {
          target: {
            sys: {
              id: el.getAttribute('data-link-id'),
              linkType: el.getAttribute('data-link-type'),
              type: 'Link',
            },
          },
        },
});

export const createHyperlinkPlugin = (): PlatePlugin => {
  const common: Partial<PlatePlugin> = {
    isElement: true,
    isInline: true,
  };

  return {
    key: 'HyperlinkPlugin',
    options: {
      hotkey: 'mod+k',
    },
    handlers: {
      onKeyDown: buildHyperlinkEventHandler(),
    },
    plugins: [
      {
        ...common,
        key: INLINES.HYPERLINK,
        type: INLINES.HYPERLINK,
        component: UrlHyperlink,
        deserializeHtml: {
          rules: [
            {
              validNodeName: ['A'],
            },
          ],
          query: (el) => isAnchor(el),
          getNode: getNodeOfType(INLINES.HYPERLINK),
        },
      },
    ],
    normalizer: [
      {
        match: {
          type: [
            INLINES.HYPERLINK,
          ],
        },
        validNode: hasText,
        transform: transformRemove,
      },
    ],
  };
};
