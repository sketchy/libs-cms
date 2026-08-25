import React from 'react';
import ReactDOM from 'react-dom';
import { log } from './debugRte';
import { RichText } from "./RichText";

log('boot');

const ConnectedComponent = Retool.connectReactComponent(RichText)
document.body.setAttribute('style', 'margin: 0;')

ReactDOM.render(
  <ConnectedComponent />,
  document.body.appendChild(document.createElement('div'))
);

