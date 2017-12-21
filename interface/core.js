const {
  assertFunction,
  assertObject,
  assertArray,
  assertString,
  assertNumber,
  waitCondition,
  elementIDregexp
} = require('./util')

const SELENIUM_PORT = 4444
const CHROMEDRIVER_PORT = 9515
const GECKODRIVER_PORT = 9516

const fetchyInitializator = require('./fetchy')

const { PathesDirrectConnection, PathesStandAlone } = require('./path')
const {
  defaultChromeCapabilities,
  baseOptionsChrome,
  baseOptionsStandAlone,
  baseOptionsFirefox
} = require('./capabilitiesAndBaseOpts')

const { requestInterface } = require('./request')
const { InterfaceError } = require('./interfaceError')

const assertStatus = (status, body) => {
  if (
    !(status < 300) ||
    (body.value && typeof body.value === 'string' && body.value.includes('error')) ||
    (body.value && body.value.message && body.value.message.includes('stale element reference')) ||
    (body.value && body.value.message && body.value.message.includes('invalid'))
  ) {
    throw new InterfaceError(JSON.stringify(body))
  }
}

function getLocalEnv() {
  const Pathes = global.__provider && (global.__provider.__chrome || global.__provider.__firefox) ? PathesDirrectConnection : PathesStandAlone
  const baseOptions = global.__provider && global.__provider.__chrome ? baseOptionsChrome : baseOptionsStandAlone
  const getPort = () => {
    if (!global.__provider) {
      return SELENIUM_PORT
    } else if (global.__provider.__chrome) {
      return CHROMEDRIVER_PORT
    } else if (global.__provider.__firefox) {
      return GECKODRIVER_PORT
    }
  }
  const { fetchy_util } = fetchyInitializator(`http://localhost:${global.__provider && global.__provider.__chrome ? CHROMEDRIVER_PORT : SELENIUM_PORT}`)

  return { Pathes, baseOptions, fetchy_util }
}

async function syncWithDOM(sessionId, timeout, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const waitState = function () {
    return document.readyState === 'complete'
  }

  const fn = `const passedArgs = Array.prototype.slice.call(arguments,0);
      return ${waitState.toString()}.apply(window, passedArgs);`

  const requestDomState = () => fetchy_util.post(Pathes.executeSync(sessionId), JSON.stringify({
    script: fn,
    args: []
  }), options)
  const result = await waitCondition(requestDomState, 3000)
  if (!result) {
    throw new InterfaceError('DOM mount does not complete')
  }
}

async function executeScript(sessionId, script, args = [], options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (assertFunction(script)) {
    script = `const args = Array.prototype.slice.call(arguments,0)
              return ${script.toString()}.apply(window, args)`
  }
  if (!assertArray(args)) {
    if (assertObject(args) || assertFunction(args) || assertNumber(args) || assertString(args)) {
      args = [args]
    }
  }

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(Pathes.executeSync(sessionId), JSON.stringify({
    script,
    args
  }), options)
  assertStatus(status, body)
  return body
}

async function getCurrentWindowHandle(sessionId, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()

  if (!options) options = { ...baseOptions }
  const { body, status } = await fetchy_util.get(Pathes.windowHandle(sessionId), null, options)
  assertStatus(status, body)
  return body
}

async function getCurrentWindowHandles(sessionId, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(Pathes.windowHandles(sessionId), null, options)
  assertStatus(status, body)
  return body
}

async function openTab(sessionId, nameHandle, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(Pathes.window(sessionId), JSON.stringify({
    name: nameHandle, handle: nameHandle
  }), options)
  assertStatus(status, body)
  return body
}

async function closeCurrentTab(sessionId, options) {
  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.del(Pathes.window(sessionId), undefined, options)
  assertStatus(status, body)
  return body
}

async function getScreenshot(sessionId, options) {

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(Pathes.screenshot(sessionId), null, options)
  assertStatus(status, body)
  return body
}

async function forwardHistory(sessionId, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(Pathes.forward(sessionId), undefined, options)

  assertStatus(status, body)
  return body
}

async function backHistory(sessionId, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(Pathes.back(sessionId), undefined, options)
  assertStatus(status, body)
  return body
}

async function refreshCurrentPage(sessionId, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()

  if (!options) options = { ...baseOptions }
  options.method = 'POST'
  options.path = Pathes.refresh(sessionId)
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function resizeWindow(sessionId, rect, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(Pathes.currentSize(sessionId), JSON.stringify(rect), options)
  assertStatus(status, body)
  return body
}

async function getUrl(sessionId, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(Pathes.url(sessionId), undefined, options)
  assertStatus(status, body)
  return body
}

async function clickElement(sessionId, elementId, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(Pathes.click(sessionId, elementId), JSON.stringify({ button: 0 }), options)
  assertStatus(status, body)
  return body
}

async function submitElement(sessionId, elementId, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(Pathes.submit(sessionId, elementId), undefined, options)
  assertStatus(status, body)
  return body
}

async function clearElementText(sessionId, elementId, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(Pathes.clear(sessionId, elementId), undefined, options)

  assertStatus(status, body)
  return body
}

async function getElementText(sessionId, elementId, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(Pathes.text(sessionId, elementId), undefined, options)

  assertStatus(status, body)
  return body
}

async function getTitle(sessionId, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(Pathes.title(sessionId), undefined, options)

  assertStatus(status, body)
  return body
}

async function goToUrl(sessionId, url, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }
  const { body, status } = await fetchy_util.post(Pathes.url(sessionId), JSON.stringify({
    url
  }), options)
  assertStatus(status, body)
  return body
}
/**
   * @param {string} sessionId .
   * @param {string} selector css selector.
   * @param {object} options options.
 */
async function findElement(sessionId, selector, options) {
  let bodyRequest

  if (selector.includes('xpath: ')) {
    selector = selector.replace('xpath: ', '')
    bodyRequest = { using: 'xpath', value: selector }
  } else {
    bodyRequest = { using: 'css selector', value: selector }
  }

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }
  const { body, status } = await fetchy_util.post(Pathes.element(sessionId), JSON.stringify(bodyRequest), options)
  assertStatus(status, body)
  return body
}

async function findElements(sessionId, selector, options) {
  let bodyRequest

  if (selector.includes('xpath: ')) {
    selector = selector.replace('xpath: ', '')
    bodyRequest = { using: 'xpath', value: selector }
  } else {
    bodyRequest = { using: 'css selector', value: selector }
  }
  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(Pathes.elements(sessionId), JSON.stringify(bodyRequest), options)

  return body
}

async function initSession(data, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!data) data = JSON.stringify(defaultChromeCapabilities)
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(options.path, data, options).catch(console.log)

  assertStatus(status, body)
  return body
}

async function sendKeys(sessionId, elementId, keysToSend, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  let text = null
  if (!options) options = { ...baseOptions }

  if (!Array.isArray(keysToSend)) {
    text = keysToSend
    keysToSend = keysToSend.split('')
  } else {
    text = keysToSend.join('')
    keysToSend = keysToSend
  }
  const { body, status } = await fetchy_util.post(Pathes.sendKeys(sessionId, elementId), JSON.stringify({
    text,
    value: keysToSend
  }), options)

  assertStatus(status, body)
  return body
}

async function killSession(sessionId, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { status, body } = await fetchy_util.del(Pathes.killSession(sessionId), undefined, options)

  assertStatus(status, body)
  return body
}

async function setScriptTimeout(sessionId, type = "page load", ms = 250000, options) {
  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }
  // 'script', 'implicit', 'page load'
  const { status, body } = await fetchy_util.post(Pathes.timeouts(sessionId), JSON.stringify({
    type,
    ms
  }), options)
  await fetchy_util.post(Pathes.timeouts(sessionId), JSON.stringify({
    type: "script",
    ms
  }), options)
  await fetchy_util.post(Pathes.timeouts(sessionId), JSON.stringify({
    type: "implicit",
    ms
  }), options)
  assertStatus(status, body)
  return body
}

async function getAttribute(sessionId, elementId, attribute, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }
  // console.log(elementId.match(/s/), typeof elementId)
  // console.log(elementId.toString())
  // const elId = elementIDregexp.test(elementId)
  // console.log([elementIDregexp.test(elementId), elId], elementId, elementId.match(elementIDregexp))
  /**
   * NEED EUGENE SUPPORT FOR THIS ISSUE
   */
  if (!elementId.match(elementIDregexp)) {
    const body = await findElement(sessionId, elementId)
    elementId = body.value.ELEMENT
  }

  const { status, body } = await fetchy_util.get(Pathes.attribute(sessionId, elementId, attribute), null, options)

  assertStatus(status, body)
  return body
}

//move buttonup buttondown
async function mouseDown(sessionId, element/*element can be css selector or elementId*/, position, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  element = { button: 0 }
  if (!options) options = { ...baseOptions }

  const { status, body } = await fetchy_util.post(Pathes.buttonDown(sessionId), JSON.stringify({ element }), options)
  assertStatus(status, body)
  return body
}

function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

async function moveTo(sessionId, elementOrPosition, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }
  options.method = 'POST'
  options.path = Pathes.moveto(sessionId)

  if (elementOrPosition.x || elementOrPosition.x) {
    elementOrPosition = { xoffset: elementOrPosition.x, yoffset: elementOrPosition.y }
  }
  const { status, body } = await fetchy_util.post(Pathes.moveto(sessionId), JSON.stringify({ ...elementOrPosition }), options)

  assertStatus(status, body)
  return body
}

async function pressKeys(sessionId, keys, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  if (!Array.isArray(keys)) {
    keys = [keys]
  }
  const { body, status } = await fetchy_util(Pathes.pressKeys(sessionId), JSON.stringify({ value: keys }), options)
  assertStatus(status, body)
  return body
}

async function elementFromElement(sessionId, elementId, selector, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }
  options.method = 'POST'
  options.path = Pathes.elementFromElement(sessionId, elementId)

  const { body, status } = await fetchy_util.post(Pathes.elementFromElement(sessionId, elementId), JSON.stringify({
    using: 'css selector', value: selector
  }), options)

  assertStatus(status, body)
  return body
}

async function elementsFromElement(sessionId, elementId, selector, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }
  const { body, status } = await fetchy_util.post(Pathes.elementsFromElement(sessionId, elementId), JSON.stringify({
    using: 'css selector', value: selector
  }), options)
  assertStatus(status, body)
  return body
}

async function buttonUp(sessionId, button = { button: 0 }, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(Pathes.pressKeys(sessionId), JSON.stringify({ button }), options)
  assertStatus(status, body)
}

async function displayed(sessionId, elementId, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(Pathes.displayed(sessionId, elementId), null, options)
  assertStatus(status, body)
  return body
}

async function present(sessionId, elementId, options) {

  const { Pathes, baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(Pathes.present(sessionId, elementId), null, options)
  assertStatus(status, body)
  return body
}

module.exports = {
  sendKeys,
  displayed,
  present,
  elementFromElement,
  elementsFromElement,
  resizeWindow,
  moveTo,
  sleep,
  openTab,
  killSession,
  initSession,
  mouseDown,
  findElements,
  findElement,
  goToUrl,
  getUrl,
  closeCurrentTab,
  getTitle,
  clickElement,
  syncWithDOM,
  getElementText,
  waitCondition,
  getCurrentWindowHandles,
  getCurrentWindowHandle,
  getAttribute,
  executeScript,
  clearElementText,
  setScriptTimeout
}
