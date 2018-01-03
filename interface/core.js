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

const WEB_EMENET_ID = 'element-6066-11e4-a52e-4f735466cecf'

const { urlPathes } = require('./path')
const {
  defaultChromeCapabilities,
  baseOptionsChrome,
  baseOptionsStandAlone,
  baseOptionsFirefox
} = require('./capabilitiesAndBaseOpts')

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
  const baseOptions = global.__provider && global.__provider.__chrome ? baseOptionsChrome : baseOptionsStandAlone

  const getPort = () => {
    if (!global.__provider) {
      return SELENIUM_PORT
    } else if (global.__provider.__chrome) {
      return CHROMEDRIVER_PORT
    } else if (global.__provider.__firefox) {
      return GECKODRIVER_PORT
    }
  } // this is useless function

  const portPath = () => {
    if (global.__provider && global.__provider.__chrome) {
      return `${CHROMEDRIVER_PORT}/`
    } else {
      return `${SELENIUM_PORT}/wd/hub/`
    }
  }

  const { fetchy_util } = fetchyInitializator(`http://localhost:${portPath()}`)

  return { baseOptions, fetchy_util }
}

async function syncWithDOM(sessionId, timeout, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const waitState = function () {
    return document.readyState === 'complete'
  }

  const fn = `const passedArgs = Array.prototype.slice.call(arguments,0);
      return ${waitState.toString()}.apply(window, passedArgs);`

  const requestDomState = () => fetchy_util.post(urlPathes.executeSync(sessionId), JSON.stringify({
    script: fn,
    args: []
  }), options)
  const result = await waitCondition(requestDomState, 3000)
  if (!result) {
    throw new InterfaceError('DOM mount does not complete')
  }
}

async function executeScript(sessionId, script, args = [], options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
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

  const { body, status } = await fetchy_util.post(urlPathes.executeSync(sessionId), JSON.stringify({
    script,
    args
  }), options)

  assertStatus(status, body)
  return body
}

async function executeScriptAsync(sessionId, script, args = [], options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
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

  const { body, status } = await fetchy_util.post(urlPathes.executeAsync(sessionId), JSON.stringify({
    script,
    args
  }), options)

  assertStatus(status, body)
  return body
}

async function getCurrentWindowHandle(sessionId, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()

  if (!options) options = { ...baseOptions }
  const { body, status } = await fetchy_util.get(urlPathes.windowHandle(sessionId), null, options)
  assertStatus(status, body)
  return body
}

async function getCurrentWindowHandles(sessionId, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(urlPathes.windowHandles(sessionId), null, options)
  assertStatus(status, body)
  return body
}

async function openTab(sessionId, nameHandle, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.window(sessionId), JSON.stringify({
    name: nameHandle, handle: nameHandle
  }), options)
  assertStatus(status, body)
  return body
}

async function closeCurrentTab(sessionId, options) {
  const { baseOptions, fetchy_util } = getLocalEnv()

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.del(urlPathes.window(sessionId), undefined, options)
  assertStatus(status, body)
  return body
}

async function getScreenshot(sessionId, options) {

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(urlPathes.screenshot(sessionId), null, options)
  assertStatus(status, body)
  return body
}

async function forwardHistory(sessionId, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.forward(sessionId), undefined, options)

  assertStatus(status, body)
  return body
}

async function backHistory(sessionId, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.back(sessionId), undefined, options)
  assertStatus(status, body)
  return body
}

async function refreshCurrentPage(sessionId, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.refresh(sessionId), undefined, options)
  assertStatus(status, body)
  return body
}

async function resizeWindow(sessionId, rect, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.currentSize(sessionId), JSON.stringify(rect), options)
  assertStatus(status, body)
  return body
}

async function getUrl(sessionId, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(urlPathes.url(sessionId), undefined, options)
  assertStatus(status, body)
  return body
}

async function clickElement(sessionId, elementId, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.click(sessionId, elementId), JSON.stringify({ button: 0 }), options)
  assertStatus(status, body)
  return body
}

async function submitElement(sessionId, elementId, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.submit(sessionId, elementId), undefined, options)
  assertStatus(status, body)
  return body
}

async function clearElementText(sessionId, elementId, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.clear(sessionId, elementId), undefined, options)

  assertStatus(status, body)
  return body
}

async function getElementText(sessionId, elementId, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(urlPathes.text(sessionId, elementId), undefined, options)

  assertStatus(status, body)
  return body
}

async function getTitle(sessionId, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(urlPathes.title(sessionId), undefined, options)

  assertStatus(status, body)
  return body
}

async function goToUrl(sessionId, url, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }
  const { body, status } = await fetchy_util.post(urlPathes.url(sessionId), JSON.stringify({
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

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }
  const { body, status } = await fetchy_util.post(urlPathes.element(sessionId), JSON.stringify(bodyRequest), options)
  assertStatus(status, body)

  body.value = { ELEMENT: body.value[Object.keys(body.value)[0]] }

  return body
}

async function toFrame(sessionId, selector, options) {
  let elementId;

  if (selector) {
    const { value: { ELEMENT } } = await findElement(sessionId, selector, options)
    elementId = ELEMENT;
  }
  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const requestBody = elementId ? { id: { [WEB_EMENET_ID]: elementId, ELEMENT: elementId } } : { id: null }

  const { body, status } = await fetchy_util.post(urlPathes.frame(sessionId), JSON.stringify(requestBody), options)
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
  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.elements(sessionId), JSON.stringify(bodyRequest), options)
  assertStatus(status, body)

  body.value = body.value.map(respPart => {
    return { ELEMENT: respPart[Object.keys(respPart)[0]] }
  })
  return body
}

async function initSession(data, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!data) data = JSON.stringify(defaultChromeCapabilities)
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.getSession(), data, options).catch(console.log)

  assertStatus(status, body)
  return body
}

async function sendKeys(sessionId, elementId, keysToSend, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  let text = null
  if (!options) options = { ...baseOptions }

  if (!Array.isArray(keysToSend)) {
    text = keysToSend
    keysToSend = keysToSend.split('')
  } else {
    text = keysToSend.join('')
    keysToSend = keysToSend
  }
  const { body, status } = await fetchy_util.post(urlPathes.sendKeys(sessionId, elementId), JSON.stringify({
    text,
    value: keysToSend
  }), options)

  assertStatus(status, body)
  return body
}

async function killSession(sessionId, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { status, body } = await fetchy_util.del(urlPathes.killSession(sessionId), undefined, options)

  assertStatus(status, body)
  return body
}

async function setScriptTimeout(sessionId, timeouts = {}, options) {
  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }
  //'script', 'implicit', 'page load'
  const keys = Object.keys(timeouts)

  for (const key of keys) {
    const { status, body } = await fetchy_util.post(urlPathes.timeouts(sessionId), JSON.stringify({
      type: key,
      ms: timeouts[key]
    }), options)
    assertStatus(status, body)
  }
}

async function getAttribute(sessionId, elementId, attribute, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }
  // console.log(elementId.match(/s/), typeof elementId)
  // console.log(elementId.toString())
  // const elId = elementIDregexp.test(elementId)
  // console.log([elementIDregexp.test(elementId), elId], elementId, elementId.match(elementIDregexp))
  /**
   * NEED EUGENE SUPPORT FOR THIS ISSUE
   */
  // if (!elementId.match(elementIDregexp)) {
  //   console.log(sessionId, elementId, attribute, '------------------------')
  //   const body = await findElement(sessionId, elementId)
  //   elementId = body.value.ELEMENT
  // }

  const { status, body } = await fetchy_util.get(urlPathes.attribute(sessionId, elementId, attribute), null, options)

  assertStatus(status, body)
  return body
}

//move buttonup buttondown
async function mouseDown(sessionId, element/*element can be css selector or elementId*/, position, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  element = { button: 0 }
  if (!options) options = { ...baseOptions }

  const { status, body } = await fetchy_util.post(urlPathes.buttonDown(sessionId), JSON.stringify({ element }), options)
  assertStatus(status, body)
  return body
}

function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

async function moveTo(sessionId, elementOrPosition, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }
  options.method = 'POST'
  options.path = urlPathes.moveto(sessionId)

  if (elementOrPosition.x || elementOrPosition.x) {
    elementOrPosition = { xoffset: elementOrPosition.x, yoffset: elementOrPosition.y }
  }
  const { status, body } = await fetchy_util.post(urlPathes.moveto(sessionId), JSON.stringify({ ...elementOrPosition }), options)

  assertStatus(status, body)
  return body
}

async function pressKeys(sessionId, keys, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  if (!Array.isArray(keys)) {
    keys = [keys]
  }
  const { body, status } = await fetchy_util(urlPathes.pressKeys(sessionId), JSON.stringify({ value: keys }), options)
  assertStatus(status, body)
  return body
}

async function elementFromElement(sessionId, elementId, selector, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }
  options.method = 'POST'
  options.path = urlPathes.elementFromElement(sessionId, elementId)

  const { body, status } = await fetchy_util.post(urlPathes.elementFromElement(sessionId, elementId), JSON.stringify({
    using: 'css selector', value: selector
  }), options)

  assertStatus(status, body)
  return body
}

async function elementsFromElement(sessionId, elementId, selector, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }
  const { body, status } = await fetchy_util.post(urlPathes.elementsFromElement(sessionId, elementId), JSON.stringify({
    using: 'css selector', value: selector
  }), options)
  assertStatus(status, body)
  return body
}

async function buttonUp(sessionId, button = { button: 0 }, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.pressKeys(sessionId), JSON.stringify({ button }), options)
  assertStatus(status, body)
}

async function displayed(sessionId, elementId, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(urlPathes.displayed(sessionId, elementId), null, options)
  assertStatus(status, body)
  return body
}

async function present(sessionId, elementId, options) {

  const { baseOptions, fetchy_util } = getLocalEnv()
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.get(urlPathes.present(sessionId, elementId), null, options)
  assertStatus(status, body)
  return body
}

module.exports = {
  sendKeys,
  displayed,
  toFrame,
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
  executeScriptAsync,
  clearElementText,
  setScriptTimeout
}
