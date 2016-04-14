import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {createClassFromSpec} from './react-vega.js';

const Vis = createClassFromSpec('RawRadialHeatmap', function(){
  const numCircles = 31; // should be determined from data.length, but this is sufficient for now.
  const width = 450;
  const height = width / 2 + 1;
  const strokeWidth = (width / numCircles) / 2;

  return {
    'width': width,
    'height': height,
    'padding': { 'top': 0, 'left': 0, 'bottom': 0, 'right': 0 },
    'signals': [
      {
        'name': 'hover', 'init': null,
        'streams': [
          {'type': '@ring:mouseover', 'expr': 'datum'},
          {'type': '@ring:mouseout', 'expr': 'null'}
        ]
      }
    ],
    'data': [{'name': 'points'}, {'name': 'highlightedPoint'}],
    'scales': [
      {
        'name': 'r',
        'type': 'pow',
        'domain': {'data': 'points', 'field': 'distance'},
        'exponent': 2,
        // From the vega-scenegraph source code: r = sqrt(size / Math.PI) ==> size = r^2 * Math.PI.
        'range': [strokeWidth * Math.PI, Math.pow((width - strokeWidth) / 2, 2) * Math.PI]
      },
      {
        'name': 'color',
        'type': 'linear',
        'domain': {'data': 'points', 'field': 'value'},
        'range': ['#edf8b1', '#2c7fb8']
      }
    ],
    'marks': [
      {
        'type': 'symbol',
        'name': 'ring',
        'from': {'data': 'points'},
        'properties': {
          'enter': {
            'shape': 'circle',
            'x': {'value': width / 2},
            'y': {'value': 0},
            'stroke': {'scale': 'color', 'field': 'value'},
            'strokeWidth': {'value': strokeWidth},
            'fill': {'value': null},
            'size': {'scale': 'r', 'field': 'distance'}
          }
        }
      },
      {
        'type': 'symbol',
        'from': {'data': 'highlightedPoint'},
        'interactive': false,
        'properties': {
          'enter': {
            'x': {'value': width / 2},
            'y': {'value': 0},
            'stroke': { 'value': '#FA7F9F' },
            'strokeWidth': {'value': strokeWidth},
            'fill': {'value': null},
            'size': {'scale': 'r', 'field': 'distance'}
          }
        }
      }
    ]
  };
});

export default React.createClass({
  displayName: 'RadialHeatmap',
  mixins: [PureRenderMixin],
  propTypes: {
    data: PropTypes.array.isRequired,
    onHighlight: PropTypes.func,
    highlightedPoint: PropTypes.object
  },
  handleHover(signal, datum){
    const { onHighlight } = this.props;
    if (onHighlight) {
      onHighlight(datum);
    }
  },
  render(){
    const visData = {
      points: this.props.data,
      highlightedPoint: [this.props.highlightedPoint]
    };
    return (
      <Vis data={visData} renderer={'canvas'} onSignalHover={this.handleHover} />
    );
  }
});