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


var fs = require('fs');
var tar = require('tar');
var zlib = require('zlib');
var path = require('path');
const { resolve } = require('path')
var mkdirp = require('mkdirp'); // used to create directory tree

var log = console.log;



const geckodriver = 'https://github.com/mozilla/geckodriver/releases/download/v0.19.1/geckodriver-v0.19.1-macos.tar.gz'

const resolvePath = (path) => resolve(__dirname, path)


var tarball = resolvePath('./geckodriver-v0.19.1-macos.tar.gz')
var dest = resolvePath('./')


// fs.createReadStream(tarball)
//   .on('error', console.log)
//   .pipe(zlib.Unzip())
//   .pipe(new tar.Parse())
//   .on('entry', function (entry) {
//     mkdirp(path.dirname(path.join(dest, entry.path)), function (err) {
//       if (err) throw err;
//       entry.pipe(fs.createWriteStream(path.join(dest, entry.path)))
//       entry.on('end', () => {
//         console.log('dasl;d;ask;kd;kas;k;l')
//       })
//     })
//   })