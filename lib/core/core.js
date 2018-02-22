const {
  assertFunction,
  assertObject,
  assertArray,
  assertString,
  assertNumber,
  waitCondition,
  elementIDregexp
} = require('../util')

function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

const modulesProviders = {
  sendKeys: require('./sendKeys'),
  displayed: require('./displayed'),
  toFrame: require('./toFrame'),
  getScreenshot: require('./getScreenshot'),
  present: require('./present'),
  elementFromElement: require('./elementFromElement'),
  elementsFromElement: require('./elementsFromElement'),
  resizeWindow: require('./resizeWindow'),
  moveTo: require('./moveTo'),
  openTab: require('./openTab'),
  killSession: require('./killSession'),
  initSession: require('./initSession'),
  mouseDown: require('./mouseDown'),
  findElements: require('./findElements'),
  findElement: require('./findElement'),
  goToUrl: require('./goTo'),
  getUrl: require('./getUrl'),
  closeCurrentTab: require('./closeCurrentTab'),
  getTitle: require('./getTitle'),
  clickElement: require('./clickElement'),
  syncWithDOM: require('./syncWithDOM'),
  getElementText: require('./getText'),
  getCurrentWindowHandles: require('./getCurrentWindowHandles'),
  getCurrentWindowHandle: require('./getCurrentWindowHandle'),
  getAttribute: require('./getAttribute'),
  executeScript: require('./executeScript'),
  executeScriptAsync: require('./executeScriptAsync'),
  clearElementText: require('./clearElement'),
  setScriptTimeout: require('./setTimeout'),
  minimizeWindow: require('./minimizeWindow'),
  maximizeWindow: require('./maximizeWindow'),
  refreshCurrentPage: require('./resizeWindow'),
  backHistory: require('./backHistory'),
  forwardHistory: require('./forwardHistory')
}

function initializeRequestState(request) {
  const initializedModues = {
    sleep,
    waitCondition
  }
  Object.keys(modulesProviders).forEach(key => {
    initializedModues[key] = modulesProviders[key](request)
  })

  return initializedModues
}

module.exports = initializeRequestState