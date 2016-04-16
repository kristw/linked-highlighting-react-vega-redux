import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {createClassFromSpec} from 'react-vega';
// import {createClassFromSpec} from './react-vega.js';

const Vis = createClassFromSpec('RawLineChart', {
  'width': 400,
  'height': 400,
  'padding': { 'top': 10, 'left': 50, 'bottom': 50, right: 10 },
  'signals': [
    {
      'name': 'hover', 'init': null,
      'streams': [
        { 'type': '@cell:mouseover', 'expr': 'datum' },
        { 'type': '@cell:mouseout', 'expr': 'null' }
      ]
    }
  ],
  'data': [{ 'name': 'points' }, { 'name': 'highlightedPoint' }],
  'scales': [
    {
      'name': 'x',
      'type': 'linear',
      'domain': { 'data': 'points', 'field': 'distance' },
      'range': 'width'
    },
    {
      'name': 'y',
      'type': 'linear',
      'domain': { 'data': 'points', 'field': 'value' },
      'range': 'height',
      'nice': true
    }
  ],
  'axes': [
    {
      'type': 'x',
      'scale': 'x',
      'offset': 5,
      'ticks': 5,
      'title': 'Distance',
      'layer': 'back'
    },
    {
      'type': 'y',
      'scale': 'y',
      'offset': 5,
      'ticks': 5,
      'title': 'Value',
      'layer': 'back'
    }
  ],
  'marks': [
    {
      'type': 'line',
      'from': { 'data': 'points' },
      'interactive': false, // <-- to prevent interaction with the mouse, so the voronoi cells get it all
      'properties': {
        'enter': {
          'x': { 'scale': 'x', 'field': 'distance' },
          'y': { 'scale': 'y', 'field': 'value' },
          'stroke': { 'value': '#5357a1' },
          'strokeWidth': { 'value': 2 }
        }
      }
    },
    {
      'type': 'path',
      'name': 'cell',
      'from': {
        'mark': 'points',
        'transform': [
          { 'type': 'voronoi', 'x': 'x', 'y': 'y' }
        ]
      },
      'properties': {
        'update': {
          'path': { 'field': 'layout_path' },
          'stroke': { 'value': null},
          'fill': { 'value': 'rgba(0,0,0,0)' }
        }
      }
    },
    {
      'type': 'symbol',
      'from': { 'data': 'highlightedPoint' },
      'interactive': false, // <-- to prevent interaction with the mouse to prevent flickering
      'properties': {
        'enter': {
          'x': { 'scale': 'x', 'field': 'distance' },
          'y': { 'scale': 'y', 'field': 'value' },
          'fill': { 'value': '#fa7f9f' },
          'stroke': { 'value': '#891836' },
          'strokeWidth': { 'value': 1 },
          'size': { 'value': 64 }
        }
      }
    }
  ]
});

export default React.createClass({
  displayName: 'LineChart',
  mixins: [PureRenderMixin],
  propTypes: {
    data: PropTypes.array.isRequired,
    onHighlight: PropTypes.func,
    highlightedPoint: PropTypes.object
  },
  handleHover(signal, d){
    const { onHighlight } = this.props;

    // we only care if onHighlight exists
    if(onHighlight){
      onHighlight(d ? d.datum : null)
    }
  },
  render(){
    const visData = {
      points: this.props.data,
      highlightedPoint: [this.props.highlightedPoint]
    };
    return (
      <Vis data={visData} renderer={'svg'} onSignalHover={this.handleHover} />
    );
  }
});