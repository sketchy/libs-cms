import * as React from 'react';

import { Button, Menu } from '@contentful/f36-components';
import { ChevronDownIcon } from '@contentful/f36-icons';
import tokens from '@contentful/f36-tokens';
import { css, cx } from 'emotion';

import { useContentfulEditor } from '../../../ContentfulEditorProvider';
import { focus } from '../../../helpers/editor';
import { select } from '../../../internal/transforms';
import { BaseRange } from '../../../internal/types';
import {
  ALLOWED_FONT_SIZES,
  DEFAULT_FONT_SIZE,
  FontSize,
  getCurrentFontSize,
  markForFontSize,
  setFontSize,
} from '../fontSizeUtils';

const styles = {
  trigger: css({
    height: '30px',
    minWidth: '64px',
    marginLeft: tokens.spacing2Xs,
    marginRight: tokens.spacing2Xs,
  }),
  isActive: css({
    backgroundColor: tokens.blue100,
    color: tokens.blue600,
  }),
};

export interface ToolbarFontSizeDropdownProps {
  isDisabled?: boolean;
}

export function ToolbarFontSizeDropdown({ isDisabled }: ToolbarFontSizeDropdownProps) {
  const editor = useContentfulEditor();
  const [selected, setSelected] = React.useState<FontSize>(DEFAULT_FONT_SIZE);
  const savedSelection = React.useRef<BaseRange | null>(null);

  React.useEffect(() => {
    if (!editor?.selection) {
      return;
    }

    savedSelection.current = editor.selection;
    setSelected(getCurrentFontSize(editor));
  }, [editor, editor?.operations, editor?.selection]);

  if (!editor) {
    return null;
  }

  const handleSelect = (size: FontSize) => (event: React.MouseEvent) => {
    event.preventDefault();

    const selection = editor.selection || savedSelection.current;
    if (!selection) {
      return;
    }

    if (!editor.selection) {
      select(editor, selection);
    }

    const mark = markForFontSize(size);
    editor.tracking.onToolbarAction(mark ? 'mark' : 'unmark', {
      markType: mark || 'fontSize',
    });

    setFontSize(editor, size);
    setSelected(size);
    focus(editor);
  };

  return (
    <Menu>
      <Menu.Trigger>
        <Button
          className={styles.trigger}
          size="small"
          variant={selected !== DEFAULT_FONT_SIZE ? 'secondary' : 'transparent'}
          endIcon={<ChevronDownIcon />}
          isDisabled={isDisabled}
          testId="font-size-toolbar-button"
          aria-label="Font size"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          {selected}
        </Button>
      </Menu.Trigger>
      <Menu.List>
        {ALLOWED_FONT_SIZES.map((size) => (
          <Menu.Item
            key={size}
            onClick={handleSelect(size)}
            disabled={isDisabled}
            className={cx({
              [styles.isActive]: size === selected,
            })}
            testId={`font-size-${size}-toolbar-button`}
          >
            {size}
          </Menu.Item>
        ))}
      </Menu.List>
    </Menu>
  );
}
