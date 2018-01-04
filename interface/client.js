const {
  defaultChromeCapabilities,
  defaultFirefoxCapabilities,
  timeout
} = require('./capabilitiesAndBaseOpts')
const { InterfaceError } = require('./interfaceError')

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
  findElement,
  toFrame,
  getScreenshot,
  executeScriptAsync
  } = require('./core')

const path = require('path')

function StartProvider() {
  const { fork } = require('child_process')
  const path = require('path')

  const forked = fork(path.resolve(__dirname, './webdriver.js'))

  forked.send({ msg: 'startStandalone' })

  return new Promise((resolve) => {
    forked.on('message', ({ msg }) => {
      if (msg === 'server started') {
        resolve(forked)
      } else if (msg === 'selenium already started on port 4444') {
        forked.kill()
        console.log('selenium already started on port 4444')
      }
      resolve()
    })
  }).then((proc) => {
    if (proc) {
      proc.on('message', (msg) => {
        if (msg = 'server stoped') {
          proc.kill()
        }
      })
      return proc
    }
  })
}

function WaitProviderStop(proc, parentProc) {
  return new Promise((resolve) => {

    proc.on('message', (msg) => {
      if (msg === 'server stoped') {
        resolve()
      }
    })
    proc.send({ msg: 'stop' })
  })
}

class Browser {

  constructor(capabilities, timeouts) {
    this.sessionId = null
    this.capabilities = capabilities
    this.seleniumProc = null
    this.timeouts = timeouts
    if (timeouts && timeouts['request']) {
      timeout = timeouts['request']
      Reflect.deleteProperty(timeouts, 'request')
    }
  }

  async takeScreenshot() {
    !this.sessionId
      && await this.getSession()
    const data = await getScreenshot(this.sessionId)
    return data.value
  }

  async resizeWindow(width, height) {
    if (typeof width !== 'number' || typeof height !== 'number') {
      throw new InterfaceError('Width and height should be a number')
    }
    !this.sessionId
      && await this.getSession()
    await resizeWindow(this.sessionId, { width, height })
  }

  async startSelenium() {
    const proc = await StartProvider()
    this.seleniumProc = proc
  }

  async switchToFrame(selector) {
    const body = await toFrame(this.sessionId, selector)
  }

  async stopSelenium() {
    await WaitProviderStop(this.seleniumProc, process)
  }

  async getSession() {
    const { sessionId } = await initSession(this.capabilities)
    this.sessionId = sessionId
    if (!global.___sessionId) {
      global.___sessionId = this.sessionId
    }

    if (this.timeouts) {
      await setScriptTimeout(this.sessionId, this.timeouts)
    }
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

  async executeScriptAsync(script, args) {
    const result = await executeScriptAsync(this.sessionId, script, args)
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
    if (this.sessionId) {
      if (this.sessionId === global.___sessionId) global.___sessionId = null
      const { status } = await killSession(this.sessionId)
      this.sessionId = null
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
  chrome(directToChrome = false, timeouts = null, capabilities = JSON.stringify(defaultChromeCapabilities)) {
    global.__provider.__chrome = directToChrome
    return new Browser(capabilities, timeouts)
  }
  firefox(directToGecko = false, timeouts, capabilities = JSON.stringify(defaultFirefoxCapabilities)) {
    global.__provider.__firefox = directToGecko
    return new Browser(capabilities, timeouts)
  }
}

module.exports = function (port) {
  return new Initiator(port)
}

module.exports.initiatorInstance = Initiator
module.exports.browserInstance = Browser
