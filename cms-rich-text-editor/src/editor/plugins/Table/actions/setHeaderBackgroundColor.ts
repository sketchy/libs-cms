import { BLOCKS } from '@contentful/rich-text-types';

import { getAboveNode, getChildren } from '../../../internal/queries';
import { setNodes } from '../../../internal/transforms';
import { PlateEditor } from '../../../internal/types';

export const setHeaderBackgroundColor = (editor: PlateEditor, backgroundColor?: string) => {
  const tableItem = getAboveNode(editor, {
    match: { type: BLOCKS.TABLE },
  });

  if (!tableItem) {
    return;
  }

  // Store the background color in the table's data for persistence
  setNodes(
    editor,
    {
      data: {
        ...tableItem[0].data,
        headerBackgroundColor: backgroundColor,
      },
    },
    { at: tableItem[1] }
  );
};
