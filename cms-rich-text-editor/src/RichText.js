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
    'font-size',
  ],
  value: defaultInitialValue,
}

export const RichText = ({ model, modelUpdate }) => {
  // Model, etc comes from Retool module inputs
  // Thus far is only used for rich text editor:
  // https://sketchymedical.retool.com/editor/6e455d08-92eb-11ee-8a52-0fc062da2416/Cortex/Contentful%20Rich%20Text%20Editor
  const { height, controls, initialValue } = model

  // Handle stringified json, allows passing of json or stringified json
  let richTextValue;
  if (typeof initialValue === 'string' && initialValue.length) {
    try {
      richTextValue = JSON.parse(`${initialValue}`)
    } catch (e) {
      console.error('Could not parse string as JSON for rich text', e)
    }
  }

  React.useEffect(() => {
    const nextModel = {
      hasChanged: false,
      value: richTextValue,
      valueStringified: typeof initialValue === 'string' && initialValue?.length ? initialValue : undefined,
      valuePlainText: richTextValue ? documentToPlainTextString(richTextValue) : undefined,
    };
    console.log({
      message: 'useEffect is running',
      modelUpdate: nextModel,
    })
    modelUpdate(nextModel);
  }, [initialValue])

  return (
    <Editor
      height={typeof height === 'number' ? height : DEFAULTS.height} // retool passes a blank string for undefined values
      controls={controls || DEFAULTS.controls}
      value={richTextValue || DEFAULTS.value}
      onChange={(value) => {
        const stringifiedValue = JSON.stringify(value);

        console.log({
          value,
          stringifiedValue,
        });

        const nextModel = {
          hasChanged: true,
          value: value,
          valueStringified: stringifiedValue?.length ? stringifiedValue : undefined,
          valuePlainText: documentToPlainTextString(value),
        };

        console.log({ modelUpdate: nextModel });

        modelUpdate(nextModel);
      }}
      onAction={(action) => console.log({ action })}
    />
  );
}
