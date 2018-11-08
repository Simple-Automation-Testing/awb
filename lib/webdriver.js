const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')
const {spawn} = require('child_process')

const {
  GECKO_PATH,
  CHROME_PATH,
  STANDALONE_PATH
} = require('../drivers/util')
const RUN_PROCCESS = require('./vars')

function getRandomPort() {
  const getRN = () => Math.floor(Math.random() * 10)
  return Number(`${1}${getRN()}${getRN()}${getRN()}${getRN()}`)
}
const assertIsFreePort = async (port) => {
  try {
    await fetch(`http://127.0.0.1:${port}`, {timeout: 500})
    return false
  } catch(error) {
    return true
  }
}

const getFreePort = async (port) => {
  let getPortCount = 15; incrementCoun = 0
  do {
    port += incrementCoun
    const result = await assertIsFreePort(port)
    if(result) return port
    incrementCoun++
  } while(getPortCount--)
}

const START_SUCCESS_STACK_CHROMEDRIVER = 'Only local connections are allowed'

const START_SUCCESS_STACK_GECKODRIVER = 'Listening on'

const START_SUCCESS_STACK = 'Selenium Server is up and running'

const ALREADY_IN_USE = 'please choose a free port and specify it using'

const DEFAULT_PORT = 4444
const DEFAULT_HOST = '127.0.0.1'

class ServerProvider {

  constructor(settings, callback) {
    this.settings = settings
    this.startCb = callback

    this.port = this.settings.port || DEFAULT_PORT
    this.host = this.settings.host || DEFAULT_HOST

    this.output = ''
    this.process = null
  }

  dataHandler(resolve, data) {
    this.output += data.toString()

    if(this.output.includes(this.stackString)) {
      this.process.removeListener('exit', this.exit.bind(this))

      this.startCb(RUN_PROCCESS.SUCCESS_RUN)
      return resolve(RUN_PROCCESS.SUCCESS_RUN_CHROME)
    }
  }

  async start() {

    const self = this
    const resolve = Promise.resolve.bind(Promise)
    const {host, port, desiredCapabilities: {browserName}, directConnect} = self.settings

    const run = () => {
      const args = []; let execFile
      if(directConnect && browserName === 'chrome') {
        execFile = CHROME_PATH; args.push(`--port=${port}`)
      } else if(directConnect && browserName === 'firefox') {
        execFile = GECKO_PATH; args.push(`--port=${port}`)
      } else if(!directConnect && browserName === 'chrome') {
        execFile = 'java'; args.push(`-Dwebdriver.chrome.driver=${CHROME_PATH}`, '-jar', `${STANDALONE_PATH}`)
      } else if(!directConnect && browserName === 'firefox') {
        execFile = 'java'; args.push(`-Dwebdriver.gecko.driver=${GECKO_PATH}`, '-jar', `${STANDALONE_PATH}`)
      }
      return spawn(execFile, args)
    }

    const assertDrivers = () => {
      if(directConnect && browserName === 'chrome') {
        if(!fs.existsSync(path.resolve(__dirname, CHROME_PATH))) {return RUN_PROCCESS.DRIVER_NOT_FOUND}
        return START_SUCCESS_STACK_CHROMEDRIVER
      } else if(directConnect && browserName === 'firefox') {
        if(!fs.existsSync(path.resolve(__dirname, GECKO_PATH))) {return RUN_PROCCESS.DRIVER_NOT_FOUND}
        return START_SUCCESS_STACK_GECKODRIVER
      } else if(!directConnect && browserName === 'chrome') {
        if(!fs.existsSync(path.resolve(__dirname, STANDALONE_PATH)) || !fs.existsSync(path.resolve(__dirname, CHROME_PATH))) {
          return RUN_PROCCESS.DRIVER_NOT_FOUND
        }
        return START_SUCCESS_STACK
      } else if(!directConnect && browserName === 'firefox') {
        if(!fs.existsSync(path.resolve(__dirname, STANDALONE_PATH)) || !fs.existsSync(path.resolve(__dirname, GECKO_PATH))) {
          return RUN_PROCCESS.DRIVER_NOT_FOUND
        }
        return START_SUCCESS_STACK
      }
    }

    const isFree = await assertIsFreePort(self.port)

    if(!isFree) {
      self.startCb(RUN_PROCCESS.ADDRESS_IS_USE)
      return RUN_PROCCESS.ADDRESS_IS_USE
    }

    self.stackString = assertDrivers()

    self.process = run()

    self.process.on('error', (err) => {
      console.log(err)
      if(err.code == 'ENOENT') {console.log(`Something went wrong ${err.message}`)}
    })

    self.process.on('exit', self.exit.bind(self))

    self.process.on('close', () => {console.log('Selenium process stopped')})

    self.process.stdout.on('data', self.dataHandler.bind(self, resolve))
    self.process.stderr.on('data', self.dataHandler.bind(self, resolve))
  }

  stop(cb) {
    if(!this.process || this.process.killed) {
      console.log('Something went wrong')
      return cb(false)
    }
    try {
      this.process.kill()
      this.writeLogFile(cb)
    } catch(e) {
      console.log(e.toString())
      cb()
    }
  }

  exit(code) {this.startCb('Selenium process exit', code)}

  writeLogFile(cb) {
    const filePath = path.resolve(path.join(process.cwd(), 'debug.log'))
    fs.writeFile(filePath, this.output, function(err) {
      if(err) {console.log('\nError writing log file to:', err.path)}
      cb && cb()
    })
  }
}

let sendCount = 1
let server = null

// const a = {
//   withStandalone: true,
//   directConnect: false,
//   browser: 'chrome',
//   host: 'localhost',
//   port: 4444,
//   requestTime: 5000
// }

// host: "127.0.0.1",
// port: 4444 | port,
// browserDrivers: {
//   chrome: `${CHROME_PATH}`,
//   gecko: `${GECKO_PATH}`
// }
// }


process.on('message', ({msg, data = {}}) => {
  const {remote, ...resp} = data

  if(remote) {
    return process.send({msg: 'remote'})
  }

  if(msg === 'startDriver') {
    server = new ServerProvider(resp, (status) => {
      if(status && sendCount) {
        sendCount--
        process.send({msg: status})
      }
    })
    server.start()
  }
  else if(msg === 'stop') {
    server.stop()
    process.send('server stoped')
  }
})
