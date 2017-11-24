const http = require('http')

const parseJson = (data) => {
  try {
    return JSON.parse(data)
  } catch (error) {
    console.error(error.toString())
    return data
  }
}

const returnStringType = arg => Object.prototype.toString.call(arg)

const assertArray = arg => returnStringType(arg) === '[object Array]'
const assertString = arg => returnStringType(arg) === '[object String]'
const assertNumber = arg => returnStringType(arg) === '[object String]'
const assertFunction = arg => returnStringType(arg) === '[object Function]'
const assertObject = arg => arg !== null && typeof arg === 'object'

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
  assertNumber,
  assertArray,
  assertObject,
  assertString,
  assertFunction,
  requestInterface
}
