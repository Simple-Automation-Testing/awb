const os = require('os')

const {resolvePath, CHROME_PATH} = require('./util')

const parseString = require('xml2js').parseString

const url = 'https://chromedriver.storage.googleapis.com'

const fs = require('fs')
const fetch = require('node-fetch')
const unzip = require('unzip')

const {spawn, execSync} = require('child_process')

const getReleases = async () => {
  const body = await fetch(url).then(resp => resp.text())

  const bodyResolve = () => new Promise(resolve => {
    parseString(body, function(err, result) {
      resolve(result)
    });
  })
  const {ListBucketResult: {Contents}} = await bodyResolve()
  return Contents
}

function getDownloadLink(list, v) {
  const osArchMap = {
    darwinx64: 'mac64',
    win32x64: 'win32',
    win32x86: 'win32',
    linuxx64: 'linux64',
    linuxx86: 'linux32'
  }

  const chromeArch = osArchMap[`${os.platform()}${os.arch()}`]

  const getMap = () => {
    const realisesList = list.map(release => {
      const publishedData = +new Date(release.LastModified[0])
      const version = release.Key[0].split('/')
      const downloadLink = `${url}/${release.Key[0]}`
      return {publishedData, version, downloadLink}
    }).sort((a, b) => a.publishedData > b.publishedData ? -1 : a.publishedData < b.publishedData ? 1 : 0)
      .filter((item) => item.downloadLink.includes('.zip') && item.downloadLink.includes(chromeArch))

    if(v) {
      return realisesList.find((item) => item.downloadLink.includes(v))
    } else {
      return realisesList[0]
    }
  }

  const {downloadLink} = getMap()
  return downloadLink
}

async function getChromeDriver(v) {
  const downloadUrl = getDownloadLink(await getReleases(), v)

  return new Promise((resolve) => {
    fetch(downloadUrl).then(function(res) {
      const dest = fs.createWriteStream(resolvePath(`./chromedriver.zip`))
      res.body.pipe(dest)
      res.body.on('end', () => {
        const str = fs.createReadStream(resolvePath(`./chromedriver.zip`)).pipe(unzip.Extract({path: resolvePath('./')}))
        str.on('close', () => {
          fs.unlink(resolvePath(`./chromedriver.zip`), (err) => {
            if(err) throw err
            resolve(true)
          })
        })
      })
    })
  }).then((value) => {
    if(value) {
      console.info('chrome driver installed success')
    }
    try {
      if(os.platform() !== 'win32') {
        execSync(`chmod +x ${resolvePath('./chromedriver')}`)
      }
    } catch(error) {
      console.error(error.toString())
    }
  })
}

async function spawnChromedriver() {
  const existchrome = fs.existsSync(CHROME_PATH)
  if(!existchrome) {
    console.info('chrome was not installed, for install run *wd-interface chrome*')
    return
  }
  return new Promise((resolve, reject) => {
    try {
      const nodeProc = spawn(CHROME_PATH, {
        stdio: ['pipe', process.stdout, process.stderr]
      })
      resolve(nodeProc.pid)
    } catch(error) {
      console.error(error.toString())
    }
  })
}

async function clearChrome(ver) {
  return new Promise((resolve, reject) => {
    fs.unlink(CHROME_PATH, (err) => {
      if(err) reject(err)
      resolve(true)
    })
  }).then(val => {
    if(val) {
      console.info('chrome driver removed success')
    }
  }).catch(error => console.error(error.toString()))
}

module.exports = {
  getChromeDriver,
  spawnChromedriver,
  clearChrome
}
