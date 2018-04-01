const elementsInitializer = require('./element')
const {waitElementPresent, waitCondition} = require('./util')
const fetchy = require('./fetchy')
const {initElement, initElements} = require('./byStrategy')
const nodeUrl = require('url')

const LOCAL = ['localhost', '127.0.0.1']

const {InterfaceError, handledErrors} = require('./interfaceError')

const {STATUS_FROM_DRIVER} = require('./responseSeleniumStatus')

const {Keys} = require('./event/keys')

const initializator = require('./core')
const path = require('path')
const RUN_PROCCESS = require('./vars')

const mergeObjects = (target = {}, initial) => {
  Object.keys(initial).forEach((key) => {
    if(typeof initial[key] === 'object') {target[key] = mergeObjects(target[key], initial[key])}
    if(!target[key] && !(key in target)) {
      target[key] = initial[key]
    }
  })
  return target
}

function StartProvider(config) {
  const {fork} = require('child_process')

  const forked = fork(path.resolve(__dirname, './webdriver.js'))

  forked.send({msg: 'startDriver', data: config})

  return new Promise((resolve) => {
    forked.on('message', ({msg}) => {
      if(msg === RUN_PROCCESS.SUCCESS_RUN) {
        resolve(forked)
      } else if(msg === RUN_PROCCESS.ADDRESS_IS_USE) {
        forked.kill()
        throw Error(RUN_PROCCESS.ADDRESS_IS_USE)
        resolve(RUN_PROCCESS.ADDRESS_IS_USE)
      } else if(msg === RUN_PROCCESS.UNHANDLED_EXCEPTION) {
        forked.kill()
        throw Error(RUN_PROCCESS.UNHANDLED_EXCEPTION)
        resolve(RUN_PROCCESS.UNHANDLED_EXCEPTION)
      }
    })
  }).then((proc) => {
    if(proc) {
      proc.on('message', (msg) => {
        if(msg = 'server stoped') {
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
      if(msg === 'server stoped') {
        resolve()
      }
    })
    proc.send({msg: 'stop'})
  })
}

function initializatorClient(requests, opts) {
  const {desiredCapabilities, baseUrl} = opts

  const {resizeWindow, killSession, initSession, goToUrl, getUrl, getTitle, executeScript, sleep, backHistory} = requests
  const {closeApp, getContexts, launchApp, getCurrentActivity, getCurrentPackage, lock, reset, rotate, shake, forwardHistory} = requests
  const {getWindowSize, getCurrentWindowHandle, getCurrentWindowHandles, toFrame, parentFrame, findElement, refresh} = requests

  async function callWithWrap(action, ...rest) {
    const driverResp = await action(this.sessionId, ...rest)
    const {err, errorType} = handledErrors(driverResp.status)
    if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
    return driverResp.value
  }

  class Client {
    constructor() {
      this.Keys = Keys
      this.sessionId = null
      this.capabilities = desiredCapabilities
      this.seleniumProc = null
    }

    async getSize() {
      const currentWindowId = await this.getCurrentBrowserTab()
      const driverResp = await getWindowSize(this.sessionId, currentWindowId)
      const {err, errorType} = handledErrors(driverResp.status)
      if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
      return driverResp.value
    }

    get localStorage() {
      return {
        set: async (key, value) => {
          const driverResp = await executeScript(this.sessionId, function(data) {
            const [key, value] = data
            localStorage.setItem(key, value)
          }, [key, value])
          const {err, errorType} = handledErrors(driverResp.status)
          if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
          return driverResp.value
        },
        get: async (key) => {
          const driverResp = await executeScript(this.sessionId, function(data) {
            const [key] = data
            return localStorage.getItem(key)
          }, key)
          const {err, errorType} = handledErrors(driverResp.status)
          if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
          return driverResp.value
        },
        clear: async () => {
          const driverResp = await executeScript(this.sessionId, function() {localStorage.clear()})
          const {err, errorType} = handledErrors(driverResp.status)
          if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
          return driverResp.value
        },
        getAll: async () => {
          const driverResp = await executeScript(this.sessionId, function() {
            return JSON.stringify(localStorage)
          })
          const {err, errorType} = handledErrors(driverResp.status)
          if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
          return JSON.stringify(driverResp.value)
        }
      }
    }

    get sessionStorage() {
      return {
        set: async (key, value) => {
          const driverResp = await executeScript(this.sessionId, function(data) {
            const [key, value] = data
            sessionStorage.setItem(key, value)
          }, [key, value])
          const {err, errorType} = handledErrors(driverResp.status)
          if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
          return driverResp.value
        },
        get: async (key) => {
          const driverResp = await executeScript(this.sessionId, function(data) {
            const [key] = data
            return sessionStorage.getItem(key)
          }, key)
          const {err, errorType} = handledErrors(driverResp.status)
          if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
          return driverResp.value
        },
        clear: async () => {
          const driverResp = await executeScript(this.sessionId, function() {sessionStorage.clear()})
          const {err, errorType} = handledErrors(driverResp.status)
          if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
          return driverResp.value
        },
        getAll: async () => {
          const driverResp = await executeScript(this.sessionId, function() {
            return JSON.stringify(sessionStorage)
          })
          const {err, errorType} = handledErrors(driverResp.status)
          if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
          return driverResp.value
        }
      }
    }

    async refresh() {
      const driverResp = await refresh(this.sessionId)
      const {err, errorType} = handledErrors(driverResp.status)
      if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
      return driverResp.value
    }

    async back() {
      const driverResp = await backHistory(this.sessionId)
      const {err, errorType} = handledErrors(driverResp.status)
      if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
      return driverResp.value
    }

    async forward() {
      const driverResp = await forwardHistory(this.sessionId)
      const {err, errorType} = handledErrors(driverResp.status)
      if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
      return driverResp.value
    }

    async takeScreenshot() {
      !this.sessionId && await this.getSession()
      const driverResp = await getScreenshot(this.sessionId)
      const {err, errorType} = handledErrors(driverResp.status)

      return driverResp.value
    }

    async waitForUrlIncludes(url, time) {
      !this.sessionId && await this.getSession()

      const condition = await waitCondition(getUrl.bind(this, this.sessionId), ({value}) => {
        return value.includes(url)
      }, time)
      if(condition.err) throw new InterfaceError(`Url does not contain ${url} after time ${time} ms`)
    }

    async waitForTitleInclude(title, time) {
      !this.sessionId && await this.getSession()

      const condition = await waitCondition(getTitle.bind(this, this.sessionId), ({value}) => {
        return value.includes(url)
      }, time)

      if(condition.err) throw new InterfaceError(`Title does not contain ${title} after time ${time} ms`)
    }

    async resizeWindow(width, height) {
      if(typeof width !== 'number' || typeof height !== 'number') {
        throw new InterfaceError('Width and height should be a number')
      }
      !this.sessionId && await this.getSession()
      const body = await resizeWindow(this.sessionId, {width, height})
    }

    async startDriver() {
      const proc = await StartProvider(opts)
      this.seleniumProc = proc
    }

    async stopDriver() {
      await WaitProviderStop(this.seleniumProc, process)
    }

    async switchToFrame(selector, time = 500) {
      !this.sessionId && await this.getSession()
      const {value, error} = await waitElementPresent(findElement, this.sessionId, selector, time)
      if(error) throw new InterfaceError(error.toString())

      return callWithWrap.call(this, toFrame, value.ELEMENT)
    }

    async switchBack() {
      return callWithWrap.call(this, parentFrame)
    }

    async getSession() {
      const driverResp = await initSession({desiredCapabilities: {...this.capabilities}})
      const {err, errorType} = handledErrors(driverResp.status)
      if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})

      this.sessionId = driverResp.sessionId
      // if(!global.___sessionId) {
      //   global.___sessionId = this.sessionId
      // }
      if(this.timeouts) {
        const driverResp = await setScriptTimeout(this.sessionId, this.timeouts)
        const {err, errorType} = handledErrors(driverResp.status)
        if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
      }
      return driverResp.value
    }

    async closeCurrentTab() {
      return callWithWrap.call(this, closeCurrentTab)
    }

    async executeScript(script, ...args) {
      return callWithWrap.call(this, executeScript, script, args)
    }

    async executeScriptAsync(script, ...args) {
      return callWithWrap.call(this, executeScriptAsync, script, args)
    }

    async getUrl() {
      if(!this.sessionId) {
        console.error('Cant do it, session does not open')
      }
      return callWithWrap.call(this, getUrl)
    }

    async sleep(time) {
      return sleep(time)
    }

    async getTitle() {
      if(!this.sessionId) {
        console.error('Cant do it, session does not open')
      }
      return callWithWrap.call(this, getTitle)
    }

    async goTo(url = '') {
      if(baseUrl) {
        url = nodeUrl.resolve(baseUrl, url)
      }
      !this.sessionId && await this.getSession()
      return callWithWrap.call(this, goToUrl, url)
    }

    async getBrowserTabs() {
      !this.sessionId && await this.getSession()
      return callWithWrap.call(this, getCurrentWindowHandles)
    }

    async getCurrentBrowserTab() {
      !this.sessionId && await this.getSession()
      return callWithWrap.call(this, getCurrentWindowHandle)
    }

    async switchToTab(index) {
      const tabs = await this.getBrowserTabs()
      if(tabs.length <= index) {
        console.error('tabs quantity less then index')
        return
      }
      return callWithWrap.call(this, openTab, tabs[index])
    }

    async close() {
      if(this.sessionId) {
        if(this.sessionId === global.___sessionId) global.___sessionId = null
        const driverResp = await killSession(this.sessionId)
        const {err, errorType} = handledErrors(driverResp.status)
        if(err) err({sessionId: this.sessionId, additionalMessage: JSON.stringify(driverResp.value)})
        this.sessionId = null
        return driverResp.value
      }
    }
  }

  return {Client}
}

const defautlOpts = {
  withStandalone: true,
  remote: false,
  directConnect: false,
  desiredCapabilities: {
    javascriptEnabled: true,
    acceptSslCerts: true,
    platform: 'ANY',
    browserName: 'chrome'
  },
  host: 'localhost',
  port: 4444,
  timeout: 5000
}

module.exports = function(opts = defautlOpts) {
  let baseRequestUrl = null
  !opts.mobile && (opts = mergeObjects(opts, defautlOpts))

  const {withStandalone, remote, directConnect, host, port, timeout, desiredCapabilities} = opts

  if(LOCAL.includes(host) && !remote) {
    baseRequestUrl = withStandalone ? `http://127.0.0.1:${port}/wd/hub/` : `http://127.0.0.1:${port}/`
  } else if(remote) {
    baseRequestUrl = host
    baseRequestUrl = baseRequestUrl[baseRequestUrl.length - 1] === '/' ? baseRequestUrl : `${baseRequestUrl}/`
  }

  const baseRequest = {
    get: fetchy.bind(fetchy, "GET", baseRequestUrl, timeout),
    post: fetchy.bind(fetchy, "POST", baseRequestUrl, timeout),
    put: fetchy.bind(fetchy, "PUT", baseRequestUrl, timeout),
    del: fetchy.bind(fetchy, "DELETE", baseRequestUrl, timeout)
  }

  const requests = initializator(baseRequest)

  const {Client} = initializatorClient(requests, opts)

  const client = new Client()

  const {Element, Elements} = elementsInitializer(requests, client)

  const element = initElement(Element)
  const elements = initElements(Elements)

  return {
    element,
    elements,
    client
  }
}
