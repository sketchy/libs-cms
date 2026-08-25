import React from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary } from './crashReporter';
import { installIframeContainment } from './containIframe';
import { RichText } from "./RichText";

installIframeContainment()

const retoolApi = {
  model: null,
  modelUpdate: () => {},
}
const apiListeners = new Set()

function notifyRetoolApi() {
  apiListeners.forEach((listener) => listener())
}

function persistModelUpdate(payload) {
  if (typeof retoolApi.modelUpdate === 'function') {
    retoolApi.modelUpdate(payload)
  }
}

// Retool.connectReactComponent remounts whenever the host re-renders. Keep
// that tree as a hidden bridge and mount the editor separately so Plate/Slate
// is not torn down on every Retool update.
function RetoolBridge({ model, modelUpdate }) {
  retoolApi.model = model
  retoolApi.modelUpdate = modelUpdate
  React.useLayoutEffect(() => {
    notifyRetoolApi()
  })
  return null
}

function PersistentRichText() {
  const [, setRevision] = React.useState(0)

  React.useLayoutEffect(() => {
    const onApi = () => setRevision((value) => value + 1)
    apiListeners.add(onApi)
    return () => apiListeners.delete(onApi)
  }, [])

  if (!retoolApi.model) {
    return null
  }

  return (
    <RichText
      model={retoolApi.model}
      modelUpdate={persistModelUpdate}
    />
  )
}

const ConnectedBridge = Retool.connectReactComponent(RetoolBridge)

function applyIframeFill(element) {
  element.style.overflow = 'hidden'
  element.style.margin = '0'
  element.style.overscrollBehavior = 'none'
}

applyIframeFill(document.documentElement)
applyIframeFill(document.body)

const fillCss = document.createElement('style')
fillCss.textContent = `
  html, body {
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    overflow-anchor: none;
    margin: 0;
    overscroll-behavior: none;
  }
  #rte-editor-root {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
`
document.head.appendChild(fillCss)

const bridgeNode = document.createElement('div')
bridgeNode.id = 'rte-retool-bridge'
bridgeNode.style.display = 'none'
document.body.appendChild(bridgeNode)

const mountNode = document.createElement('div')
mountNode.id = 'rte-editor-root'
applyIframeFill(mountNode)
document.body.appendChild(mountNode)

function lockToIframeViewport() {
  if (!window.innerHeight) {
    return
  }
  // Editor height follows the Retool iframe, not a model.height input.
  const height = `${window.innerHeight}px`
  ;[document.documentElement, document.body, mountNode].forEach((element) => {
    element.style.height = height
    element.style.maxHeight = height
  })
}

lockToIframeViewport()
window.addEventListener('resize', lockToIframeViewport)

ReactDOM.render(<ConnectedBridge />, bridgeNode)
ReactDOM.render(
  <ErrorBoundary>
    <PersistentRichText />
  </ErrorBoundary>,
  mountNode
);
