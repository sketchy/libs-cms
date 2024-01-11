import * as React from 'react';

import { ListBulletedIcon, ListNumberedIcon } from '@contentful/f36-icons';
import { BLOCKS } from '@contentful/rich-text-types';

import { useContentfulEditor } from '../../../ContentfulEditorProvider';
import { focus } from '../../../helpers/editor';
import { ToolbarButton } from '../../shared/ToolbarButton';
import { toggleList } from '../transforms/toggleList';
import { isListTypeActive } from '../utils';

export interface ToolbarListButtonProps {
  isDisabled?: boolean;
}

export function ToolbarListButton(props: ToolbarListButtonProps) {
  const editor = useContentfulEditor();

  function handleClick(type: BLOCKS): () => void {
    return () => {
      if (!editor?.selection) return;

      toggleList(editor, { type });

      focus(editor);
    };
  }

  if (!editor) return null;

  return (
    <React.Fragment>
      <ToolbarButton
        title="UL"
        testId="ul-toolbar-button"
        onClick={handleClick(BLOCKS.UL_LIST)}
        isActive={isListTypeActive(editor, BLOCKS.UL_LIST)}
        isDisabled={props.isDisabled}
      >
        <ListBulletedIcon />
      </ToolbarButton>
      <ToolbarButton
        title="OL"
        testId="ol-toolbar-button"
        onClick={handleClick(BLOCKS.OL_LIST)}
        isActive={isListTypeActive(editor, BLOCKS.OL_LIST)}
        isDisabled={props.isDisabled}
      >
        <ListNumberedIcon />
      </ToolbarButton>
    </React.Fragment>
  );
}
