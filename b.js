const url = 'http://chromedriver.storage.googleapis.com/2.33/chromedriver_mac64.zip'
const fs = require('fs')
const fetch = require('node-fetch')
const unzip = require('unzip')
const { execFile } = require('child_process')

const allow = async () => {
  return new Promise((resolve) => {
    fetch(url)
      .then(function (res) {
        const dest = fs.createWriteStream('./chromedriver.zip')
        res.body.pipe(dest)
        res.body.on('end', () => {
          const stream = fs.createReadStream('./chromedriver.zip').pipe(unzip.Extract({ path: './' }))
        })
      })
  }).then((value) => {
    console.log(value)
  })
}

allow()