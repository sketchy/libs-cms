import * as React from 'react';

import tokens from '@contentful/f36-tokens';
import { BLOCKS, TableHeaderCell } from '@contentful/rich-text-types';
import { css } from 'emotion';
import { useSelected } from 'slate-react';

import { getAboveNode } from '../../../internal/queries';
import { RenderElementProps } from '../../../internal/types';
import { useContentfulEditor } from '../../../ContentfulEditorProvider';
import { TableActions } from './TableActions';

const getHeaderCellStyle = (backgroundColor?: string) => css`
  background-clip: padding-box;
  background-color: ${backgroundColor || tokens.gray200};
  border: 1px solid ${tokens.gray400};
  border-collapse: collapse;
  padding: 10px 12px;
  font-weight: ${tokens.fontWeightNormal};
  text-align: left;
  min-width: 48px;
  position: relative;

  div:last-child {
    margin-bottom: 0;
  }
`;

export const HeaderCell = (props: RenderElementProps) => {
  const isSelected = useSelected();
  const editor = useContentfulEditor();
  
  // Get the table's background color from its data
  const tableNode = React.useMemo(() => {
    if (!editor) return null;
    return getAboveNode(editor, {
      match: { type: BLOCKS.TABLE },
    });
  }, [editor]);
  
  const headerBackgroundColor = (tableNode?.[0]?.data as Record<string, unknown>)?.headerBackgroundColor as string | undefined;
  const style = getHeaderCellStyle(headerBackgroundColor);

  return (
    <th
      {...props.attributes}
      // may include `colspan` and/or `rowspan`
      // FIXME: figure out what is going wrong with type here
      // @ts-expect-error
      {...(props.element.data as TableHeaderCell['data'])}
      className={style}
    >
      {isSelected && <TableActions />}
      {props.children}
    </th>
  );
};
