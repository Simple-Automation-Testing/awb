const fetch = require('node-fetch')
const nodeUrl = require('url')

const bodyAdapter = (body) => {
  if(Object.hasOwnProperty.call(body, 'value') && !Object.hasOwnProperty.call(body, 'status')) {
    body.status = 0
  }
  return body
}

async function _fetchy(slowTime, method, timeout, url, body, opts) {

  opts = opts || {}
  const headers = opts.headers || {}

  // if method GET body should be undefined
  if(method == "GET") body = undefined
  // content type default: application/json
  if(body != null) {headers["Content-Type"] = "application/json"}
  // slowTime, if pause required before every request, default is 0
  if(slowTime) {await (() => new Promise(res => setTimeout(res, slowTime)))()}
  const response = await fetch(url, {
    method, headers, timeout,
    body: typeof body === 'object' ? JSON.stringify(body) : body
  })

  const contentType = response.headers.get("content-type")
  if(contentType && contentType.includes("application/json")) {

    if(response.status > 300) {
      throw new Error(`
      Something went wrong with request, pleace check driver server connection ${await response.text()}`)
    }
    const body = bodyAdapter(await response.json())
    return {body, headers: response.headers}
  } else {
    if(response.status > 300) {
      throw new Error(`
        Something went wrong with request, pleace check driver server connection ${await response.text()}`
      )
    }
    return {body: await response.text(), headers: response.headers}
  }
}


const fetchy = (slowTime, method, URL, timeout, path, body, opts) => {
  return _fetchy(slowTime, method, timeout, nodeUrl.resolve(URL, path), body, opts)
}

module.exports = (slowTime) => {
  return fetchy.bind(fetch, slowTime)
}