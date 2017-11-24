class InterfaceError extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, InterfaceError)
  }
}

module.exports = {
  InterfaceError
}
