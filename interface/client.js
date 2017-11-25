const { defaultCapabilities, baseOptions } = require('./capabilitiesAndBaseOpts')

const {
    resizeWindow,
    killSession,
    initSession,
    findElements,
    findElement,
    goToUrl,
    getUrl,
    getTitle,
    clickElement,
    sendKeys,
    executeScript,
    syncWithDOM
  } = require('./core')


function Client() {
    this.port = null
    this.url = null
    this.opts = null
    this.caps = null
    this.sessionId = null
}

Client.prototype.chrome = function (caps) {
    this.caps = caps
}

Client.prototype.click = async function (selector) {
    await clickElement(this.sessionId)
}