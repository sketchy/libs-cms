import React from 'react'
import { Editor } from './editor/Editor'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { log, recordPublished, useLifecycle } from './debugRte'

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

  const prevInitialValueRef = React.useRef({ seen: false, value: undefined })
  const initialValueSameIdentity = prevInitialValueRef.current.seen
    && prevInitialValueRef.current.value === initialValue
  prevInitialValueRef.current = { seen: true, value: initialValue }

  // Handle stringified json, allows passing of json or stringified json
  let richTextValue;
  if (typeof initialValue === 'string' && initialValue.length) {
    try {
      richTextValue = JSON.parse(`${initialValue}`)
    } catch (e) {
      console.error('Could not parse string as JSON for rich text', e)
    }
  }

  const fellThroughToDefault = !richTextValue
  const appliedValue = richTextValue || DEFAULTS.value
  useLifecycle('RichText', appliedValue)

  log('render', {
    name: 'RichText',
    initialValueType: initialValue === null ? 'null' : typeof initialValue,
    initialValueSameIdentity,
    initialValueLength: typeof initialValue === 'string' ? initialValue.length : undefined,
    initialValueNodeType: initialValue && typeof initialValue === 'object' ? initialValue.nodeType : undefined,
    height,
    heightType: typeof height,
    fellThroughToDefault,
  })

  React.useEffect(() => {
    const nextModel = {
      hasChanged: false,
      value: richTextValue,
      valueStringified: typeof initialValue === 'string' && initialValue?.length ? initialValue : undefined,
      valuePlainText: richTextValue ? documentToPlainTextString(richTextValue) : undefined,
    };
    log('useEffect is running', { modelUpdate: nextModel })
    modelUpdate(nextModel);
  }, [initialValue])

  return (
    <Editor
      height={typeof height === 'number' ? height : DEFAULTS.height} // retool passes a blank string for undefined values
      controls={controls || DEFAULTS.controls}
      value={appliedValue}
      onChange={(value) => {
        const stringifiedValue = JSON.stringify(value);

        log('onChange', { value, stringifiedValue })
        recordPublished(value)

        const nextModel = {
          hasChanged: true,
          value: value,
          valueStringified: stringifiedValue?.length ? stringifiedValue : undefined,
          valuePlainText: documentToPlainTextString(value),
        };

        log('modelUpdate', { modelUpdate: nextModel })

        modelUpdate(nextModel);
      }}
      onAction={(action) => log('onAction', { action })}
    />
  );
}
