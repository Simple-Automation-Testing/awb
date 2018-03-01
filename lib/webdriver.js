const path = require('path')
const fs = require('fs')
const fetch = require('node-fetch')
const { spawn } = require('child_process')


const RUN_PROCCESS = require('./vars')

const {
  GECKO_PATH,
  CHROME_PATH,
  STANDALONE_PATH,
  resolvePath
} = require('../drivers/util')

const assertIsFreePort = async (port) => {
  try {
    const resp = await fetch(`http://127.0.0.1:${port}`, {
      timeout: 1000
    }).then(resp => resp.text())
    return false
  } catch (error) {
    return true
  }
}

const START_SUCCESS_STACK_CHROMEDRIVER = 'Only local connections are allowed'

const START_SUCCESS_STACK_GECKODRIVER = 'Listening on'

const START_SUCCESS_STACK = 'INFO - Selenium Server is up and running'

const ALREADY_IN_USE = 'ERROR - Port 4444 is busy, please choose a free port and specify it using'

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
    const { directConnect, browser } = this.settings
    const output = data.toString()
    this.output += output

    if (directConnect && browser === 'chrome') {
      if (this.output.includes(START_SUCCESS_STACK_CHROMEDRIVER)) {
        const exitHandler = this.exit
        this.process.removeListener('exit', exitHandler)
        this.startCb(RUN_PROCCESS.SUCCESS_RUN)
        return resolve(RUN_PROCCESS.SUCCESS_RUN_CHROME)
      }
    } else if (directConnect && browser === 'firefox') {
      if (this.output.includes(START_SUCCESS_STACK_GECKODRIVER)) {
        const exitHandler = this.exit
        this.process.removeListener('exit', exitHandler)
        this.startCb(RUN_PROCCESS.SUCCESS_RUN)
        return resolve(RUN_PROCCESS.SUCCESS_RUN_GECKO)
      }
    } else {
      if (this.output.includes(START_SUCCESS_STACK)) {
        const exitHandler = this.exit
        this.process.removeListener('exit', exitHandler)
        this.startCb(RUN_PROCCESS.SUCCESS_RUN)
        return resolve(RUN_PROCCESS.SUCCESS_RUN_STANDALONE)
      }
    }
  }


  startStandAlone() {
    const self = this
    return new Promise((resolve) => {
      return assertIsFreePort(self.port).then((isFree) => {
        if (!isFree) {
          self.startCb(RUN_PROCCESS.ADDRESS_IS_USE)
          return resolve(RUN_PROCCESS.ADDRESS_IS_USE)
        }

        const args = []
        if (typeof self.settings.browserDrivers == 'object') {
          if (this.settings.browserDrivers.chrome && typeof self.settings.browserDrivers.chrome === 'string') {
            args.push(`-Dwebdriver.chrome.driver=${CHROME_PATH}`)
          }
          if (self.settings.browserDrivers.gecko && typeof self.settings.browserDrivers.gecko == 'string') {
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

        self.process.stderr.on('data', self.dataHandler.bind(self, resolve))
      })
    })
  }

  startChromedriver() {
    const self = this
    return new Promise((resolve) => {
      return assertIsFreePort(self.port).then((isFree) => {
        console.log(isFree, 'ISFREEE')
        if (!isFree) {
          self.startCb(RUN_PROCCESS.ADDRESS_IS_USE)
          return resolve(RUN_PROCCESS.ADDRESS_IS_USE)
        }

        const args = []
        args.push(`--port=${self.port}`)
        self.process = spawn(`${CHROME_PATH}`, args)
        self.exitHandler = self.exit.bind(self)
        self.process.on('error', (err) => {
          if (err.code == 'ENOENT') {
            console.log(`Something went wrong ${err.message}`)
          }
        })

        self.process.on('exit', this.exitHandler)

        self.process.on('close', () => {
          console.log('Process was stoped')
        })

        self.process.stdout.on('data', self.dataHandler.bind(self, resolve))

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
      })
      // resolve(true)
    })
  }

  startGeckodriver() {
    const self = this

    return new Promise((resolve) => {
      const args = []

      args.push(`--port=${self.port}`)

      self.process = spawn(`${GECKO_PATH}`, args)

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

      self.process.stdout.on('data', self.dataHandler.bind(self, resolve))

      self.process.stderr.on('data', (data) => {

        const output = data.toString()
        self.output += output

        const isStarted = this.output.includes(START_SUCCESS_STACK)

        resolve(true)

        const exitHandler = self.exit
        self.process.removeListener('exit', exitHandler)

      })
      // resolve(true)
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



const a = {
  withStandalone: true,
  directConnect: false,
  browser: 'chrome',
  host: 'localhost',
  port: 4444,
  requestTime: 5000
}



process.on('message', ({ msg, data = {} }) => {

  const { withStandalone, directConnect, port, browser } = data

  if (msg === 'startDriver') {
    server = new ServerProvider({
      host: "127.0.0.1",
      port: 4444 | port,
      browserDrivers: {
        chrome: `${CHROME_PATH}`,
        gecko: `${GECKO_PATH}`
      }
    }, (status) => {
      if (status === RUN_PROCCESS.SUCCESS_RUN && sendCount) {
        sendCount--
        process.send({ msg: RUN_PROCCESS.SUCCESS_RUN })
      } else if (status === RUN_PROCCESS.ADDRESS_IS_USE && sendCount) {
        sendCount--
        process.send({ msg: RUN_PROCCESS.ADDRESS_IS_USE })
      }
    })

    if (directConnect && browser === 'chrome') {
      server.startChromedriver()
    } else if (directConnect && browser === 'firefox') {
      server.startGeckodriver()
    } else {
      server.startStandAlone()
    }
  }
  else if (msg === 'stop') {
    server.stop()
    process.send('server stoped')
  }
})
