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


class Browser {

    constructor(capabilities) {
        this.sessionId = null
        this.capabilities = capabilities
    }

    async getSession() {
        const { sessionId } = await initSession(this.capabilities)
        this.sessionId = sessionId
        global.___sessionId = this.sessionId
    }

    async getUrl() {
        if (!this.sessionId) {
            console.error('Cant do it, session does not open')
        }
        const { value } = await getUrl(this.sessionId)
        return value
    }

    async getTitle() {
        if (!this.sessionId) {
            console.error('Cant do it, session does not open')
        }
        const { value } = await getTitle(this.sessionId)
        return value
    }

    async goTo(url) {
        !this.sessionId
            && await this.getSession()
        await goToUrl(this.sessionId, url)
    }

    async closeBrowser() {
        console.log('close browser')
        if (this.sessionId && global.___sessionId) {
            const { status } = await killSession(this.sessionId)
            this.sessionId = null
            global.___sessionId = null
            !status && console.log('browser closed success')
        }
    }
}

class Initiator {
    constructor(seleniumPort = 4444) {
        this.port = seleniumPort
        this.url = null
        this.opts = null
        this.caps = null
    }
    chrome(capabilities = defaultCapabilities) {
        return new Browser(capabilities)
    }
}

module.exports = function (port) {
    return new Initiator(port)
}

module.exports.initiatorInstance = Initiator
module.exports.browserInstance = Browser
