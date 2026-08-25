import React from 'react'

const DEFAULT_MODEL = {
  initialValue: null,
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
  value: null,
  valueStringified: null,
  valuePlainText: null,
}

function snapshot(value) {
  return { ...value }
}

function createRetoolMock() {
  let model = snapshot(DEFAULT_MODEL)
  const subscribers = new Set()

  function emit() {
    const next = snapshot(model)
    subscribers.forEach((listener) => listener(next))
  }

  window.addEventListener('message', (event) => {
    const data = event.data
    if (!data || typeof data !== 'object') {
      return
    }

    if (data.type === 'playground:setModel') {
      model = { ...model, ...data.model }
      emit()
    }
  })

  window.Retool = {
    connectReactComponent(Component) {
      return function PlaygroundConnectedComponent() {
        const [current, setCurrent] = React.useState(() => snapshot(model))

        React.useEffect(() => {
          const listener = (next) => setCurrent(next)
          subscribers.add(listener)
          return () => subscribers.delete(listener)
        }, [])

        // Retool writes outputs back without replacing initialValue identity.
        // Re-emitting a new model here retriggers RichText's [initialValue] effect.
        const modelUpdate = React.useCallback((updates) => {
          model = { ...model, ...updates }
          window.parent.postMessage(
            { type: 'playground:modelUpdate', model: snapshot(model) },
            '*'
          )
        }, [])

        return <Component model={current} modelUpdate={modelUpdate} />
      }
    },
  }

  window.parent.postMessage({ type: 'playground:ready' }, '*')
}

createRetoolMock()

import('../index.js')
