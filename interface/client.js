const {
    defaultChromeCapabilities,
    defaultFirefoxCapabilities
} = require('./capabilitiesAndBaseOpts')

const {
    resizeWindow,
    killSession,
    initSession,
    goToUrl,
    getUrl,
    getTitle,
    executeScript,
    sleep,
    waitCondition,
    getCurrentWindowHandles,
    getCurrentWindowHandle,
    openTab,
    closeCurrentTab,
    clickElement,
    setScriptTimeout,
    findElement
  } = require('./core')


class Browser {

    constructor(capabilities) {
        this.sessionId = null
        this.capabilities = capabilities
    }

    async getSession() {
        const { sessionId } = await initSession(this.capabilities)
        await setScriptTimeout(sessionId)
        this.sessionId = sessionId
        global.___sessionId = this.sessionId
    }

    async closeCurrentTab() {
        const resp = await closeCurrentTab(this.sessionId)
    }

    async executeScript(script, args) {
        const result = await executeScript(this.sessionId, script, args)
        if (result.value) {
            return result.value
        }
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
        // const { value: { ELEMENT } } = await findElement(this.sessionId, 'body')
        // await clickElement(this.sessionId, ELE)
    }

    async getBrowserTabs() {
        !this.sessionId
            && await this.getSession()
        const { value } = await getCurrentWindowHandles(this.sessionId)
        return value
    }

    async getCurrentBrowserTab() {
        !this.sessionId
            && await this.getSession()
        const { value } = await getCurrentWindowHandle(this.sessionId)
        return value
    }

    async switchToTab(index) {
        const tabs = await this.getBrowserTabs()
        if (tabs.length <= index) {
            console.error('tabs quantity less then index')
            return
        }
        const { value } = await openTab(this.sessionId, tabs[index])
    }

    async closeBrowser() {
        if (this.sessionId && global.___sessionId) {
            const { status } = await killSession(this.sessionId)
            this.sessionId = null
            global.___sessionId = null
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
    chrome(directToChrome = false, capabilities = JSON.stringify(defaultChromeCapabilities)) {
        global.__provider.__chrome = directToChrome
        return new Browser(capabilities)
    }
    firefox(directToGecko = false, capabilities = JSON.stringify(defaultFirefoxCapabilities)) {
        global.__provider.__firefox = directToGecko
        return new Browser(capabilities)
    }
}

module.exports = function (port) {
    return new Initiator(port)
}

module.exports.initiatorInstance = Initiator
module.exports.browserInstance = Browser
