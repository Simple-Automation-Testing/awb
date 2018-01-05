const SELENIUM_STATUSES = require('./reponseSeleniumStatus')

class InterfaceError extends Error {

  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, InterfaceError)
  }
}

const handledErrors = {
  INVALID_SESSION_ID: (sessionId) => {
    throw new InterfaceError(`Something went wrong with session ${sessionId}`)
  },
  ELEMENT_NOT_FOUND: (sessionId, selector, parentSelector) => {
    throw new InterfaceError(
      `Element with selector ${selector} not found on page ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}`
    )
  },
  FRAME_NOT_FOUND: (sessionId, selector) => {
    throw new InterfaceError(`Frame with selector ${selector} not found on page ,session id ${sessionId}`)
  },
  COMMAND_NOT_FOUND: (sessionId) => {
    throw new InterfaceError(`Command not found ,session id ${sessionId}`)
  },
  STALE_ELEMENT_REFERENCE: (sessionId, selector, parentSelector) => {
    throw new InterfaceError(`Element with selector ${selector} disappeared ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}`)
  },
  ELEMENT_NOT_VISIBLE: (sessionId, selector, parentSelector) => {
    throw new InterfaceError(
      `Element with selector ${selector} is not visible ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}`
    )
  },
  INVALID_ELEMENT_STATE: (sessionId, selector, parentSelector) => {
    throw new InterfaceError(
      `Element with selector ${selector} is not visible ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}`
    )
  },
  UNKNOWN_ERROR: (sessionId, selector, parentSelector) => {
    throw new InterfaceError(
      `UNKNOWN_ERROR ${selector} , ${parentSelector ? `parent selector was ${parentSelector}` : ''} ,session id ${sessionId}`
    )
  },
  JS_EXECUTE_ERROR: (sessionId, script) => {
    throw new InterfaceError(
      `Something wend wrong with JavaScript ${script} check that script is valid, session id ${sessionId}`
    )
  },
  XPATH_ERROR: (sessionId, selector, parentSelector) => {
    throw new InterfaceError(
      `Xpath: ${selector} is invalid ${parentSelector ? `parent selector was ${parentSelector}` : ''} ,session id ${sessionId}`
    )
  },
  INVALID_SELECTOR: (sessionId, selector, parentSelector) => {
    throw new InterfaceError(
      `Selector: ${selector} is invalid ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}`
    )
  },
  UNSUPORTED_ERROR: (sessionId) => {
    throw new InterfaceError(
      `Selector: ${selector} is invalid ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}`
    )
  }
}

module.exports = {
  InterfaceError,
  handledErrors
}


