import React from 'react'
import { Editor } from './editor/Editor'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import {
  getInitialValueKey,
  parseRichTextValue,
  resolveEditorDocument,
  shouldSeedOutputs,
} from './richTextModel'

// Blank rich text json value to be used as "default" when no value is provided
const defaultInitialValue = {
  "nodeType": "document",
  "data": {},
  "content": [
    {
      "nodeType": "paragraph",
      "data": {},
      "content": [
        {
          "nodeType": "text",
          "value": "",
          "marks": [],
          "data": {}
        }
      ]
    }
  ]
}

// default values to use as fallbacks when no config value is provided
const DEFAULTS = {
  height: 180,
  controls: [
    'bold',
    'underline',
    'italics',
    'superscript',
    'subscript',
    'list',
    'link',
    'font-size',
  ],
  value: defaultInitialValue,
}

export const RichText = ({ model, modelUpdate }) => {
  // Model, etc comes from Retool module inputs
  // Thus far is only used for rich text editor:
  // https://sketchymedical.retool.com/editor/6e455d08-92eb-11ee-8a52-0fc062da2416/Cortex/Contentful%20Rich%20Text%20Editor
  const { height, controls, initialValue, value, appliedInitialKey, hasChanged } = model
  const initialKey = getInitialValueKey(initialValue)
  const parsedInitial = React.useMemo(() => parseRichTextValue(initialValue), [initialKey])

  // Prefer the last published document after an iframe remount. Do not
  // depend on `value` here — feeding every modelUpdate back into Plate
  // would reset the caret via setEditorValue.
  const editorValue = React.useMemo(() => {
    return resolveEditorDocument({
      initialValue,
      value,
      appliedInitialKey,
      hasChanged,
    }) || DEFAULTS.value
  }, [initialKey, appliedInitialKey])

  React.useEffect(() => {
    if (!shouldSeedOutputs({ initialValue, appliedInitialKey })) {
      return
    }

    // Remount of an in-progress edit from a build that did not yet stamp
    // appliedInitialKey — keep the persisted document, just record the key.
    if (appliedInitialKey === undefined && hasChanged && value) {
      modelUpdate({ appliedInitialKey: initialKey })
      return
    }

    modelUpdate({
      hasChanged: false,
      value: parsedInitial,
      valueStringified: parsedInitial ? JSON.stringify(parsedInitial) : undefined,
      valuePlainText: parsedInitial ? documentToPlainTextString(parsedInitial) : undefined,
      appliedInitialKey: initialKey,
    });
  }, [initialKey])

  const handleChange = React.useCallback((nextValue) => {
    const stringifiedValue = JSON.stringify(nextValue);

    modelUpdate({
      hasChanged: true,
      value: nextValue,
      valueStringified: stringifiedValue?.length ? stringifiedValue : undefined,
      valuePlainText: documentToPlainTextString(nextValue),
    });
  }, [modelUpdate])

  return (
    <Editor
      height={typeof height === 'number' ? height : DEFAULTS.height} // retool passes a blank string for undefined values
      controls={controls || DEFAULTS.controls}
      value={editorValue}
      onChange={handleChange}
    />
  );
}
