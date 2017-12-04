const { defaultCapabilities } = require('./capabilitiesAndBaseOpts')

const {
    resizeWindow,
    killSession,
    initSession,
    goToUrl,
    getUrl,
    getTitle,
    executeScript,
    sleep,
    waitCondition
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

    async sleep(time) {
        await sleep(time)
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
        if (this.sessionId && global.___sessionId) {
            const { status } = await killSession(this.sessionId)
            this.sessionId = null
            global.___sessionId = null
            // !status && console.log('browser closed success')
        }
    }
}

class Initiator {
    constructor(seleniumPort = 4444) {
        global.__provider = {}
        this.port = seleniumPort
        this.url = null
        this.opts = null
        this.caps = null
    }
    chrome(directToChrome = false, capabilities = defaultCapabilities) {
        global.__provider.__chrome = directToChrome
        return new Browser(capabilities)
    }
}

module.exports = function (port) {
    return new Initiator(port)
}

module.exports.initiatorInstance = Initiator
module.exports.browserInstance = Browser
