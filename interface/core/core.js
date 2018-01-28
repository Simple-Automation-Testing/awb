const {
  assertFunction,
  assertObject,
  assertArray,
  assertString,
  assertNumber,
  waitCondition,
  elementIDregexp
} = require('../util')

const WEB_EMENET_ID = 'element-6066-11e4-a52e-4f735466cecf'

const { urlPathes } = require('../path')

const {
  defaultChromeCapabilities,
  baseOptionsChrome,
  baseOptionsStandAlone,
  baseOptionsFirefox
} = require('../capabilitiesAndBaseOpts')

const { InterfaceError } = require('../interfaceError')

const getLocalEnv = require('./env')

const { baseOptions, fetchy_util } = getLocalEnv()











async function toFrame(sessionId, selector, options) {
  let elementId;

  if (selector) {
    const { value: { ELEMENT } } = await findElement(sessionId, selector, options)
    elementId = ELEMENT;
  }

  if (!options) options = { ...baseOptions }

  const requestBody = elementId ? { id: { [WEB_EMENET_ID]: elementId, ELEMENT: elementId } } : { id: null }

  const { body, status } = await fetchy_util.post(urlPathes.frame(sessionId), JSON.stringify(requestBody), options)

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

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.elements(sessionId), JSON.stringify(bodyRequest), options)


  body.value = body.value.map(respPart => {
    return { ELEMENT: respPart[Object.keys(respPart)[0]] }
  })
  return body
}

async function initSession(data, options) {

  if (!data) data = JSON.stringify(defaultChromeCapabilities)
  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.getSession(), data, options).catch(console.log)


  return body
}

async function sendKeys(sessionId, elementId, keysToSend, options) {

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


  return body
}

async function killSession(sessionId, options) {

  if (!options) options = { ...baseOptions }

  const { status, body } = await fetchy_util.del(urlPathes.killSession(sessionId), undefined, options)


  return body
}

async function setScriptTimeout(sessionId, timeouts = {}, options) {

  if (!options) options = { ...baseOptions }
  //'script', 'implicit', 'page load'
  const keys = Object.keys(timeouts)

  for (const key of keys) {
    const { status, body } = await fetchy_util.post(urlPathes.timeouts(sessionId), JSON.stringify({
      type: key,
      ms: timeouts[key]
    }), options)

  }
}

async function getAttribute(sessionId, elementId, attribute, options) {

  if (!options) options = { ...baseOptions }

  const { status, body } = await fetchy_util.get(urlPathes.attribute(sessionId, elementId, attribute), null, options)

  return body
}

//move buttonup buttondown
async function mouseDown(sessionId, element/*element can be css selector or elementId*/, position, options) {

  element = { button: 0 }
  if (!options) options = { ...baseOptions }

  const { status, body } = await fetchy_util.post(urlPathes.buttonDown(sessionId), JSON.stringify({ element }), options)

  return body
}

function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

async function moveTo(sessionId, elementOrPosition, options) {

  if (!options) options = { ...baseOptions }

  if (elementOrPosition.x || elementOrPosition.x) {
    elementOrPosition = { xoffset: elementOrPosition.x, yoffset: elementOrPosition.y }
  }
  const { status, body } = await fetchy_util.post(urlPathes.moveto(sessionId), JSON.stringify({ ...elementOrPosition }), options)

  return body
}

async function pressKeys(sessionId, keys, options) {

  if (!options) options = { ...baseOptions }

  if (!Array.isArray(keys)) {
    keys = [keys]
  }
  const { body, status } = await fetchy_util(urlPathes.pressKeys(sessionId), JSON.stringify({ value: keys }), options)

  return body
}

async function elementFromElement(sessionId, elementId, selector, options) {

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.elementFromElement(sessionId, elementId), JSON.stringify({
    using: 'css selector', value: selector
  }), options)

  if (body.value[WEB_EMENET_ID]) {
    body.value['ELEMENT'] = body.value[WEB_EMENET_ID]
    Reflect.deleteProperty(body.value, WEB_EMENET_ID)
  }

  return body
}

async function elementsFromElement(sessionId, elementId, selector, options) {

  if (!options) options = { ...baseOptions }

  const { body, status } = await fetchy_util.post(urlPathes.elementsFromElement(sessionId, elementId), JSON.stringify({
    using: 'css selector', value: selector
  }), options)


  if (body.value.length) {
    body.value = body.value.map(element => {
      return element[WEB_EMENET_ID] ? { ELEMENT: element[WEB_EMENET_ID] } : element
    })
  }

  return body
}


module.exports = {
  sendKeys,
  displayed,
  toFrame,
  getScreenshot,
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
  setScriptTimeout,
  minimizeWindow,
  maximizeWindow,
  refreshCurrentPage,
  backHistory,
  forwardHistory
}
