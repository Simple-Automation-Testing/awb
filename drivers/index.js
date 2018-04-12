const gecko = require('./firefox')
const chrome = require('./chrome')
const standalone = require('./standalone')
const { resolvePath } = require('./util')

const fs = require('fs')

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
  ...gecko,
  ...chrome,
  ...standalone,

  writeId,
  killProc
}
