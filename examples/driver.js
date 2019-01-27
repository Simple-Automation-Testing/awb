const awb = require('../awb')({
  desiredCapabilities: {
    javascriptEnabled: true, acceptSslCerts: true, platform: 'ANY', browserName: 'firefox'
  }, host: 'http://localhost:9090', remote: true
})

module.exports = awb
