import React from 'react';
import ReactDOM from 'react-dom';
import { RichText } from "./RichText";

const ConnectedComponent = Retool.connectReactComponent(RichText)
document.body.setAttribute('style', 'margin: 0;')

ReactDOM.render(
  <ConnectedComponent />,
  document.body.appendChild(document.createElement('div'))
);

