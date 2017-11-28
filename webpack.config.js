const path = require('path')





module.exports =
  process.env.NODE_ENV === 'test-app'
    ? require('./webpack.test.app')
    : require('./webpack.app')