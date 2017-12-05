const fetch = require('node-fetch')
const { requestInterface } = require('./interface/request')
const http = require('http')

http.request = ((request) => (opts, ...args) => {
  return request(opts, ...args)
})(http.request.bind(http.request));

const body = JSON.stringify({
  desiredCapabilities: {
    browserName: 'chrome',
    javascriptEnabled: true,
    acceptSslCerts: true,
    platform: 'ANY'
  }
});

const baseOptions = {
  hostname: 'localhost',
  port: 9515,
  path: '/session',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 6000
}

baseOptions.method = 'POST'



fetch('http://localhost:9515/session/f04a6bffd9b8aa0ca417e4b4f1ff5b52', {
  method: 'DELETE',
  headers: baseOptions.headers
}).then(a => {
  // console.log(a)
})
