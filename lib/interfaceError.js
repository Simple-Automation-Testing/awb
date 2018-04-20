const SELENIUM_STATUSES = require('./responseSeleniumStatus')
const {STATUS_FROM_DRIVER} = require('./responseSeleniumStatus')

class InterfaceError extends Error {

  constructor(...args) {
    console.log(args)
    super(...args)
    Error.captureStackTrace(this, InterfaceError)
  }
}


const errors = {
  INVALID_SESSION_ID: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `Something went wrong with session ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`)
  },
  ELEMENT_NOT_FOUND: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `Element with selector ${selector} not found on page ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  },
  FRAME_NOT_FOUND: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(`Frame with selector ${selector} not found on page ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`)
  },
  COMMAND_NOT_FOUND: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(`Command not found ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`)
  },
  STALE_ELEMENT_REFERENCE: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(`Element with selector ${selector} disappeared ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`)
  },
  ELEMENT_NOT_VISIBLE: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `Element with selector ${selector} is not visible ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  },
  INVALID_ELEMENT_STATE: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `Element with selector ${selector} is not visible ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  },
  UNKNOWN_ERROR: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `UNKNOWN_ERROR ${selector} , ${parentSelector ? `parent selector was ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  },
  JS_EXECUTE_ERROR: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `Something wend wrong with JavaScript, check that script is valid, session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  },
  XPATH_ERROR: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `Xpath: ${selector} is invalid ${parentSelector ? `parent selector was ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  },
  INVALID_SELECTOR: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `Selector: ${selector} is invalid ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  },
  UNSUPORTED_ERROR: ({sessionId, selector, additionalMessage, parentSelector}) => {
    throw new InterfaceError(
      `Selector: ${selector} is invalid ${parentSelector ? `parent selector is ${parentSelector}` : ''} ,session id ${sessionId}, \n ${additionalMessage ? additionalMessage : ''}`
    )
  }
}

const handledErrors = (status) => {
  const err = errors[STATUS_FROM_DRIVER[status]]

  return err ? {err, errorType: STATUS_FROM_DRIVER[status]} : {}
}

module.exports = {
  InterfaceError,
  handledErrors
}


