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
  ELEMENT_NOT_FOUND: (sessionId, selector, parentSelector, additionalSessage) => {
    throw new InterfaceError(
      `Element with selector ${selector} not found on page ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, ${additionalSessage ? additionalSessage : ''}`
    )
  },
  FRAME_NOT_FOUND: (sessionId, selector, additionalSessage) => {
    throw new InterfaceError(`Frame with selector ${selector} not found on page ,session id ${sessionId}, ${additionalSessage ? additionalSessage : ''}`)
  },
  COMMAND_NOT_FOUND: (sessionId, additionalSessage) => {
    throw new InterfaceError(`Command not found ,session id ${sessionId}, ${additionalSessage ? additionalSessage : ''}`)
  },
  STALE_ELEMENT_REFERENCE: (sessionId, selector, parentSelector, additionalSessage) => {
    throw new InterfaceError(`Element with selector ${selector} disappeared ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, ${additionalSessage ? additionalSessage : ''}`)
  },
  ELEMENT_NOT_VISIBLE: (sessionId, selector, parentSelector, additionalSessage) => {
    throw new InterfaceError(
      `Element with selector ${selector} is not visible ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, ${additionalSessage ? additionalSessage : ''}`
    )
  },
  INVALID_ELEMENT_STATE: (sessionId, selector, parentSelector, additionalSessage) => {
    throw new InterfaceError(
      `Element with selector ${selector} is not visible ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, ${additionalSessage ? additionalSessage : ''}`
    )
  },
  UNKNOWN_ERROR: (sessionId, selector, parentSelector, additionalSessage) => {
    throw new InterfaceError(
      `UNKNOWN_ERROR ${selector} , ${parentSelector ? `parent selector was ${parentSelector}` : ''} ,session id ${sessionId}, ${additionalSessage ? additionalSessage : ''}`
    )
  },
  JS_EXECUTE_ERROR: (sessionId, script, additionalSessage) => {
    throw new InterfaceError(
      `Something wend wrong with JavaScript ${script} check that script is valid, session id ${sessionId}, ${additionalSessage ? additionalSessage : ''}`
    )
  },
  XPATH_ERROR: (sessionId, selector, parentSelector, additionalSessage) => {
    throw new InterfaceError(
      `Xpath: ${selector} is invalid ${parentSelector ? `parent selector was ${parentSelector}` : ''} ,session id ${sessionId}, ${additionalSessage ? additionalSessage : ''}`
    )
  },
  INVALID_SELECTOR: (sessionId, selector, parentSelector, additionalSessage) => {
    throw new InterfaceError(
      `Selector: ${selector} is invalid ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, ${additionalSessage ? additionalSessage : ''}`
    )
  },
  UNSUPORTED_ERROR: (sessionId, selector, parentSelector, additionalSessage) => {
    throw new InterfaceError(
      `Selector: ${selector} is invalid ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, ${additionalSessage ? additionalSessage : ''}`
    )
  }
}

module.exports = {
  InterfaceError,
  handledErrors
}


