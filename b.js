const urlChrome = (ver) => `http://chromedriver.storage.googleapis.com/${ver}/chromedriver_mac64.zip`
const seleniumUrl = (seleniumV) => `http://selenium-release.storage.googleapis.com/3.4/selenium-server-standalone-3.4.0.jar`

const fs = require('fs')
const fetch = require('node-fetch')
const unzip = require('unzip')
const { execFile } = require('child_process')

const allowChromeDriver = async (ver) => {
  return new Promise((resolve) => {
    fetch(urlChrome(ver))
      .then(function (res) {
        const dest = fs.createWriteStream('./chromedriver_2.33.zip')
        res.body.pipe(dest)
        res.body.on('end', () => {
          const stream = fs.createReadStream('./chromedriver_2.33.zip').pipe(unzip.Extract({ path: './' }))
        })
      })
  }).then((value) => {
    console.log(value)
  })
}

const allowStandalone = async () => {
  return new Promise((resolve) => {
    fetch(seleniumUrl())
      .then(function (res) {
        const dest = fs.createWriteStream('./selenium-server-standalone-3.4.0.jar')
        res.body.pipe(dest)
        res.body.on('end', () => {
          resolve('end')
        })
      })
  }).then((value) => {
    console.log(value)
  })
}


// const nodeProc = spawn('java', [`-Dwebdriver.chrome.driver=${CHROME_PATH}`, '-jar', `${STANDALONE_PATH}`, '-role', 'node', '-nodeConfig', `${NODE_PATH}`], {
//   detached: true,
//   stdio: ['pipe', process.stdout, process.stderr]
// });

// child.kill("SIGINT");

// allow()
// allowStandalone()
allowChromeDriver('2.33')


//fetch('http://chromedriver.storage.googleapis.com/LATEST_RELEASE').then(resp => resp.json()).then(allow)







const CHROME_DRIVER_VERSION = `curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE`
const SELENIUM_STANDALONE_VERSION = '3.4.0'