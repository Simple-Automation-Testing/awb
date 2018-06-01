const SELENIUM_STATUSES = require('./responseSeleniumStatus')
const {STATUS_FROM_DRIVER} = require('./responseSeleniumStatus')

class InterfaceError extends Error {

  constructor(message, extra) {
    super()
    this.name = 'AWB Error'
    this.message = message
    Error.captureStackTrace(this, this.constructor)
  }
}


const errors = {
  INVALID_SESSION_ID: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `INVALID_SESSION_ID | Something went wrong with session ${sessionId},  ${additionalMessage ? additionalMessage : ''}`)
  },
  ELEMENT_NOT_FOUND: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `ELEMENT_NOT_FOUND | Element with selector ${selector} not found on page ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  },
  FRAME_NOT_FOUND: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `FRAME_NOT_FOUND | Frame with selector ${selector} not found on page ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`)
  },
  COMMAND_NOT_FOUND: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `COMMAND_NOT_FOUND | Command not found ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`)
  },
  STALE_ELEMENT_REFERENCE: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `STALE_ELEMENT_REFERENCE | Element with selector ${selector} disappeared ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`)
  },
  ELEMENT_NOT_VISIBLE: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `ELEMENT_NOT_VISIBLE | Element with selector ${selector} is not visible ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  },
  INVALID_ELEMENT_STATE: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `INVALID_ELEMENT_STATE | Element with selector ${selector} is not visible ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  },
  UNKNOWN_ERROR: function({sessionId, selector, additionalMessage, parentSelector}) {
    throw new InterfaceError(
      `UNKNOWN_ERROR | Element with selector ${selector} , ${parentSelector ? `parent selector was ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  },
  JS_EXECUTE_ERROR: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `JS_EXECUTE_ERROR | Something wend wrong with JavaScript, check that script is valid, session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  },
  XPATH_ERROR: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `XPATH_ERROR | Xpath: ${selector} is invalid ${parentSelector ? `parent selector was ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  },
  INVALID_SELECTOR: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `INVALID_SELECTOR | Selector: ${selector} is invalid ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  },
  UNSUPORTED_ERROR: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `UNSUPORTED_ERROR | Selector: ${selector} is invalid ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  }
}

function handledErrors(status) {
  const err = errors[STATUS_FROM_DRIVER[status]]
  return err ? {err, errorType: STATUS_FROM_DRIVER[status]} : {}
}

module.exports = {
  InterfaceError,
  handledErrors
}


