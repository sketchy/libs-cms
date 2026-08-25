import React from 'react';
import ReactDOM from 'react-dom';
import { log } from './debugRte';
import { RichText } from "./RichText";

log('boot');

const ConnectedComponent = Retool.connectReactComponent(RichText)

const fillCss = document.createElement('style')
fillCss.textContent = `
  html, body { height: 100%; overflow: hidden; margin: 0; }
  body > div, body > div > div { height: 100%; overflow: hidden; }
`
document.head.appendChild(fillCss)

const mountNode = document.createElement('div')
document.body.appendChild(mountNode)

ReactDOM.render(
  <ConnectedComponent />,
  mountNode
);

