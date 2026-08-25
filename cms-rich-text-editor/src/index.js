import React from 'react';
import ReactDOM from 'react-dom';
import { log } from './debugRte';
import { RichText } from "./RichText";

log('boot');

const ConnectedComponent = Retool.connectReactComponent(RichText)

function applyIframeFill(element) {
  element.style.height = '100%'
  element.style.overflow = 'hidden'
  element.style.margin = '0'
}

applyIframeFill(document.documentElement)
applyIframeFill(document.body)

const fillCss = document.createElement('style')
fillCss.textContent = `
  html, body { height: 100%; overflow: hidden; margin: 0; }
  body > div { height: 100%; overflow: hidden; }
`
document.head.appendChild(fillCss)

const mountNode = document.createElement('div')
applyIframeFill(mountNode)
document.body.appendChild(mountNode)

ReactDOM.render(
  <ConnectedComponent />,
  mountNode
);

