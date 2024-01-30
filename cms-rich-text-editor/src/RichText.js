import React from 'react'
import { Editor } from './editor/Editor'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';

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
  ],
  value: defaultInitialValue,
}

export const RichText = ({ model, modelUpdate }) => {
  // Model, etc comes from Retool module inputs
  // Thus far is only used for rich text editor:
  // https://sketchymedical.retool.com/editor/6e455d08-92eb-11ee-8a52-0fc062da2416/Cortex/Contentful%20Rich%20Text%20Editor
  const { height, controls, initialValue } = model

  // Handle stringified json, allows passing of json or stringified json
  let richTextValue = initialValue;
  if (typeof richTextValue === 'string' && richTextValue.length) {
    try {
      richTextValue = JSON.parse(`${initialValue}`)
    } catch (e) {
      console.error('Could not parse string as JSON for rich text', e)
    }
  }

  // INFO: this value is used to detect updates, we don't want it prepopulated on mount, this ensures that the model value is set to null
  // INFO: UPDATE - In practice, this wasn't ideal and causes confusion around validation, etc.
  // TODO: This should be removed or updated to ensure retool value and this value are in sync, this WILL break retool modules when removed and require updates within those modules.
  React.useEffect(() => {
    modelUpdate({ value: null })
  }, [])

  return (
    <Editor
      height={typeof height === 'number' ? height : DEFAULTS.height} // retool passes a blank string for undefined values
      controls={controls || DEFAULTS.controls}
      value={richTextValue || DEFAULTS.value}
      onChange={(value) => {
        const stringifiedValue = JSON.stringify(value);

        modelUpdate({
          hasChanged: true,
          value: value,
          valueStringified: stringifiedValue?.length ? stringifiedValue : undefined,
          valuePlainText: documentToPlainTextString(value),
        })
      }}
      onAction={(action) => console.log({ action })}
    />
  );
}
