const parseJson = (data) => {
  try {
    return JSON.parse(data)
  } catch (error) {
    console.error(error.toString())
    return data
  }
}

const elementIDregexp = /^(\d.)(\d+)(-)(\d)+$/gi

const returnStringType = arg => Object.prototype.toString.call(arg)

const assertArray = arg => returnStringType(arg) === '[object Array]'
const assertString = arg => returnStringType(arg) === '[object String]'
const assertNumber = arg => returnStringType(arg) === '[object String]'
const assertFunction = arg => returnStringType(arg) === '[object Function]'
const assertObject = arg => arg !== null && typeof arg === 'object'

function waitCondition(conditionFn, time, conditionTarget) {
  let condition = null
  let callCount = 100

  const callTime = time / 1000

  function dummyAsyncCall(callback, timeout) {
    setTimeout(function () {
      callback(conditionFn())
    }, timeout)
  }

  function recursiveCall(resolve, reject) {
    dummyAsyncCall(function (data) {
      console.log(data)
      data.then((resp) => {
        console.log(resp)
        condition = resp.body.value
        if (callCount > 0 && !condition && (conditionTarget && (!conditionTarget === condition))) {
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


module.exports = {
  assertNumber,
  returnStringType,
  parseJson,
  assertArray,
  assertObject,
  assertString,
  assertFunction,
  waitCondition,
  elementIDregexp
}
