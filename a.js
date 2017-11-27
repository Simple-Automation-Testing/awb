const fetch = require('node-fetch')

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
  port: 4444,
  path: '/wd/hub/session',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 6000
}


fetch('http://localhost:9515/session', {
  method: 'POST',
  headers: baseOptions.headers,
  body
}).then(a => {
  console.log(a)
})