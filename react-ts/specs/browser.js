const { JSDOM } =  require('jsdom')
const hook = require('css-modules-require-hook')


const exposedProperties = ['window', 'navigator', 'document']

hook({
  generateScopedName: '[name]__[local]___[hash:base64:5]'
})

const { window: win, window: { document: doc } } = new JSDOM('<!doctype html><html>' +
  '<body>' +
  '</body>' +
  '</html>', {
    beforeParse(window) {
      window.alert = window.console.log.bind(window.console)
      window.open = () => window.console.log('open')
    },
    url: 'http://localhost'
  })


global.window = win
global.document = doc
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})

global.navigator = {
  userAgent: 'node.js'
}

global.documentRef = document

hook({
  generateScopedName: '[name]__[local]___[hash:base64:5]',
  extensions: ['.sass', '.scss', '.css'],
})