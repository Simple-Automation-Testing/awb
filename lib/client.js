const elementsInitializer = require('./element')
const fetchy = require('./fetchy')

const nodeUrl = require('url')

const LOCAL = ['localhost', '127.0.0.1']

const { InterfaceError, handledErrors } = require('./interfaceError')

const { STATUS_FROM_DRIVER } = require('./responseSeleniumStatus')

const { Keys } = require('./event/keys')

const initializator = require('./core')
const path = require('path')
const RUN_PROCCESS = require('./vars')

const mergeObjects = (target = {}, initial) => {
  Object.keys(initial).forEach((key) => {
    if (typeof initial[key] === 'object') { target[key] = mergeObjects(target[key], initial[key]) }
    if (!target[key] && !(key in target)) {
      target[key] = initial[key]
    }
  })
  return target
}

function StartProvider(config) {
  const { fork } = require('child_process')

  const forked = fork(path.resolve(__dirname, './webdriver.js'))

  forked.send({ msg: 'startDriver', data: config })

  return new Promise((resolve) => {
    forked.on('message', ({ msg }) => {
      if (msg === RUN_PROCCESS.SUCCESS_RUN) {
        resolve(forked)
      } else if (msg === RUN_PROCCESS.ADDRESS_IS_USE) {
        forked.kill()
        throw Error(RUN_PROCCESS.ADDRESS_IS_USE)
        resolve(RUN_PROCCESS.ADDRESS_IS_USE)
      } else if (msg === RUN_PROCCESS.UNHANDLED_EXCEPTION) {
        forked.kill()
        throw Error(RUN_PROCCESS.UNHANDLED_EXCEPTION)
        resolve(RUN_PROCCESS.UNHANDLED_EXCEPTION)
      }
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

function initializatorClient(requests, opts) {
  const { desiredCapabilities, baseUrl } = opts

  const { resizeWindow, killSession, initSession, goToUrl, getUrl, getTitle, executeScript, sleep, waitCondition } = requests
  const { closeApp, getContexts, launchApp, getCurrentActivity, getCurrentPackage, lock, reset, rotate, shake } = requests
  const { getWindowSize, getCurrentWindowHandle, getCurrentWindowHandles, toFrame } = requests

  class Client {
    constructor() {
      this.Keys = Keys
      this.sessionId = null
      this.capabilities = desiredCapabilities
      this.seleniumProc = null
    }

    async getSize() {
      const currentWindowId = await this.getCurrentBrowserTab()
      const body = await getWindowSize(this.sessionId, currentWindowId)
      handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'take screenshot', JSON.stringify(body.value))
      return body.value
    }

    get localStorage() {
      return {
        set: async (key, value) => {
          await executeScript(this.sessionId, function (data) {
            const [key, value] = data
            localStorage.setItem(key, value)
          }, [key, value])
        },
        get: async (key) => {
          const data = await executeScript(this.sessionId, function (data) {
            const [key] = data
            return localStorage.getItem(key)
          }, key)
          return data
        },
        clear: async () => {
          await executeScript(this.sessionId, function () { localStorage.clear() })
        },
        getAll: async () => {
          const data = await executeScript(this.sessionId, function () {
            return JSON.stringify(localStorage)
          })
          return JSON.parse(data)
        }
      }
    }

    get sessionStorage() {
      return {
        set: async (key, value) => {
          await executeScript(this.sessionId, function (data) {
            const [key, value] = data
            sessionStorage.setItem(key, value)
          }, [key, value])
        },
        get: async (key) => {
          const data = await executeScript(this.sessionId, function (data) {
            const [key] = data
            return sessionStorage.getItem(key)
          }, key)
          return data
        },
        clear: async () => {
          await executeScript(this.sessionId, function () { sessionStorage.clear() })
        },
        getAll: async () => {
          const data = await executeScript(this.sessionId, function () {
            return JSON.stringify(sessionStorage)
          })
          return JSON.parse(data)
        }
      }
    }

    async refresh() {
      const body = await refreshCurrentPage(this.sessionId)
      return body
    }

    async back() {
      const body = await backHistory(this.sessionId)
      return body
    }

    async forward() {
      await forwardHistory(this.sessionId)
    }

    async takeScreenshot() {
      !this.sessionId
        && await this.getSession()
      const data = await getScreenshot(this.sessionId)
      handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'take screenshot', JSON.stringify(body.value))
      return data.value
    }

    async waitForUrlIncludes(url, time) {
      !this.sessionId
        && await this.getSession()
      const condition = await waitCondition(getUrl.bind(this, this.sessionId), time, url)
    }

    async resizeWindow(width, height) {
      if (typeof width !== 'number' || typeof height !== 'number') {
        throw new InterfaceError('Width and height should be a number')
      }
      !this.sessionId
        && await this.getSession()
      const body = await resizeWindow(this.sessionId, { width, height })
      handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'resize window', JSON.stringify(body.value))
    }

    async startDriver() {
      const proc = await StartProvider(opts)
      this.seleniumProc = proc
    }

    async stopDriver() {
      await WaitProviderStop(this.seleniumProc, process)
    }

    async switchToFrame(selector, time = 500) {
      const frameBody = await waitElementPresent(findElement, this.sessionId, selector, time)
      console.log(frameBody)
      handledErrors[STATUS_FROM_DRIVER[frameBody.status]] && handledErrors[STATUS_FROM_DRIVER[frameBody.status]](this.sessionId, 'get frame selector', JSON.stringify(frameBody.value))
      const body = await toFrame(this.sessionId, frameBody)
      handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'init session', JSON.stringify(body.value))
      return body
    }

    async getSession() {
      const body = await initSession({ desiredCapabilities: { ...this.capabilities } })
      handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'init session', JSON.stringify(body.value))
      this.sessionId = body.sessionId
      if (!global.___sessionId) {
        global.___sessionId = this.sessionId
      }
      if (this.timeouts) {
        const body = await setScriptTimeout(this.sessionId, this.timeouts)
        handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'init session', JSON.stringify(body.value))
      }
    }

    async closeCurrentTab() {
      const body = await closeCurrentTab(this.sessionId)
      handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'init session', JSON.stringify(body.value))
      return body
    }

    async executeScript(script, ...args) {
      const body = await executeScript(this.sessionId, script, args)
      handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'execute script', JSON.stringify(body.value))
      if (body.value) {
        return body.value
      }
    }

    async executeScriptAsync(script, ...args) {
      const body = await executeScriptAsync(this.sessionId, script, args)
      handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'execute script async', JSON.stringify(body.value))
      if (body.value) {
        return body.value
      }
    }

    async getUrl() {
      if (!this.sessionId) {
        console.error('Cant do it, session does not open')
      }
      const body = await getUrl(this.sessionId)
      handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'get url', JSON.stringify(body.value))
      return body.value
    }

    async sleep(time) {
      return await sleep(time)
    }

    async getTitle() {
      if (!this.sessionId) {
        console.error('Cant do it, session does not open')
      }
      const body = await getTitle(this.sessionId)
      handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'get title', JSON.stringify(body.value))
      return body.value
    }

    async goTo(url = '') {
      if (baseUrl) {
        url = nodeUrl.resolve(baseUrl, url)
      }
      !this.sessionId
        && await this.getSession()
      const body = await goToUrl(this.sessionId, url)
      handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'go to url', JSON.stringify(body.value))
      return body
    }

    async getBrowserTabs() {
      !this.sessionId
        && await this.getSession()
      const body = await getCurrentWindowHandles(this.sessionId)
      handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'get browser tabs', JSON.stringify(body.value))
      return body.value
    }

    async getCurrentBrowserTab() {
      !this.sessionId
        && await this.getSession()
      const body = await getCurrentWindowHandle(this.sessionId)
      handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'get browser tabs', JSON.stringify(body.value))
      return body.value
    }

    async switchToTab(index) {
      const tabs = await this.getBrowserTabs()
      if (tabs.length <= index) {
        console.error('tabs quantity less then index')
        return
      }
      const body = await openTab(this.sessionId, tabs[index])
      handledErrors[STATUS_FROM_DRIVER[body.status]] && handledErrors[STATUS_FROM_DRIVER[body.status]](this.sessionId, 'get browser tabs', JSON.stringify(body.value))
      return body.value
    }

    async closeBrowser() {
      if (this.sessionId) {
        if (this.sessionId === global.___sessionId) global.___sessionId = null
        const { status } = await killSession(this.sessionId)
        this.sessionId = null
      }
    }
  }

  return { Client }
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

module.exports = function (opts = defautlOpts) {
  let baseRequestUrl = null
  !opts.mobile && (opts = mergeObjects(opts, defautlOpts))
  const { withStandalone, remote, directConnect, browser, host, port, path, timeout, desiredCapabilities } = opts

  if (LOCAL.includes(host) && !remote) {
    baseRequestUrl = withStandalone ? `http://127.0.0.1:${port}/wd/hub/` : `http://127.0.0.1:${port}/`
  } else if (remote) {
    baseRequestUrl = `${host}${port ? ':' + port + '/' : '/'}`
  }

  const baseRequest = {
    get: fetchy.bind(fetchy, "GET", baseRequestUrl, timeout),
    post: fetchy.bind(fetchy, "POST", baseRequestUrl, timeout),
    put: fetchy.bind(fetchy, "PUT", baseRequestUrl, timeout),
    del: fetchy.bind(fetchy, "DELETE", baseRequestUrl, timeout)
  }

  const requests = initializator(baseRequest)

  const { Client } = initializatorClient(requests, opts)

  const client = new Client()

  const { Element, Elements } = elementsInitializer(requests, client)

  return {
    element: (...args) => new Element(...args),
    elements: (...args) => new Elements(...args),
    client
  }
}
