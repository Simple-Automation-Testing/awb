const parseJson = (data) => {
  try {
    return JSON.parse(data)
  } catch (error) {
    console.error(error.toString())
    return data
  }
}

const WEB_EMENET_ID = 'element-6066-11e4-a52e-4f735466cecf'

const returnStringType = arg => Object.prototype.toString.call(arg)

const assertArray = arg => returnStringType(arg) === '[object Array]'
const assertString = arg => returnStringType(arg) === '[object String]'
const assertNumber = arg => returnStringType(arg) === '[object Number]'
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

async function waitElementPresent(conditionFn, session, selector, time) {
  const now = +Date.now()

  const callTime = 100

  const sleep = (ms) => new Promise(res => setTimeout(res, ms))


  let resp
  while (Date.now() - now < time) {
    resp = await conditionFn(session, selector)
    if (resp.status == 0) return { value: resp.value }
    await sleep(callTime)
  }

  const errMessage =
    (resp.value.hasOwnProperty('message') && resp.value.message.includes('no such element: Unable to locate elemen')) ?
      resp.value.message : `Element with selector ${selector} does not present`
  return { error: errMessage }

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
  WEB_EMENET_ID
}
