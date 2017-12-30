const { elements, element } = require('./interface/element')
const browser = require('./interface/client')
const { Keys } = require('./interface/event/keys')

const { spawnStandalone, killProc } = require('./installer')

module.exports = {
    element,
    elements,
    Keys,
    client: browser
}