const os = require('os')

const {
  urlChrome,
  urlGecko,
  urlSelenium,
  resolvePath,
  GECKO_PATH,
  CHROME_PATH,
  STANDALONE_PATH
} = require('./envUtils')

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

async function getGeckoDriver(ver = geckdriver_ver) {
  return new Promise((resolve) => {
    fetch(urlGecko(geckdriver_ver))
      .then(function (res) {
        if (os.arch() === 'x64' && os.platform() === 'win32') {
          const dest = fs.createWriteStream(resolvePath('./gecko.zip'))
          res.body.pipe(dest)
          res.body.on('end', () => {
            const str = fs.createReadStream(resolvePath('./gecko.zip')).pipe(unzip.Extract({ path: resolvePath('./') }))
            fs.unlink(resolvePath(`./gecko.zip`), (err) => {
              if (err) throw err
              resolve(true)
            })
          })
        } else {
          const dest = fs.createWriteStream(resolvePath('./gecko.tar.gz'))
          res.body.pipe(dest)
          res.body.on('end', () => {
            fs.createReadStream(resolvePath('./gecko.tar.gz'))
              .on('error', console.log)
              .pipe(zlib.Unzip())
              .pipe(new tar.Parse())
              .on('entry', function (entry) {
                mkdirp(dirname(join(resolvePath('./'), entry.path)), function (err) {
                  if (err) throw err;
                  entry.pipe(fs.createWriteStream(join(resolvePath('./'), entry.path)))
                  entry.on('end', () => {
                    fs.unlink(resolvePath('./gecko.tar.gz'), (err) => {
                      if (err) throw err
                    })
                    resolve(true)
                  })
                })
              })
          })
        }

      })
  }).then((value) => {
    if (value) {
      console.info('gecko driver installed success')
    }
    try {
      if (os.platform() !== 'win32') {
        execSync(`chmod +x ${resolvePath(`./geckodriver`)}`)
      }
    } catch (error) {
      console.error(error.toString())
    }
  })
}

async function spawnGeckodriver() {
  const existgecko = fs.existsSync(GECKO_PATH)
  if (!existgecko) {
    console.info('gecko was not installed, for install run *wd-interface gecko*')
    return
  }
  return new Promise((resolve, reject) => {
    try {
      const nodeProc = spawn(`${GECKO_PATH}`, ['-p', '9516'], {
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
    fs.unlink(GECKO_PATH, (err) => {
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
