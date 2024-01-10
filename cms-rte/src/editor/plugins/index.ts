import { PlateProps } from '@udecode/plate-common';
import { createDeserializeDocxPlugin } from '@udecode/plate-serializer-docx';

import { PlatePlugin } from '../internal/types';
import { createSoftBreakPlugin, createExitBreakPlugin, createResetNodePlugin } from './Break';
import { createHyperlinkPlugin } from './Hyperlink';
import { createListPlugin } from './List';
import { createMarksPlugin } from './Marks';
import { createNormalizerPlugin } from './Normalizer';
import { createParagraphPlugin } from './Paragraph';
import { createPasteHTMLPlugin } from './PasteHTML';
import { createSelectOnBackspacePlugin } from './SelectOnBackspace';
import { createTextPlugin } from './Text';
import { createTrackingPlugin, RichTextTrackingActionHandler } from './Tracking';
import { createTrailingParagraphPlugin } from './TrailingParagraph';
import { createVoidsPlugin } from './Voids';

export const getPlugins = (
  onAction?: RichTextTrackingActionHandler,
  restrictedMarks?: string[],
  controls?: string[]
): PlatePlugin[] => [
    createDeserializeDocxPlugin(),

    // Tracking - This should come first so all plugins below will have access to `editor.tracking`
    createTrackingPlugin(onAction),

    // Block Elements
    createParagraphPlugin(),
    createListPlugin(),

    // Inline elements
    createHyperlinkPlugin(),

    // Marks
    createMarksPlugin(),

    // Other
    createTrailingParagraphPlugin(),
    createTextPlugin(restrictedMarks),
    createVoidsPlugin(),
    createSelectOnBackspacePlugin(),

    // Pasting content from other sources
    createPasteHTMLPlugin(),

    // These plugins drive their configurations from the list of plugins above.
    // They MUST come last.
    createSoftBreakPlugin(),
    createExitBreakPlugin(),
    createResetNodePlugin(),
    createNormalizerPlugin(),
  ];

export const disableCorePlugins: PlateProps['disableCorePlugins'] = {
  // Note: Enabled by default since v9.0.0 but it causes Cypress's
  // .click() command to fail
  eventEditor: true,
};
