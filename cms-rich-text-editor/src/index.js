import React from 'react';
import ReactDOM from 'react-dom';
import { log } from './debugRte';
import { ErrorBoundary, installGlobalCrashReporter } from './crashReporter';
import { RichText } from "./RichText";

installGlobalCrashReporter()
log('boot');

const ConnectedComponent = Retool.connectReactComponent(RichText)

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
    margin: 0;
    overscroll-behavior: none;
  }
  body > div {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
`
document.head.appendChild(fillCss)

const mountNode = document.createElement('div')
applyIframeFill(mountNode)
mountNode.style.position = 'absolute'
mountNode.style.inset = '0'
document.body.appendChild(mountNode)

function lockToIframeViewport() {
  if (!window.innerHeight) {
    return
  }
  const height = `${window.innerHeight}px`
  ;[document.documentElement, document.body, mountNode].forEach((element) => {
    element.style.height = height
    element.style.maxHeight = height
  })
  log('viewport lock', {
    innerHeight: window.innerHeight,
    htmlScrollHeight: document.documentElement.scrollHeight,
    bodyScrollHeight: document.body.scrollHeight,
  })
}

lockToIframeViewport()
window.addEventListener('resize', lockToIframeViewport)

ReactDOM.render(
  <ErrorBoundary>
    <ConnectedComponent />
  </ErrorBoundary>,
  mountNode
);

