import 'babel-core/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';
import configureStore from './store/configureStore';

const store = configureStore();

// Every time the state changes, log it, helpful for getting the hang of Redux
// let unsubscribe = store.subscribe(() =>
//   console.log('[Store]', store.getState())
// );

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// Show how to add bar chart

import BarChart from './components/BarChart.js';
import Vega from 'react-vega';

const barData = {
  table: [
    {"x": 1,  "y": 28}, {"x": 2,  "y": 55},
    {"x": 3,  "y": 43}, {"x": 4,  "y": 91},
    {"x": 5,  "y": 81}, {"x": 6,  "y": 53},
    {"x": 7,  "y": 19}, {"x": 8,  "y": 87},
    {"x": 9,  "y": 52}, {"x": 10, "y": 48},
    {"x": 11, "y": 24}, {"x": 12, "y": 49},
    {"x": 13, "y": 87}, {"x": 14, "y": 66},
    {"x": 15, "y": 17}, {"x": 16, "y": 27},
    {"x": 17, "y": 68}, {"x": 18, "y": 16},
    {"x": 19, "y": 49}, {"x": 20, "y": 15}
  ]
};

const barSpec = {
  "width": 400,
  "height": 200,
  "padding": {"top": 10, "left": 30, "bottom": 30, "right": 10},
  "data": [{ "name": "table" }],
  'signals': [
    {
      'name': 'hover', 'init': null,
      'streams': [
        {'type': '@bar:mouseover', 'expr': 'datum'},
        {'type': '@bar:mouseout', 'expr': 'null'}
      ]
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "ordinal",
      "range": "width",
      "domain": {"data": "table", "field": "x"}
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "domain": {"data": "table", "field": "y"},
      "nice": true
    }
  ],
  "axes": [
    {"type": "x", "scale": "x"},
    {"type": "y", "scale": "y"}
  ],
  "marks": [
    {
      "type": "rect",
      "name": "bar",
      "from": {"data": "table"},
      "properties": {
        "enter": {
          "x": {"scale": "x", "field": "x"},
          "width": {"scale": "x", "band": true, "offset": -1},
          "y": {"scale": "y", "field": "y"},
          "y2": {"scale": "y", "value": 0}
        },
        "update": {
          "fill": {"value": "steelblue"}
        },
        "hover": {
          "fill": {"value": "red"}
        }
      }
    }
  ]
};

let info = '';
function handleHover(...args){
  info = JSON.stringify(args);
  (barSpec).marks[0].properties.update.fill.value='red';
  update();
}

function update(){
  render(
    <div>
      <Vega data={barData} spec={barSpec}/>
      <BarChart data={barData} onSignalHover={handleHover}/>
      {info}
    </div>,
    document.getElementById('bar-container')
  );
}

update();