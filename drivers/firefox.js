const os = require('os')

const {resolvePath, GECKO_PATH} = require('./util')

const releaseListUrl = 'https://api.github.com/repos/mozilla/geckodriver/releases'

const fs = require('fs')
const fetch = require('node-fetch')
const unzip = require('unzipper')
const zlib = require('zlib')
const tar = require('tar')
const mkdirp = require('mkdirp')

const {dirname, join} = require('path')

const {spawn, execSync} = require('child_process')

async function getReleases() {
  const list = await fetch(releaseListUrl).then(resp => resp.json())
  return list
}

function getDownloadLink(list) {
  const osArchMap = {
    darwinx64: 'macos',
    win32x64: 'win64',
    win32x86: 'win32',
    linuxx64: 'linux64',
    linuxx86: 'linux32'
  }

  const getMap = () => {
    return list.map(release => {
      const publishedData = +new Date(release.published_at)
      const version = release.tag_name
      const assets = release.assets.map(asset => {
        const {name, browser_download_url} = asset
        return {name, browser_download_url}
      })
      return {publishedData, version, assets}
    }).reduce((acc, val, index) => {
      if(!index) {acc = val}
      if(acc.publishedData < val.publishedData) {
        acc = val
      }
      return acc
    }, {})
  }

  const {assets} = getMap()
  const geckoArch = osArchMap[`${os.platform()}${os.arch()}`]
  const {browser_download_url} = assets.reduce((acc, val, index) => {
    if(val.browser_download_url.includes(geckoArch)) {
      acc = val
    }
    return acc
  }, {})
  return browser_download_url
}

async function getGeckoDriver() {
  const downloadUrl = getDownloadLink(await getReleases())
  return new Promise((resolve) => {
    fetch(downloadUrl)
      .then(function(res) {
        if(os.arch() === 'x64' && os.platform() === 'win32') {
          const dest = fs.createWriteStream(resolvePath('./gecko.zip'))
          res.body.pipe(dest)
          res.body.on('end', () => {
            const str = fs.createReadStream(resolvePath('./gecko.zip')).pipe(unzip.Extract({path: resolvePath('./')}))
            fs.unlink(resolvePath(`./gecko.zip`), (err) => {
              if(err) throw err
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
              .on('entry', function(entry) {
                mkdirp(dirname(join(resolvePath('./'), entry.path)), function(err) {
                  if(err) throw err;
                  entry.pipe(fs.createWriteStream(join(resolvePath('./'), entry.path)))
                  entry.on('end', () => {
                    fs.unlink(resolvePath('./gecko.tar.gz'), (err) => {
                      if(err) throw err
                    })
                    resolve(true)
                  })
                })
              })
          })
        }
      })
  }).then((value) => {
    if(value) {
      console.info('gecko driver installed success')
    }
    try {
      if(os.platform() !== 'win32') {
        execSync(`chmod +x ${resolvePath(`./geckodriver`)}`)
      }
    } catch(error) {
      console.error(error.toString())
    }
  })
}

async function spawnGeckodriver() {
  const existgecko = fs.existsSync(GECKO_PATH)
  if(!existgecko) {
    console.info('gecko was not installed, for install run *wd-interface gecko*')
    return
  }
  return new Promise((resolve, reject) => {
    try {
      const nodeProc = spawn(`${GECKO_PATH}`, ['-p', '9516'], {
        stdio: ['pipe', process.stdout, process.stderr]
      })
      resolve(nodeProc.pid)
    } catch(error) {
      console.error(error.toString())
    }
  })
}

async function clearGecko() {
  return new Promise((resolve, reject) => {
    fs.unlink(GECKO_PATH, (err) => {
      if(err) reject(err)
      resolve(true)
    })
  }).then(val => {
    if(val) {
      console.info('gecko driver removed success')
    }
  }).catch(error => console.error(error.toString()))
}

module.exports = {
  getGeckoDriver,
  spawnGeckodriver,
  clearGecko
}

// https://api.github.com/repos/mozilla/geckodriver/releases