const { elements, element } = require('./interface/element')
const browser = require('./interface/client')

const { spawnStandalone, killProc } = require('./macOSinstaller')


module.exports = {
    element,
    elements,
    client: browser
}