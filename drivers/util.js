const os = require('os')

const {resolve} = require('path')

const resolvePath = (path) => resolve(__dirname, path)

const GECKO_PATH = () => {
  if(os.platform() === 'win32') {
    return resolvePath('./geckodriver.exe')
  } else {
    return resolvePath('./geckodriver')
  }
}

const CHROME_PATH = () => {
  if(os.platform() === 'win32') {
    return resolvePath('./chromedriver.exe')
  } else {
    return resolvePath('./chromedriver')
  }
}

const STANDALONE_PATH = () => resolvePath('./standalone.jar')


module.exports = {
  GECKO_PATH: GECKO_PATH(),
  CHROME_PATH: CHROME_PATH(),
  STANDALONE_PATH: STANDALONE_PATH(),
  resolvePath
}