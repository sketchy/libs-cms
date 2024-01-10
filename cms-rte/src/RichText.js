import React from 'react'
import { Editor } from './editor/Editor'

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

export const RichText = ({ model, modelUpdate }) => {
  const { height, controls } = model

  // this value is used to detect updates, we don't want it prepopulated on mount
  // this ensures that the model value is set to null
  React.useEffect(() => {
    modelUpdate({ value: null })
  }, [])

  return (
    <Editor
      height={height || 200}
      controls={controls || ['bold', 'underline', 'italics', 'list', 'link']}
      value={model.initialValue?.value || defaultInitialValue}
      onChange={(value) => modelUpdate({ value: value })}
      onAction={(action) => console.log({ action })}
    />
  );
}
