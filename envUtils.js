const os = require('os')

const { resolve } = require('path')

const resolvePath = (path) => resolve(__dirname, path)

const urlChrome = (ver) => {
    if (os.arch() === 'x64' && os.platform() === 'win32') {
        return `http://chromedriver.storage.googleapis.com/${ver}/chromedriver_win32.zip`
    } else {
        return `http://chromedriver.storage.googleapis.com/${ver}/chromedriver_mac64.zip`
    }
}
const urlGecko = (ver) => {
    if (os.arch() === 'x64' && os.platform() === 'win32') {
        return `https://github.com/mozilla/geckodriver/releases/download/v${ver}/geckodriver-v${ver}-win64.zip`
    } else {
        return `https://github.com/mozilla/geckodriver/releases/download/v${ver}/geckodriver-v${ver}-macos.tar.gz`
    }
}

const urlSelenium = (seleniumV) => `http://selenium-release.storage.googleapis.com/3.8/selenium-server-standalone-3.8.1.jar`


const GECKO_PATH = () => {
    if (os.platform() === 'win32') {
        return resolvePath('./geckodriver.exe')
    } else {
        return resolvePath('./geckodriver')
    }
}

const CHROME_PATH = () => {
    if (os.platform() === 'win32') {
        return resolvePath('./chromedriver.exe')
    } else {
        return resolvePath('./chromedriver')
    }
}

const STANDALONE_PATH = () => resolvePath('./selenium-server-standalone-3.8.1.jar')


module.exports = {
    urlChrome,
    urlSelenium,
    urlGecko,
    GECKO_PATH: GECKO_PATH(),
    CHROME_PATH: CHROME_PATH(),
    STANDALONE_PATH: STANDALONE_PATH(),
    resolvePath
}