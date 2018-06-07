const defaultCapsAndBaseOptions = require('../capabilitiesAndBaseOpts')

const {urlPathes} = require('../path')

const fetchyInitializator = require('../fetchy')

const SELENIUM_PORT = 4444
const CHROMEDRIVER_PORT = 9515
const GECKODRIVER_PORT = 9516


module.exports = function(baseOptions) {
  const {
    defaultChromeCapabilities,
    baseOptionsChrome,
    baseOptionsStandAlone,
    baseOptionsFirefox
  } = defaultCapsAndBaseOptions
  if(!baseOptions) {
    baseOptions = global.__provider && global.__provider.__chrome ? baseOptionsChrome : baseOptionsStandAlone
  }

  const portPath = () => {
    if(global.__provider && global.__provider.__chrome) {
      return `${CHROMEDRIVER_PORT}/`
    } else {
      return `${SELENIUM_PORT}/wd/hub/`
    }
  }

  // const { fetchy_util } = fetchyInitializator(`http://localhost:${portPath()}`)

  return {baseOptions,/* fetchy_util ,*/ urlPathes, defaultCapsAndBaseOptions}
}
