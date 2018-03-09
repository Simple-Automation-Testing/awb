const SELENIUM_STATUSES = require('./responseSeleniumStatus')

class InterfaceError extends Error {

  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, InterfaceError)
  }
}

const handledErrors = {
  INVALID_SESSION_ID: (sessionId, additionalSessage) => {
    throw new InterfaceError(
      `Something went wrong with session ${sessionId}, \n ${additionalSessage ? additionalSessage : ''}
      `)
  },
  ELEMENT_NOT_FOUND: (sessionId, selector, additionalSessage, parentSelector) => {
    throw new InterfaceError(
      `Element with selector ${selector} not found on page ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalSessage ? additionalSessage : ''}`
    )
  },
  FRAME_NOT_FOUND: (sessionId, selector, additionalSessage) => {
    throw new InterfaceError(`Frame with selector ${selector} not found on page ,session id ${sessionId}, \n ${additionalSessage ? additionalSessage : ''}`)
  },
  COMMAND_NOT_FOUND: (sessionId, additionalSessage) => {
    throw new InterfaceError(`Command not found ,session id ${sessionId}, \n ${additionalSessage ? additionalSessage : ''}`)
  },
  STALE_ELEMENT_REFERENCE: (sessionId, selector, additionalSessage, parentSelector) => {
    throw new InterfaceError(`Element with selector ${selector} disappeared ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalSessage ? additionalSessage : ''}`)
  },
  ELEMENT_NOT_VISIBLE: (sessionId, selector, additionalSessage, parentSelector) => {
    throw new InterfaceError(
      `Element with selector ${selector} is not visible ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalSessage ? additionalSessage : ''}`
    )
  },
  INVALID_ELEMENT_STATE: (sessionId, selector, additionalSessage, parentSelector) => {
    throw new InterfaceError(
      `Element with selector ${selector} is not visible ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalSessage ? additionalSessage : ''}`
    )
  },
  UNKNOWN_ERROR: (sessionId, selector, additionalSessage, parentSelector) => {
    throw new InterfaceError(
      `UNKNOWN_ERROR ${selector} , ${parentSelector ? `parent selector was ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalSessage ? additionalSessage : ''}`
    )
  },
  JS_EXECUTE_ERROR: (sessionId, script, additionalSessage) => {
    throw new InterfaceError(
      `Something wend wrong with JavaScript ${script} check that script is valid, session id ${sessionId}, \n ${additionalSessage ? additionalSessage : ''}`
    )
  },
  XPATH_ERROR: (sessionId, selector, additionalSessage, parentSelector) => {
    throw new InterfaceError(
      `Xpath: ${selector} is invalid ${parentSelector ? `parent selector was ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalSessage ? additionalSessage : ''}`
    )
  },
  INVALID_SELECTOR: (sessionId, selector, additionalSessage, parentSelector) => {
    throw new InterfaceError(
      `Selector: ${selector} is invalid ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalSessage ? additionalSessage : ''}`
    )
  },
  UNSUPORTED_ERROR: (sessionId, selector, additionalSessage, parentSelector) => {
    throw new InterfaceError(
      `Selector: ${selector} is invalid ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalSessage ? additionalSessage : ''}`
    )
  }
}

module.exports = {
  InterfaceError,
  handledErrors
}


