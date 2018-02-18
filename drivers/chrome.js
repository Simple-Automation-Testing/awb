const os = require('os')

const {
  urlChrome,
  resolvePath,
  CHROME_PATH,
  STANDALONE_PATH
} = require('./util')

const chromedriver_ver = '2.34'
const geckdriver_ver = '0.19.1'


const fs = require('fs')
const fetch = require('node-fetch')
const unzip = require('unzip')
const zlib = require('zlib')
const tar = require('tar')
const mkdirp = require('mkdirp')

const { dirname, join } = require('path')

const { execFile, spawn, execSync } = require('child_process')

async function getChromeDriver(ver = chromedriver_ver) {
  return new Promise((resolve) => {
    fetch(urlChrome(ver))
      .then(function (res) {
        const dest = fs.createWriteStream(resolvePath(`./chromedriver_${ver}.zip`))
        res.body.pipe(dest)
        res.body.on('end', () => {
          const str = fs.createReadStream(resolvePath(`./chromedriver_${ver}.zip`)).pipe(unzip.Extract({ path: resolvePath('./') }))
          str.on('close', () => {
            if (os.arch() === 'x64' && os.platform() === 'win32') {
              fs.unlink(resolvePath(`./chromedriver_${ver}.zip`), (err) => {
                if (err) throw err
                resolve(true)
              })
            } else {
              fs.unlink(resolvePath(`./chromedriver_${ver}.zip`), (err) => {
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