function InterfaceError(message, fileName, lineNumber) {
  const instance = new Error(message, fileName, lineNumber)

  Object.setPrototypeOf(instance, Object.getPrototypeOf(this))
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, InterfaceError)
  }
  return instance
}

InterfaceError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
})

if (Object.setPrototypeOf) {
  Object.setPrototypeOf(InterfaceError, Error)
} else {
  InterfaceError.__proto__ = Error
}


module.exports = {
  InterfaceError
}

