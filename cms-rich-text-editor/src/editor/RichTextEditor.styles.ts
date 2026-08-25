import tokens from '@contentful/f36-tokens';
import { css } from '@emotion/css';

const STYLE_EDITOR_BORDER = `1px solid ${tokens.gray400}`;

export const styles = {
  root: css({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',
  }),
  toolbarSlot: css({
    flexShrink: 0,
  }),
  editorSlot: css({
    flex: 1,
    minHeight: 0,
    position: 'relative',
    overflow: 'hidden',
  }),
  editor: css({
    position: 'absolute',
    inset: 0,
    borderRadius: `0 0 ${tokens.borderRadiusMedium} ${tokens.borderRadiusMedium}`,
    border: STYLE_EDITOR_BORDER,
    borderTop: 0,
    padding: '20px',
    fontSize: '14px',
    fontFamily: tokens.fontStackPrimary,
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    background: tokens.colorWhite,
    outline: 'none',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    webkitUserModify: 'read-write-plaintext-only',
    a: {
      span: {
        cursor: 'not-allowed',
        '&:hover': {
          cursor: 'not-allowed',
        },
      },
    },
    // We need to reset LIC style due to conflicts between PARAGRAPH styles
    'ul > li > div': {
      margin: 0,
    },
  }),
  hiddenToolbar: css({
    borderTop: STYLE_EDITOR_BORDER,
  }),
  enabled: css({
    background: tokens.colorWhite,
    a: {
      span: {
        cursor: 'pointer',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
  }),
  disabled: css({
    background: tokens.gray100,
    cursor: 'not-allowed',
  }),
};
