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

var fs = require('fs');
var tar = require('tar');
var zlib = require('zlib');
var path = require('path');
var mkdirp = require('mkdirp'); // used to create directory tree

var log = console.log;

var tarball = 'path/to/downloaded/archive.tar.gz';
var dest    = 'path/to/destination';

fs.createReadStream(tarball)
  .on('error', log)
  .pipe(zlib.Unzip())
  .pipe(tar.Parse())
  .on('entry', function(entry) {
    if (/\.js$/.test(entry.path)) { // only extract JS files, for instance
      var isDir     = 'Directory' === entry.type;
      var fullpath  = path.join(dest, entry.path);
      var directory = isDir ? fullpath : path.dirname(fullpath);

      mkdirp(directory, function(err) {
        if (err) throw err;
        if (! isDir) { // should really make this an `if (isFile)` check...
          entry.pipe(fs.createWriteStream(fullpath));
        }
      });
    }
  });