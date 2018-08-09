const fetch = require('node-fetch')
const url = require('url')

async function _fetchy(slowTime, method, timeout, url, body, opts) {

  opts = opts || {}
  const headers = opts.headers || {}
  if(method == "GET")
    body = undefined
  if(body != null) {
    headers["Content-Type"] = "application/json"
  }
  if(slowTime) {await (() => new Promise(res => setTimeout(res, slowTime)))()}
  const response = await fetch(url, {
    method, headers, timeout,
    body: typeof body === 'object' ? JSON.stringify(body) : body
  })

  const contentType = response.headers.get("content-type")
  if(contentType && contentType.includes("application/json")) {
    const body = await response.json()
    if(response.status > 300) {
      throw new Error(`
      Something went wrong with request, pleace check driver server connection ${await response.text()}`)
    }
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
  return _fetchy(slowTime, method, timeout, url.resolve(URL, path), body, opts)
}

module.exports = (slowTime) => {
  return fetchy.bind(fetch, slowTime)
}