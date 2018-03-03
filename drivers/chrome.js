const os = require('os')

const {
  urlChrome,
  resolvePath,
  CHROME_PATH,
  STANDALONE_PATH
} = require('./util')

const parseString = require('xml2js').parseString

const url = 'https://chromedriver.storage.googleapis.com'

const fs = require('fs')
const fetch = require('node-fetch')
const unzip = require('unzip')
const zlib = require('zlib')
const tar = require('tar')
const { dirname, join } = require('path')

const { execFile, spawn, execSync } = require('child_process')

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
    win32x64: 'win32',
    win32x86: 'win32',
    linuxx64: 'linux64',
    linuxx86: 'linux32'
  }

  const chromeArch = osArchMap[`${os.platform()}${os.arch()}`]

  const getMap = () => {
    return list.map(release => {
      const publishedData = +new Date(release.LastModified[0])
      const version = release.Key[0].split('/')
      const browser_download_url = `${url}/${release.Key[0]}`


      return { publishedData, version, browser_download_url }
    }).filter(release => release.browser_download_url.includes(chromeArch)).reduce((acc, val, index) => {
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

async function getChromeDriver() {
  const downloadUrl = getDownloadLink(await getReleases())
  return new Promise((resolve) => {
    fetch(downloadUrl)
      .then(function (res) {
        const dest = fs.createWriteStream(resolvePath(`./chromedriver.zip`))
        res.body.pipe(dest)
        res.body.on('end', () => {
          const str = fs.createReadStream(resolvePath(`./chromedriver.zip`)).pipe(unzip.Extract({ path: resolvePath('./') }))
          str.on('close', () => {
            if (os.arch() === 'x64' && os.platform() === 'win32') {
              fs.unlink(resolvePath(`./chromedriver.zip`), (err) => {
                if (err) throw err
                resolve(true)
              })
            } else {
              fs.unlink(resolvePath(`./chromedriver.zip`), (err) => {
                if (err) throw err
                resolve(true)
              })
            }
          })
        })
      })
  }).then((value) => {
    if (value) {
      console.info('chrome driver installed success')
    }
    try {
      if (os.platform() !== 'win32') {
        execSync(`chmod +x ${resolvePath('./chromedriver')}`)
      }
    } catch (error) {
      console.error(error.toString())
    }
  })
}

async function spawnChromedriver() {
  const existchrome = fs.existsSync(CHROME_PATH)
  if (!existchrome) {
    console.info('chrome was not installed, for install run *wd-interface chrome*')
    return
  }
  return new Promise((resolve, reject) => {
    try {
      const nodeProc = spawn(CHROME_PATH, {
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
    fs.unlink(CHROME_PATH, (err) => {
      if (err) reject(err)
      resolve(true)
    })
  }).then(val => {
    if (val) {
      console.info('chrome driver removed success')
    }
  }).catch(error => console.error(error.toString()))
}

module.exports = {
  getChromeDriver,
  spawnChromedriver,
  clearChrome,
}
