const urlChrome = (ver) => `http://chromedriver.storage.googleapis.com/${ver}/chromedriver_mac64.zip`
const urlGecko = (ver) => `https://github.com/mozilla/geckodriver/releases/download/v${ver}/geckodriver-v${ver}-macos.tar.gz`
const seleniumUrl = (seleniumV) => `http://selenium-release.storage.googleapis.com/3.8/selenium-server-standalone-3.8.1.jar`

const geckodriver = 'https://github.com/mozilla/geckodriver/releases/download/v0.19.1/geckodriver-v0.19.1-macos.tar.gz'

const chromedriver_ver = '2.34'
const geckdriver_ver = '0.19.1'

const GECKO_PATH = './geckodriver'
const CHROME_PATH = './chromedriver_2.34'
const STANDALONE_PATH = './selenium-server-standalone-3.8.1.jar'

const fs = require('fs')
const fetch = require('node-fetch')
const unzip = require('unzip')
const zlib = require('zlib')
const tar = require('tar')
const mkdirp = require('mkdirp')

const { resolve, dirname, join } = require('path')

const { execFile, spawn, execSync } = require('child_process')

const resolvePath = (path) => resolve(__dirname, path)

async function getChromeDriver(ver) {
  return new Promise((resolve) => {
    fetch(urlChrome(ver))
      .then(function (res) {
        const dest = fs.createWriteStream(resolvePath('./chromedriver_2.34.zip'))
        res.body.pipe(dest)
        res.body.on('end', () => {
          const str = fs.createReadStream(resolvePath('./chromedriver_2.34.zip')).pipe(unzip.Extract({ path: resolvePath('./') }))
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
      execSync(`chmod +x ${resolvePath('./chromedriver_2.34')}`)
    } catch (error) {
      console.error(error.toString())
    }
  })
}

async function spawnChromedriver() {
  const existchrome = fs.existsSync(resolvePath(CHROME_PATH))
  if (!existchrome) {
    console.info('chrome was not installed, for install run *wd-interface chrome*')
    return
  }
  return new Promise((resolve, reject) => {
    try {
      const nodeProc = spawn(resolvePath(CHROME_PATH), {
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
        const dest = fs.createWriteStream(resolvePath('./selenium-server-standalone-3.8.1.jar'))
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
  const existschrome = fs.existsSync(resolvePath(CHROME_PATH))
  const existstandalone = fs.existsSync(resolvePath(STANDALONE_PATH))
  const existsgecko = fs.existsSync(resolvePath(GECKO_PATH))
  if (!(existstandalone && existschrome && existsgecko)) {
    if (!existstandalone && !existschrome && !existsgecko) {
      console.info('standalone and chromedriver were not installen, for install run wd-interface standalone chrome gecko')
    } else {
      console.info(`
      ${!existstandalone && 'standalone was not installed, for install run *wd-interface standalone*'}
      ${!existschrome && 'chrome was not installed, for install run *wd-interface chrome*'}
      ${!existsgecko && 'gecko was not installed, for install run *wd-interface gecko*'}
    `)
    }
    return
  }
  return new Promise((resolve, reject) => {
    try {
      const nodeProc = spawn('java', [
        `-Dwebdriver.chrome.driver=${resolvePath(CHROME_PATH)}`,
        `-Dwebdriver.gecko.driver=${resolvePath(GECKO_PATH)}`,
        '-jar',
        `${resolvePath(STANDALONE_PATH)}`], {
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
    fs.unlink(resolvePath('./selenium-server-standalone-3.8.1.jar'), (err) => {
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
    fetch(geckodriver)
      .then(function (res) {
        const dest = fs.createWriteStream(resolvePath('./geckodriver-v0.19.1-macos.tar.gz'))
        res.body.pipe(dest)
        res.body.on('end', () => {
          fs.createReadStream(resolvePath('./geckodriver-v0.19.1-macos.tar.gz'))
            .on('error', console.log)
            .pipe(zlib.Unzip())
            .pipe(new tar.Parse())
            .on('entry', function (entry) {
              mkdirp(dirname(join(resolvePath('./'), entry.path)), function (err) {
                if (err) throw err;
                entry.pipe(fs.createWriteStream(join(resolvePath('./'), entry.path)))
                entry.on('end', () => {
                  fs.unlink(resolvePath('./geckodriver-v0.19.1-macos.tar.gz'), (err) => {
                    if (err) throw err
                  })
                  resolve(true)
                })
              })
            })
        })
      })
  }).then((value) => {
    if (value) {
      console.info('gecko driver installed success')
    }
    try {
      execSync(`chmod +x ${resolvePath(`./geckodriver`)}`)
    } catch (error) {
      console.error(error.toString())
    }
  })
}

async function spawnGeckodriver() {
  const existgecko = fs.existsSync(resolvePath(GECKO_PATH))
  if (!existgecko) {
    console.info('gecko was not installed, for install run *wd-interface gecko*')
    return
  }
  return new Promise((resolve, reject) => {
    try {
      const nodeProc = spawn(`${resolvePath(GECKO_PATH)}`, ['-p', '9516'], {
        stdio: ['pipe', process.stdout, process.stderr]
      })
      resolve(nodeProc.pid)
    } catch (error) {
      console.error(error.toString())
    }
  })
}

async function clearGecko() {
  return new Promise((resolve, reject) => {
    fs.unlink(resolvePath(GECKO_PATH), (err) => {
      if (err) reject(err)
      resolve(true)
    })
  }).then(val => {
    if (val) {
      console.info('gecko driver removed success')
    }
  }).catch(error => console.error(error.toString()))
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

function killProc() {
  return new Promise((resolve, reject) => {
    fs.readFile(resolvePath('./procid'), (err, data) => {
      if (err) throw err
      try {
        process.kill(data.toString())
        resolve(true)
      } catch (error) {
        console.error('active session was not found')
        reject(false)
      }
    })
  })
}

module.exports = {
  getChromeDriver,
  spawnChromedriver,
  clearChrome,

  getStandalone,
  spawnStandalone,
  clearStandalone,

  getGeckoDriver,
  spawnGeckodriver,
  clearGecko,

  writeId,
  killProc
}

const CHROME_DRIVER_VERSION = `curl - sS chromedriver.storage.googleapis.com / LATEST_RELEASE`
const SELENIUM_STANDALONE_VERSION = '3.4.0'
