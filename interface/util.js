const http = require('http');


const parseJson = (data) => {
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}

const toString = Object.prototype.toString;

const assertArray = arg => toString.call(arg) === '[object Array]';
const assertString = arg => toString.call(arg) === '[object String]';
const assertNumber = arg => toString.call(arg) === '[object Number]';
const assertObject = arg => arg !== null && typeof arg === 'object';


const requestInterface = (options, data) => new Promise((resolve, reject) => {
  const req = http.request(options, (res) => {
    // console.log(`STATUS: ${res.statusCode}`);
    // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8')
    res.on('data', (body) => {
      resolve(parseJson(body))
    })
    res.on('end', () => {
      // console.log('No more data in response.');
    })
  })
  data && req.write(data)
  req.end()
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
}).catch()

module.exports = {
  assertNumber,
  assertArray,
  assertObject,
  assertString,
  requestInterface
}