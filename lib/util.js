const parseJson = (data) => {
  try {
    return JSON.parse(data)
  } catch(error) {
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

async function waitCondition(conditionFn, wailtTime, conditionAsserter, ...rest) {
  const now = +Date.now(); const callTime = 100

  const sleep = (ms) => new Promise(res => setTimeout(res, ms))

  let resp
  while(Date.now() - now < wailtTime) {
    await sleep(callTime)
    const resp = await conditionFn(...rest)
    const assertStatus = conditionAsserter(resp)

    if(assertStatus) return {value: assertStatus, time: wailtTime - (Date.now() - now)}
    await sleep(callTime)
  }

  return {error: 'Condition error'}
}

async function waitElementPresent(conditionFn, session, selector, wailtTime) {
  const now = +Date.now(); const callTime = 100

  const sleep = (ms) => new Promise(res => setTimeout(res, ms))

  let resp
  while(Date.now() - now < wailtTime) {
    resp = await conditionFn(session, selector)
    if(resp.status == 0) return {value: resp.value, time: wailtTime - (Date.now() - now)}
    await sleep(callTime)
  }

  const errMessage =
    (resp.value.hasOwnProperty('message') && resp.value.message.includes('no such element: Unable to locate elemen')) ?
      resp.value.message : `Element with selector ${selector} does not present`
  return {error: errMessage}
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
