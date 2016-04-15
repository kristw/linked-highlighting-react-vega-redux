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

let info = '';
function handleHover(...args){
  info = JSON.stringify(args);
  update();
}

function update(){
  render(
    <div>
      <BarChart data={barData} onSignalHover={handleHover}/>
      {info}
    </div>,
    document.getElementById('bar-container')
  );
}

update();