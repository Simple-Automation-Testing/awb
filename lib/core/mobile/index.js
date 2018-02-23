module.exports = {
  closeApp: require('./close'),
  getContexts: require('./contexts'),
  launchApp: require('./launch'),
  getCurrentActivity: require('./currentActivity'),
  getCurrentPackage: require('./currentPackage'),
  lock: require('./lock'),
  reset: require('./reset'),
  rotate: require('./rotate'),
  shake: require('./shake'),
  // touch
  touchClick: require('./touchClick'),
  touchDown: require('./touchDown'),
  touchDoubleclick: require('./touchDoubleclick'),
  touchLongclick: require('./touchLongclick'),
  touchFlick: require('./touchFlick'),
  touchMove: require('./touchMove'),
  touchPerform: require('./touchPerform'),
  touchMultiperform: require('./touchMultiperform'),
  touchScroll: require('./touchScroll'),
  touchUp: require('./touchUp')
}