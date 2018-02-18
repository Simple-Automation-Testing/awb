const { elements, element } = require('./interface/element')
const browser = require('./interface/client')
const { Keys } = require('./interface/event/keys')

module.exports = {
    element,
    elements,
    Keys,
    client: browser
}