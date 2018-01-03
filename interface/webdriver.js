const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

const { GECKO_PATH, CHROME_PATH, STANDALONE_PATH, resolvePath } = require('../envUtils')

const START_SUCCESS_STACK = 'INFO - Selenium Server is up and running'

const ALREADY_IN_USE = 'java.lang.RuntimeException: java.net.BindException: Address already in use'

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

  startStandAlone() {
    const self = this
    return new Promise((resolve) => {

      const args = []

      if (typeof this.settings.browserDrivers == 'object') {
        if (this.settings.browserDrivers.chrome && typeof this.settings.browserDrivers.chrome === 'string') {
          args.push(`-Dwebdriver.chrome.driver=${CHROME_PATH}`)
        }
        if (this.settings.browserDrivers.gecko && typeof this.settings.browserDrivers.gecko == 'string') {
          args.push(`-Dwebdriver.gecko.driver=${GECKO_PATH}`)
        }
      }

      args.push('-jar', `${STANDALONE_PATH}`)

      self.process = spawn('java', args)


      self.exitHandler = self.exit.bind(self)


      self.process.on('error', (err) => {
        if (err.code == 'ENOENT') {
          console.log(`Something went wrong ${err.message}`)
        }
      })

      self.process.on('exit', this.exitHandler)

      self.process.on('close', () => {
        console.log('Selenium process stopped')
      })

      self.process.stdout.on('data', (data) => {
        let output = data.toString()
        this.output += output

        const isStarted = this.output.includes(START_SUCCESS_STACK)

        if (isStarted) {
          const exitHandler = self.exitHandler

          self.process.removeListener('exit', exitHandler)

          self.startCb('Close')
        }
      })

      self.process.stderr.on('data', (data) => {
        const output = data.toString()
        self.output += output

        const isAddressInUse = this.output.includes(ALREADY_IN_USE)

        const isStarted = this.output.includes(START_SUCCESS_STACK)

        if (isAddressInUse) {
          self.startCb('selenium already started on port 4444')
          resolve(true)
        }

        if (isStarted) {
          const exitHandler = self.exit

          self.process.removeListener('exit', exitHandler)
          self.startCb('started success')
        }
      })
      resolve(true)
    })

  }

  stop(cb) {
    if (!this.process || this.process.killed) {
      console.log('Something went wrong')
      callback(false)
      return
    }
    try {
      this.process.kill()
      this.writeLogFile(cb)
    } catch (e) {
      console.log(e.toString())
      cb()
    }
  }

  exit(code) {
    this.startCb('Selenium process exit', code)
  }

  writeLogFile(cb) {

    const filePath = path.resolve(path.join(process.cwd(), 'debug.log'))

    fs.writeFile(filePath, this.output, function (err) {
      if (err) {
        console.log('\nError writing log file to:', err.path)
      }
      cb && cb()
    })
  }
}

let sendCount = 1
let server = null

process.on('message', ({ msg }) => {
  if (msg === 'startStandalone') {

    server = new ServerProvider({
      standAlonePath: `${STANDALONE_PATH}`,
      host: "127.0.0.1",
      port: 4444,
      browserDrivers: {
        chrome: `${CHROME_PATH}`
      }
    }, (status) => {
      if (status.includes('started success') && sendCount) {
        sendCount--
        process.send({ msg: 'server started' })
      } else if (status.includes('selenium already') && sendCount) {
        sendCount--
        process.send({ msg: 'selenium already started on port 4444' })
      }
    })

    server.startStandAlone()
  }
  else if (msg === 'stop') {
    server.stop()
    process.send('server stoped')
  }
})