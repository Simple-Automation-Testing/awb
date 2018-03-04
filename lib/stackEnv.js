// standalone server stack part
const SUCCES_START_STANDALONE = 'Selenium Server is up and running'
const FAIL_START_STANDALONE_ANDDRESS = 'java.lang.RuntimeException: java.net.BindException: Address already in use'

const SUCCES_START_CHROMEDRIVER = 'Only local connections are allowed'
const FAIL_START_CHROME_ANDDRESS = 'Address already in use'


// emit exception types

const ALREADY_STARTED_ON_PORT = 'PORT ALREADY IN USE'

module.exports = {
  SUCCES_START_CHROMEDRIVER,
  SUCCES_START_STANDALONE,

  FAIL_START_STANDALONE_ANDDRESS,
  FAIL_START_CHROME_ANDDRESS,

  ALREADY_STARTED_ON_PORT
}
