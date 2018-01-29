const { InterfaceError } = require('./interfaceError')
const parseJson = (data) => {
  try {
    return JSON.parse(data)
  } catch (error) {
    console.error(error.toString())
    return data
  }
}

const WEB_EMENET_ID = 'element-6066-11e4-a52e-4f735466cecf'

const elementIDregexp = /^(\d.)(\d+)(-)(\d)+$/gi

const returnStringType = arg => Object.prototype.toString.call(arg)

const assertArray = arg => returnStringType(arg) === '[object Array]'
const assertString = arg => returnStringType(arg) === '[object String]'
const assertNumber = arg => returnStringType(arg) === '[object String]'
const assertFunction = arg => returnStringType(arg) === '[object Function]'
const assertObject = arg => arg !== null && typeof arg === 'object'

function waitCondition(conditionFn, time, conditionTarget) {
  let condition = null
  const now = +Date.now()

  const callTime = 1

  function asyncCall(callback, timeout) {
    setTimeout(function () {
      callback(conditionFn())
    }, timeout)
  }

  function recursiveCall(resolve, reject) {
    const timeDiffState = (+Date.now() - now) < time
    asyncCall(function (data) {
      data.then((resp) => {
        condition = resp.body.value
        if (typeof conditionTarget === 'function') {
          condition = conditionTarget(condition)
        }
        if (timeDiffState && !condition && (conditionTarget && (!conditionTarget === condition))) {
          recursiveCall(resolve, reject)
        } else {
          resolve(condition)
        }
      }).catch(reject)

    }, callTime)
    callCount--
  }

  return new Promise(function (resolve, reject) {
    recursiveCall(resolve, reject)
  })
}

function waitElementPresent(conditionFn, session, selector, time) {
  const now = +Date.now()
  const callTime = 1

  function asyncCall(callback, timeout) {
    setTimeout(function () {
      return callback(conditionFn(session, selector))
    }, callTime)
  }

  function recursiveCall(resolve) {
    const timeDiffState = (+Date.now() - now) < time
    asyncCall(function (data) {
      data.then((resp) => {
        if (timeDiffState && resp.status !== 0) {
          recursiveCall(resolve)
        } else if (!timeDiffState) {
          const errMessage =
            (resp.value.hasOwnProperty('message') && resp.value.message.includes('no such element: Unable to locate elemen')) ?
              resp.value.message : `Element with selector ${selector} does not present`
          resolve({ error: errMessage })
        } else {
          resolve({ value: resp.value })
        }
      })
    }, callTime)
  }
  return new Promise(function (resolve) {
    recursiveCall(resolve)
  })
}


module.exports = {
  assertNumber,
  returnStringType,
  parseJson,
  assertArray,
  waitElementPresent,
  assertObject,
  assertString,
  assertFunction,
  waitCondition,
  elementIDregexp,
  WEB_EMENET_ID
}
