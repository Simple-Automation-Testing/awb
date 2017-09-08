import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import register from 'ignore-styles';
import React from 'react'
import hook from 'css-modules-require-hook';
import { shallow, mount } from 'enzyme';

const exposedProperties = ['window', 'navigator', 'document'];

hook({
  generateScopedName: '[name]__[local]___[hash:base64:5]'
});
const { window: win, window: { document: doc } } = new JSDOM('<!doctype html><html>' +
  '<body>' +
  '</body>' +
  '</html>', {
    beforeParse(window) {
      window.alert = window.console.log.bind(window.console)
      window.open = () => window.console.log('open')
    },
    url: 'http://localhost'
  });


global.window = win;
global.document = doc;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

global.documentRef = document;
global.React = React;

hook({
  generateScopedName: '[name]__[local]___[hash:base64:5]',
  extensions: ['.sass', '.scss', '.css'],
});