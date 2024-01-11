import React, { useState } from 'react';

import { BLOCKS, INLINES } from '@contentful/rich-text-types';

import { useContentfulEditor } from '../../ContentfulEditorProvider';
import { isLinkActive } from '../../helpers/editor';
import { isNodeTypeEnabled } from '../../helpers/validations';
import { EmbeddedBlockToolbarIcon } from '../../plugins/shared/EmbeddedBlockToolbarIcon';
import { EmbeddedInlineToolbarIcon } from '../../plugins/shared/EmbeddedInlineToolbarIcon';
// import { useSdkContext } from '../../SdkProvider';
import { EmbeddedEntityDropdownButton } from './EmbeddedEntityDropdownButton';

export interface EmbedEntityWidgetProps {
  isDisabled?: boolean;
  canInsertBlocks?: boolean;
}

export const EmbedEntityWidget = ({ isDisabled, canInsertBlocks }: EmbedEntityWidgetProps) => {
  return null
};
