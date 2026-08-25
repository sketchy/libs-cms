import React from 'react'
import equal from 'fast-deep-equal'
import { Editor } from './editor/Editor'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';
import { createGuardedModelUpdate } from './crashReporter'

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

function isContentfulDocument(value) {
  return Boolean(
    value
    && typeof value === 'object'
    && !Array.isArray(value)
    && (value.nodeType === 'document' || Array.isArray(value.content))
  )
}

function parseInitialValue(initialValue) {
  if (typeof initialValue === 'string' && initialValue.length) {
    try {
      const parsed = JSON.parse(initialValue)
      return isContentfulDocument(parsed) ? parsed : undefined
    } catch (e) {
      console.error('Could not parse string as JSON for rich text', e)
      return undefined
    }
  }

  if (isContentfulDocument(initialValue)) {
    return initialValue
  }

  return undefined
}

function toModelPayload(value, hasChanged) {
  const stringifiedValue = JSON.stringify(value)
  return {
    hasChanged,
    value,
    valueStringified: stringifiedValue?.length ? stringifiedValue : undefined,
    valuePlainText: documentToPlainTextString(value),
  }
}

// Survives React remount in the same iframe; cleared on a full document reload.
let lastPublishedDoc = null
let lastSeenInitialValue = undefined
let hasSeededOutputs = false

export const RichText = ({ model, modelUpdate }) => {
  // Model, etc comes from Retool module inputs
  // Thus far is only used for rich text editor:
  // https://sketchymedical.retool.com/editor/6e455d08-92eb-11ee-8a52-0fc062da2416/Cortex/Contentful%20Rich%20Text%20Editor
  const { height, controls, initialValue } = model

  const parsedHostValue = parseInitialValue(initialValue)
  const incomingDoc = parsedHostValue || DEFAULTS.value
  // Retool echoes modelUpdate back as a new initialValue object. Treat that
  // echo as a no-op so live edits are not reset and modelUpdate cannot loop.
  const isEchoOfPublished = lastPublishedDoc != null && equal(incomingDoc, lastPublishedDoc)
  const hostDocChanged = !isEchoOfPublished
    && (lastSeenInitialValue === undefined || !equal(lastSeenInitialValue, incomingDoc))

  const editorValueRef = React.useRef(null)
  if (hostDocChanged) {
    lastSeenInitialValue = incomingDoc
    lastPublishedDoc = incomingDoc
    editorValueRef.current = incomingDoc
  } else if (editorValueRef.current === null) {
    editorValueRef.current = lastPublishedDoc || incomingDoc
  }
  const appliedValue = editorValueRef.current

  const rawModelUpdateRef = React.useRef(modelUpdate)
  rawModelUpdateRef.current = modelUpdate
  const modelUpdateRef = React.useRef(null)
  if (modelUpdateRef.current === null) {
    modelUpdateRef.current = createGuardedModelUpdate((payload) => {
      rawModelUpdateRef.current(payload)
    })
  }

  React.useEffect(() => {
    // Identity-only initialValue updates (common in Retool after modelUpdate)
    // must not write back again or React hits "Maximum update depth exceeded".
    if (hasSeededOutputs && !hostDocChanged) {
      return
    }

    if (lastPublishedDoc && !equal(lastPublishedDoc, incomingDoc)) {
      modelUpdateRef.current(toModelPayload(lastPublishedDoc, true))
      return
    }

    hasSeededOutputs = true
    modelUpdateRef.current(toModelPayload(lastPublishedDoc || incomingDoc, false))
  }, [initialValue])

  const onChange = React.useCallback((value) => {
    lastPublishedDoc = value
    modelUpdateRef.current(toModelPayload(value, true))
  }, [])

  const onAction = React.useCallback(() => {}, [])

  return (
    <Editor
      height={typeof height === 'number' ? height : DEFAULTS.height} // retool passes a blank string for undefined values
      controls={controls || DEFAULTS.controls}
      value={appliedValue}
      onChange={onChange}
      onAction={onAction}
    />
  );
}
