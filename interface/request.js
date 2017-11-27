const http = require('http')
const { parseJson } = require('./util')

const requestInterface = (options, data) => new Promise((resolve, reject) => {
  const req = http.request(options, (res) => {
    let body = ''
    // console.log(`STATUS: ${res.statusCode}`)
    // console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      body += chunk.toString('utf8')
    })
    res.on('end', () => {
      resolve({ status: res.statusCode, body: parseJson(body) })
    })
  })
  data && req.write(data)
  req.end()
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`)
  })
})

module.exports = {
  requestInterface
}