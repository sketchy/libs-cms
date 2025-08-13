import * as React from 'react';

import { IconButton, Menu } from '@contentful/f36-components';
import { ChevronDownIcon } from '@contentful/f36-icons';
import { BLOCKS } from '@contentful/rich-text-types';
import { deleteColumn, deleteRow, deleteTable } from '@udecode/plate-table';
import { css } from 'emotion';

import { useContentfulEditor } from '../../../ContentfulEditorProvider';
import { getNodeEntryFromSelection, getTableSize } from '../../../helpers/editor';
import { withoutNormalizing } from '../../../internal';
import { useReadOnly } from '../../../internal/hooks';
import { getAboveNode } from '../../../internal/queries';
import { PlateEditor } from '../../../internal/types';
import { RichTextTrackingActionName } from '../../../plugins/Tracking';
import { addColumnLeft, addColumnRight, addRowAbove, addRowBelow, setHeader } from '../actions';
import { setHeaderBackgroundColor } from '../actions/setHeaderBackgroundColor';
import { isTableHeaderEnabled } from '../helpers';
import { HeaderBackgroundColorPicker } from './HeaderBackgroundColorPicker';

export const styles = {
  topRight: css({
    position: 'absolute',
    top: '6px',
    right: '5px',
  }),
};

const getCurrentTableSize = (
  editor: PlateEditor
): Record<'numRows' | 'numColumns', number> | null => {
  const [table] = getNodeEntryFromSelection(editor, BLOCKS.TABLE);
  return table ? getTableSize(table) : null;
};

// FIXME: TablePluginOptions no longer exported so using any
type TableAction = (editor: PlateEditor, options: any) => void;

export const TableActions = () => {
  const editor = useContentfulEditor();
  const isDisabled = useReadOnly();
  const [isOpen, setOpen] = React.useState(false);
  const [isHeaderEnabled, setHeaderEnabled] = React.useState(false);
  const [isColorPickerOpen, setColorPickerOpen] = React.useState(false);
  const [currentHeaderColor, setCurrentHeaderColor] = React.useState<string | undefined>();

  const close = React.useCallback(() => {
    setOpen(false);
  }, []);

  const closeColorPicker = React.useCallback(() => {
    setColorPickerOpen(false);
  }, []);

  React.useEffect(() => {
    setHeaderEnabled(Boolean(editor && isTableHeaderEnabled(editor)));
    
    // Get current header background color from table data
    if (editor) {
      const tableNode = getAboveNode(editor, {
        match: { type: BLOCKS.TABLE },
      });
      setCurrentHeaderColor((tableNode?.[0]?.data as Record<string, unknown>)?.headerBackgroundColor as string | undefined);
    }
  }, [editor]);

  const canInsertRowAbove = React.useMemo(() => {
    if (!editor) {
      return false;
    }

    const headerCell = getAboveNode(editor, {
      match: {
        type: BLOCKS.TABLE_HEADER_CELL,
      },
    });

    return !headerCell;
  }, [editor]);

  const toggleHeader = React.useCallback(() => {
    close();

    if (!editor) {
      return;
    }

    const value = !isHeaderEnabled;

    setHeaderEnabled(value);
    setHeader(editor, value);
  }, [editor, close, isHeaderEnabled]);

  const handleColorSelect = React.useCallback((color: string | undefined) => {
    if (!editor) {
      return;
    }

    setCurrentHeaderColor(color);
    setHeaderBackgroundColor(editor, color);
    
    // Track the action (using generic edit action since setHeaderBackgroundColor is not defined)
    editor.tracking.onViewportAction('edit', { 
      action: 'setHeaderBackgroundColor',
      color: color || 'default',
      tableSize: getCurrentTableSize(editor) 
    });
  }, [editor]);

  const action = React.useCallback(
    (cb: TableAction, type: 'insert' | 'remove', element: 'Table' | 'Row' | 'Column') => () => {
      if (!editor?.selection) return;
      close();

      const tableSize = getCurrentTableSize(editor);

      withoutNormalizing(editor, () => {
        cb(editor, { header: isHeaderEnabled });
      });
      // Tracking
      const actionName = `${type}Table${element === 'Table' ? '' : element}`;
      editor.tracking.onViewportAction(actionName as RichTextTrackingActionName, { tableSize });
    },
    [editor, isHeaderEnabled, close]
  );

  if (isDisabled) {
    return null;
  }

  return (
    <Menu
      placement="left"
      isOpen={isOpen}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={close}
    >
      <Menu.Trigger>
        <IconButton
          size="small"
          variant="transparent"
          tabIndex={-1}
          className={styles.topRight}
          icon={<ChevronDownIcon />}
          aria-label="Open table menu"
          testId="cf-table-actions-button"
        />
      </Menu.Trigger>
      <Menu.List>
        <Menu.Item onClick={action(addRowAbove, 'insert', 'Row')} disabled={!canInsertRowAbove}>
          Add row above
        </Menu.Item>
        <Menu.Item onClick={action(addRowBelow, 'insert', 'Row')}>Add row below</Menu.Item>
        <Menu.Item onClick={action(addColumnLeft, 'insert', 'Column')}>Add column left</Menu.Item>
        <Menu.Item onClick={action(addColumnRight, 'insert', 'Column')}>Add column right</Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={toggleHeader}>
          {isHeaderEnabled ? 'Disable table header' : 'Enable table header'}
        </Menu.Item>
        {isHeaderEnabled && (
          <Menu
            placement="right-start"
            isOpen={isColorPickerOpen}
            onOpen={() => setColorPickerOpen(true)}
            onClose={closeColorPicker}
          >
            <Menu.Trigger>
              <Menu.Item>
                Header background color
              </Menu.Item>
            </Menu.Trigger>
            <HeaderBackgroundColorPicker
              currentColor={currentHeaderColor}
              onColorSelect={handleColorSelect}
              onClose={closeColorPicker}
            />
          </Menu>
        )}
        <Menu.Divider />
        <Menu.Item onClick={action(deleteRow, 'remove', 'Row')}>Delete row</Menu.Item>
        <Menu.Item onClick={action(deleteColumn, 'remove', 'Column')}>Delete column</Menu.Item>
        <Menu.Item onClick={action(deleteTable, 'remove', 'Table')}>Delete table</Menu.Item>
      </Menu.List>
    </Menu>
  );
};
