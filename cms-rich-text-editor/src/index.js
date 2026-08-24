import React from 'react';
import ReactDOM from 'react-dom';
import { RichText } from "./RichText";

const ConnectedComponent = Retool.connectReactComponent(RichText)

// Lock the iframe to its allocated size so typing/scrolling inside the
// editor cannot grow document.scrollHeight. Retool auto-height treats
// that growth as a layout change and remounts the custom component.
const iframeLock = 'height:100%;overflow:hidden;overscroll-behavior:none;'
document.documentElement.setAttribute('style', iframeLock)
document.body.setAttribute('style', `margin:0;${iframeLock}`)

const root = document.createElement('div')
root.setAttribute('style', iframeLock)

ReactDOM.render(
  <ConnectedComponent />,
  document.body.appendChild(root)
);

