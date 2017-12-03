":" // exec /usr/bin/env node --harmony --expose-gc --trace-deprecation "$0" "$@"
const {
  assertFunction,
  assertObject,
  assertArray,
  assertString,
  assertNumber,
  waitCondition,
  elementIDregexp
} = require('./util')

const { Pathes } = require('./path')

const { defaultCapabilities, baseOptions } = require('./capabilitiesAndBaseOpts')
const { requestInterface } = require('./request')
const { InterfaceError } = require('./interfaceError')

const assertStatus = (status, body) => {
  if (!(status < 300) || (body.value && typeof body.value === 'string' && body.value.includes('error'))) {
    throw new InterfaceError(body)
  }
}

async function syncWithDOM(sessionId, timeout, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.executeSync(sessionId)

  const waitState = function () {
    return document.readyState === 'complete'
  }

  const fn = `const passedArgs = Array.prototype.slice.call(arguments,0);
      return ${waitState.toString()}.apply(window, passedArgs);`

  const requestDomState = () => requestInterface(options, JSON.stringify({
    script: fn,
    args: []
  }))
  const result = await waitCondition(requestDomState, 3000)
  if (!result) {
    throw new InterfaceError('DOM mount does not complete')
  }
}

async function executeScript(sessionId, script, args = [], options) {

  if (assertFunction(script)) {
    script = `const args = Array.prototype.slice.call(arguments,0)
              return ${script.toString()}.apply(window, args)`
  }
  if (!assertArray(args)) {
    if (assertObject(args) || assertFunction(args) || assertNumber(args) || assertString(args)) {
      args = [args]
    }
  }

  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.executeSync(sessionId)

  const { body, status } = await requestInterface(options, JSON.stringify({
    script,
    args
  }))
  assertStatus(status, body)
  return body
}

async function getCurrentWindowHandle(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'GET'
  options.path = Pathes.windowHandle(sessionId)
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function getCurrentWindowHandles(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'GET'
  options.path = Pathes.windowHandles(sessionId)
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function getScreenshot(sessionId, options) {
  if (!options) options = baseOptions
  options.path = Pathes.screenshot(sessionId)
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function forwardHistory(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.forward(sessionId)
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function backHistory(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.back(sessionId)
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function refreshCurrentPage(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.refresh(sessionId)
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function resizeWindow(sessionId, rect, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.currentSize(sessionId)
  const { body, status } = await requestInterface(options, JSON.stringify(rect))
  assertStatus(status, body)
  return body
}

async function getUrl(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'GET'
  options.path = Pathes.url(sessionId)
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function clickElement(sessionId, elementId, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.click(sessionId, elementId)
  const { body, status } = await requestInterface(options, JSON.stringify({ button: 0 }))
  assertStatus(status, body)
  return body
}

async function submitElement(sessionId, elementId, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.submit(sessionId, elementId)
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function clearElementText(sessionId, elementId, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.clear(sessionId, elementId)
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function getElementText(sessionId, elementId, options) {
  if (!options) options = baseOptions
  options.method = 'GET'
  options.path = Pathes.text(sessionId, elementId)
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function getTitle(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'GET'
  options.path = Pathes.title(sessionId)
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function goToUrl(sessionId, url, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.url(sessionId)
  const { body, status } = await requestInterface(options, JSON.stringify({
    url
  }))
  assertStatus(status, body)
  return body
}
/**
   * @param {string} sessionId .
   * @param {string} selector css selector.
   * @param {object} options options.
 */
async function findElement(sessionId, selector, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.element(sessionId)
  const { body, status } = await requestInterface(options, JSON.stringify({
    using: 'css selector', value: selector
  }))
  assertStatus(status, body)
  return body
}

async function findElements(sessionId, selector, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.elements(sessionId)
  const { body, status } = await requestInterface(options, JSON.stringify({
    using: 'css selector', value: selector
  }))
  return body
}

async function initSession(data, options) {
  if (!data) data = defaultCapabilities
  if (!options) options = baseOptions
  options.method = 'POST'
  const { body, status } = await requestInterface(options, data)
  console.log(body, status)
  assertStatus(status, body)
  return body
}

async function sendKeys(sessionId, elementId, keysToSend, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.sendKeys(sessionId, elementId)
  if (!Array.isArray(keysToSend)) {
    keysToSend = [keysToSend]
  }
  const { body, status } = await requestInterface(options, JSON.stringify({ value: keysToSend }))
  assertStatus(status, body)
  return body
}

async function killSession(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'DELETE'
  options.path = Pathes.killSession(sessionId)
  const { status, body } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function getAttribute(sessionId, elementId, attribute, options) {
  if (!options) options = baseOptions
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
  options.method = 'GET'
  options.path = Pathes.attribute(sessionId, elementId, attribute)
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

//move buttonup buttondown
async function mouseDown(sessionId, element/*element can be css selector or elementId*/, position, options) {
  element = { button: 0 }
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.buttonDown(sessionId)
  const { body, status } = await requestInterface(options, JSON.stringify({ element }))
  assertStatus(status, body)
  return body
}

function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

async function moveTo(sessionId, elementOrPosition, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.moveto(sessionId)

  if (elementOrPosition.x || elementOrPosition.x) {
    elementOrPosition = { xoffset: elementOrPosition.x, yoffset: elementOrPosition.y }
  }
  const { body, status } = await requestInterface(options, JSON.stringify({ ...elementOrPosition }))
  assertStatus(status, body)
  return body
}

async function pressKeys(sessionId, keys, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.moveto(sessionId)
  if (!Array.isArray(keys)) {
    keys = [keys]
  }
  const { body, status } = await requestInterface(options, JSON.stringify({ value: keys }))
  assertStatus(status, body)
  return body
}

async function elementFromElement(sessionId, elementId, selector, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.elementFromElement(sessionId, elementId)
  const { body, status } = await requestInterface(options, JSON.stringify({
    using: 'css selector', value: selector
  }))
  assertStatus(status, body)
  return body
}

async function elementsFromElement(sessionId, elementId, selector, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.elementsFromElement(sessionId, elementId)
  const { body, status } = await requestInterface(options, JSON.stringify({
    using: 'css selector', value: selector
  }))
  assertStatus(status, body)
  return body
}

async function buttonUp(sessionId, button = { button: 0 }, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = Pathes.pressKeys(sessionId)
  const { body, status } = await requestInterface(options, JSON.stringify({ button }))
  assertStatus(status, body)
}

async function displayed(sessionId, elementId, options) {
  if (!options) options = baseOptions
  options.method = 'GET'
  options.path = Pathes.displayed(sessionId, elementId)
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function present(sessionId, elementId, options) {
  if (!options) options = baseOptions
  options.method = 'GET'
  options.path = Pathes.present(sessionId, elementId)
  const { body, status } = await requestInterface(options)
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
  killSession,
  initSession,
  mouseDown,
  findElements,
  findElement,
  goToUrl,
  getUrl,
  getTitle,
  clickElement,
  syncWithDOM,
  getElementText,
  getAttribute,
  executeScript
}
