const { elements, element } = require('./interface/element')
const browser = require('./interface/client')

const { spawnStandalone, killProc } = require('./installer')

module.exports = {
    element,
    elements,
    client: browser
}