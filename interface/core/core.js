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


function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
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
