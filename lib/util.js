const parseJson = (data) => {
  try {return JSON.parse(data)}
  catch(error) {console.error(error.toString()); return data}
}

const WEB_EMENET_ID = 'element-6066-11e4-a52e-4f735466cecf'

const sleep = (ms = 100) => new Promise(res => setTimeout(res, ms))

const returnStringType = arg => Object.prototype.toString.call(arg)

const assertArray = arg => returnStringType(arg) === '[object Array]'
const assertString = arg => returnStringType(arg) === '[object String]'
const assertNumber = arg => returnStringType(arg) === '[object Number]'
const assertFunction = arg => returnStringType(arg) === '[object Function]'
const assertObject = arg => arg !== null && typeof arg === 'object'

const toElementObject = (elId) => ({ELEMENT: elId, [WEB_EMENET_ID]: elId})

async function waitCondition(conditionFn, conditionAsserter, wailtTime, ...rest) {
  const now = +Date.now(); const callTime = 100

  while(Date.now() - now < wailtTime) {
    const resp = await conditionFn(...rest)
    const assertStatus = conditionAsserter(resp)
    if(assertStatus) return {value: assertStatus, time: wailtTime - (Date.now() - now)}
    await sleep(callTime)
  }
  return {error: 'Condition error'}
}

async function baseNegativeWait(conditionFn, time, errMessage) {
  const now = +Date.now(); const callTime = 100
  while(Date.now() - now < time) {
    const resp = await conditionFn()
    if(resp.status !== 0) return {time: time - (Date.now() - now)}
    await sleep(callTime)
  }
  return {error: errMessage}
}

async function baseWait(conditionFn, session, selector, wailtTime) {
  const now = +Date.now(); const callTime = 100
  let resp = null
  while(Date.now() - now < wailtTime) {
    resp = await conditionFn(session, selector)

    if(resp.status == 0) {
      if(Array.isArray(resp.value) && !resp.value.length) {
        null
      } else {
        return {value: resp.value, time: wailtTime - (Date.now() - now)}
      }
    }
    await sleep(callTime)
  }
  const errMessage =
    resp.value.toString().includes('no such element: Unable to locate elemen') ?
      resp.value : `Element with selector ${JSON.stringify(selector)} does not present`
  return {error: errMessage}
}

module.exports = {
  toElementObject,
  
  assertNumber,
  returnStringType,
  parseJson,
  assertArray,
  sleep,
  baseWait,
  assertObject,
  assertString,
  assertFunction,
  waitCondition,
  baseNegativeWait,
  WEB_EMENET_ID
}
