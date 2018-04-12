const statusToCode = {
  SUCCESS: 0,
  INVALID_SESSION_ID: 6,
  ELEMENT_NOT_FOUND: 7,
  FRAME_NOT_FOUND: 8,
  COMMAND_NOT_FOUND: 9,
  STALE_ELEMENT_REFERENCE: 10,
  ELEMENT_NOT_VISIBLE: 11,
  INVALID_ELEMENT_STATE: 12,
  UNKNOWN_ERROR: 13,
  JS_EXECUTE_ERROR: 17,
  XPATH_ERROR: 19,
  INVALID_SELECTOR: 32
}

const codeToStatus = {
  0: 'SUCCESS',
  6: 'INVALID_SESSION_ID',
  7: 'ELEMENT_NOT_FOUND',
  8: 'FRAME_NOT_FOUND',
  9: 'COMMAND_NOT_FOUND',
  10: 'STALE_ELEMENT_REFERENCE',
  11: 'ELEMENT_NOT_VISIBLE',
  12: 'INVALID_ELEMENT_STATE',
  13: 'UNKNOWN_ERROR',
  17: 'JS_EXECUTE_ERROR',
  19: 'XPATH_ERROR',
  32: 'INVALID_SELECTOR'
}


const codeToStatusWithUnsuported = new Proxy(codeToStatus, {
  get: function (target, name) {
    if (name === '0' || name === 0) return null
    return name in target ? target[name] : 'UNSUPORTED_ERROR'
  }
})

module.exports = statusToCode
module.exports.STATUS_FROM_DRIVER = codeToStatusWithUnsuported
