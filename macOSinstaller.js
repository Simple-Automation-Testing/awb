const urlChrome = (ver) => `http://chromedriver.storage.googleapis.com/${ver}/chromedriver_mac64.zip`
const urlGecko = (ver) => `https://github.com/mozilla/geckodriver/releases/download/v${ver}/geckodriver-v${ver}-macos.tar.gz`
const seleniumUrl = (seleniumV) => `http://selenium-release.storage.googleapis.com/3.7/selenium-server-standalone-3.7.1.jar`

const chromedriver_ver = '2.33'
const geckdriver_ver = '0.19.1'

const GECKO_PATH = './geckodriver_0.19.1'
const CHROME_PATH = './chromedriver_2.33'
const STANDALONE_PATH = './selenium-server-standalone-3.7.1.jar'

const fs = require('fs')
const fetch = require('node-fetch')
const unzip = require('unzip')
const tar = require('tar')

const { resolve } = require('path')

const { execFile, spawn, execSync } = require('child_process')

const resolvePath = (path) => resolve(__dirname, path)

async function getChromeDriver(ver) {
  return new Promise((resolve) => {
    fetch(urlChrome(ver))
      .then(function (res) {
        const dest = fs.createWriteStream(resolvePath('./chromedriver_2.33.zip'))
        res.body.pipe(dest)
        res.body.on('end', () => {
          const str = fs.createReadStream(resolvePath('./chromedriver_2.33.zip')).pipe(unzip.Extract({ path: resolvePath('./') }))
          str.on('close', () => {
            fs.rename(resolvePath('./chromedriver'), resolvePath(`./chromedriver_${ver}`), (err) => {
              if (err) throw err
              fs.unlink(resolvePath(`./chromedriver_${ver}.zip`), (err) => {
                if (err) throw err
              })
              resolve(true)
            })
          })
        })
      })
  }).then((value) => {
    if (value) {
      console.info('chrome driver installed success')
    }
    try {
      execSync(`chmod +x ${resolvePath('./chromedriver_2.33')}`)
    } catch (error) {
      console.error(error.toString())
    }
  })
}

async function spawnChromedriver() {
  const existchrome = fs.existsSync(resolvePath(CHROME_PATH))
  if (!existchrome) {
    console.info(`${!existchrome && 'chrome was not installed, for install run *wd-interface chrome*'}`)
    return
  }
  return new Promise((resolve, reject) => {
    try {
      const nodeProc = spawn('./chromedriver_2.33', {
        stdio: ['pipe', process.stdout, process.stderr]
      })
      resolve(nodeProc.pid)
    } catch (error) {
      console.error(error.toString())
    }
  })
}

async function clearChrome(ver) {
  return new Promise((resolve, reject) => {
    fs.unlink(resolvePath(`./chromedriver_${ver}`), (err) => {
      if (err) reject(err)
      resolve(true)
    })
  }).then(val => {
    if (val) {
      console.info('chrome driver removed success')
    }
  }).catch(error => console.error(error.toString()))
}

async function getStandalone() {
  return new Promise((resolve, reject) => {
    fetch(seleniumUrl())
      .then(function (res) {
        const dest = fs.createWriteStream(resolvePath('./selenium-server-standalone-3.7.1.jar'))
        res.body.pipe(dest)
        res.body.on('end', () => {
          resolve(true)
        })
      })
  }).then((value) => {
    if (value) {
      console.info('standalone installed success')
    }
  }).catch
}

async function spawnStandalone() {
  const existchrome = fs.existsSync(resolvePath(CHROME_PATH))
  const existstandalone = fs.existsSync(resolvePath(STANDALONE_PATH))
  if (!(existstandalone && existchrome)) {
    if (!existstandalone && !existchrome) {
      console.info('standalone and chromedriver were not installen, for install run wd-interface standalone chrome')
    } else {
      console.info(`
      ${!existstandalone && 'standalone was not installed, for install run *wd-interface standalone*'}
      ${!existchrome && 'chrome was not installed, for install run *wd-interface chrome*'}
    `)
    }
    return
  }
  return new Promise((resolve, reject) => {
    try {
      const nodeProc = spawn('java', [`-Dwebdriver.chrome.driver=${resolvePath(CHROME_PATH)}`, '-jar', `${resolvePath(STANDALONE_PATH)}`], {
        stdio: ['pipe', process.stdout, process.stderr]
      })
      resolve(nodeProc.pid)
    } catch (error) {
      console.error(error.toString())
    }
  })
}

async function clearStandalone() {
  return new Promise((resolve, reject) => {
    fs.unlink(resolvePath('./selenium-server-standalone-3.7.1.jar'), (err) => {
      if (err) reject(err)
      resolve(true)
    })
  }).then(val => {
    if (val) {
      console.info('standalone removed success')
    }
  }).catch(error => console.error(error.toString()))
}

async function getGeckoDriver(ver = geckdriver_ver) {
  return new Promise((resolve) => {
    fetch(urlGecko(ver))
    .then(function (res) {
      const dest = fs.createWriteStream(resolvePath('./geckodriver-v0.19.1-macos.tar.gz'))
      res.body.pipe(dest)
      res.body.on('end', () => {
        resolve(true)
        // spawn('gunz')
        // const str = fs.createReadStream(resolvePath('./chromedriver_2.33.zip')).pipe(unzip.Extract({ path: resolvePath('./') }))
        // str.on('close', () => {
        //   fs.rename(resolvePath('./chromedriver'), resolvePath(`./chromedriver_${ver}`), (err) => {
        //     if (err) throw err
        //     fs.unlink(resolvePath(`./chromedriver_${ver}.zip`), (err) => {
        //       if (err) throw err
        //     })
        //     resolve(true)
        //   })
        // })
      })
    })
  }).then((value) => {
    if (value) {
      console.info('gecko driver installed success')
    }
    try {
      execSync(`chmod +x ${resolvePath(`./geckodriver-${ver}`)}`)
    } catch (error) {
      console.error(error.toString())
    }
  })
}



async function writeId(id) {
  return new Promise((resolve, reject) => {
    fs.writeFile(resolvePath('./procid'), id, (err) => {
      if (err) {
        console.log(err)
      }
    })
  })
}

async function killProc() {
  fs.readFile(resolvePath('./procid'), (err, data) => {
    if (err) throw err
    try {
      process.kill(data.toString())
    } catch (error) {
      console.error('active session was not found')
    }
  })
}

module.exports = {
  getChromeDriver,
  getStandalone,
  clearChrome,
  getGeckoDriver,
  clearStandalone,
  spawnStandalone,
  writeId,
  spawnChromedriver,
  killProc,
  getGeckoDriver
}

const CHROME_DRIVER_VERSION = `curl - sS chromedriver.storage.googleapis.com / LATEST_RELEASE`
const SELENIUM_STANDALONE_VERSION = '3.4.0'
