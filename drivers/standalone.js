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

const parseString = require('xml2js').parseString

const fs = require('fs')
const fetch = require('node-fetch')

const { spawn } = require('child_process')


const url = 'https://selenium-release.storage.googleapis.com'

const getReleases = async () => {
  const body = await fetch(url).then(resp => resp.text())

  const bodyResolve = () => new Promise(resolve => {
    parseString(body, function (err, result) {
      resolve(result)
    });
  })
  const { ListBucketResult: { Contents } } = await bodyResolve()
  return Contents
}

function getDownloadLink(list) {
  const osArchMap = {
    darwinx64: 'mac64',
    win32x64: 'win64',
    win32x86: 'win32'
  }

  const chromeArch = osArchMap[`${os.platform()}${os.arch()}`]

  const getMap = () => {
    return list.map(release => {
      const publishedData = +new Date(release.LastModified[0])
      const version = release.Key[0].split('/')
      const browser_download_url = `${url}/${release.Key[0]}`

      return { publishedData, version, browser_download_url }


    }).filter(release => release.browser_download_url.includes('standalone')).reduce((acc, val, index) => {
      if (!index) { acc = val }
      if (acc.publishedData < val.publishedData) {
        acc = val
      }
      return acc
    }, {})
  }
  const { browser_download_url } = getMap()
  return browser_download_url
}

async function getStandalone() {
  const downloadUrl = getDownloadLink(await getReleases())
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