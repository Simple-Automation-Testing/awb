":" // exec /usr/bin/env node --harmony --expose-gc --trace-deprecation "$0" "$@"
const {
  requestInterface,
  assertFunction,
  assertObject,
  assertArray,
  assertString,
  assertNumber,
  waitCondition
} = require('./util')


const { defaultCapabilities, baseOptions } = require('./capabilitiesAndBaseOpts')


const { InterfaceError } = require('./interfaceError')

const assertStatus = (status, body) => {
  if (!(status < 300)) {
    throw new InterfaceError(body)
  }
}

async function syncWithDOM(sessionId, timeout, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = `/wd/hub/session/${sessionId}/execute/sync`

  const waitState = function () {
    return document.readyState === 'complete'
  }

  const fn = 'const passedArgs = Array.prototype.slice.call(arguments,0); return ' +
    waitState.toString() + '.apply(window, passedArgs);';

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
    script = script.toString()
  }
  if (!assertArray(args)) {
    if (assertObject(args) || assertFunction(args) || assertNumber(args) || assertString(args)) {
      args = [args]
    }
  }

  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = `/wd/hub/session/${sessionId}/execute/sync`

  const { body, status } = await requestInterface(options, JSON.stringify({
    script,
    args
  }))
  console.log(status)
  assertStatus(status, body)
  return body
}

async function getCurrentWindowHandle(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'GET'
  options.path = `/wd/hub/session/${sessionId}/window_handle`
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function getCurrentWindowHandles(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'GET'
  options.path = `/wd/hub/session/${sessionId}/window_handles`
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function getScreenshot(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'GET'
  options.path = `/wd/hub/session/${sessionId}/screenshot`
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function forwardHistory(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = `/wd/hub/session/${sessionId}/forward`
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function backHistory(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = `/wd/hub/session/${sessionId}/back`
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function refreshCurrentPage(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = `/wd/hub/session/${sessionId}/refresh`
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function resizeWindow(sessionId, rect, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = `/wd/hub/session/${sessionId}/window/current/size`
  const { body, status } = await requestInterface(options, JSON.stringify(rect))
  assertStatus(status, body)
  return body
}

async function getUrl(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'GET'
  options.path = `/wd/hub/session/${sessionId}/url`
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function clickElement(sessionId, elementId, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/click`
  const { body, status } = await requestInterface(options, JSON.stringify({ button: 0 }))
  assertStatus(status, body)
  return body
}

async function submitElement(sessionId, elementId, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/submit`
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function clearElementText(sessionId, elementId, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/clear`
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function getElementText(sessionId, elementId, options) {
  if (!options) options = baseOptions
  options.method = 'GET'
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/text`
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function getTitle(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'GET'
  options.path = `/wd/hub/session/${sessionId}/title`
  const { body, status } = await requestInterface(options)
  assertStatus(status, body)
  return body
}

async function goToUrl(sessionId, url, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = `/wd/hub/session/${sessionId}/url`
  const { body, status } = await requestInterface(options, JSON.stringify({
    url
  }))
  assertStatus(status, body)
}

async function findElement(sessionId, selector, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = `/wd/hub/session/${sessionId}/element`
  const { body, status } = await requestInterface(options, JSON.stringify({
    using: 'css selector', value: selector
  }))
  return body
}

async function findElements(sessionId, selector, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = `/wd/hub/session/${sessionId}/elements`
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
  return body
}

async function sendKeys(sessionId, elementId, keysToSend, options) {
  if (!options) options = baseOptions
  options.method = 'POST'
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/value`
  if (!Array.isArray(keysToSend)) {
    keysToSend = [keysToSend]
  }
  const { body, status } = await requestInterface(options, JSON.stringify({ value: keysToSend }))
}

async function killSession(sessionId, options) {
  if (!options) options = baseOptions
  options.method = 'DELETE'
  options.path = `/wd/hub/session/${sessionId}`
  await requestInterface(options)
}

module.exports = {
  sendKeys,
  resizeWindow,
  killSession,
  initSession,
  findElements,
  findElement,
  goToUrl,
  getUrl,
  getTitle,
  clickElement,
  syncWithDOM,
  executeScript
}
