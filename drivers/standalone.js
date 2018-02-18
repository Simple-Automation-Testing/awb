const os = require('os')

const {
  urlChrome,
  urlGecko,
  urlSelenium,
  resolvePath,
  GECKO_PATH,
  CHROME_PATH,
  STANDALONE_PATH
} = require('./util')

const chromedriver_ver = '2.34'

const fs = require('fs')
const fetch = require('node-fetch')
const unzip = require('unzip')
const zlib = require('zlib')
const tar = require('tar')
const mkdirp = require('mkdirp')

const { dirname, join } = require('path')

const { execFile, spawn, execSync } = require('child_process')

async function getStandalone() {
  return new Promise((resolve, reject) => {
    fetch(urlSelenium())
      .then(function (res) {
        const dest = fs.createWriteStream(resolvePath(STANDALONE_PATH))
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
  const existschrome = fs.existsSync(CHROME_PATH)
  const existstandalone = fs.existsSync(STANDALONE_PATH)
  const existsgecko = fs.existsSync(GECKO_PATH)
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
        `-Dwebdriver.chrome.driver=${CHROME_PATH}`,
        `-Dwebdriver.gecko.driver=${GECKO_PATH}`,
        '-Dwebdriver.safari.driver=/usr/bin/safaridriver',
        '-jar',
        `${STANDALONE_PATH}`], {
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
    fs.unlink(STANDALONE_PATH, (err) => {
      if (err) reject(err)
      resolve(true)
    })
  }).then(val => {
    if (val) {
      console.info('standalone removed success')
    }
  }).catch(error => console.error(error.toString()))
}


module.exports = {
  getStandalone,
  spawnStandalone,
  clearStandalone,
}