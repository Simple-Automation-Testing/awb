const fetch = require('node-fetch')

async function _fetchy(method, timeout, url, body, opts) {

  opts = opts || {}
  const headers = opts.headers || {}
  if(method == "GET")
    body = undefined
  if(body != null) {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(url, {
    method,
    headers,
    body: typeof body === 'object' ? JSON.stringify(body) : body,
    timeout
  })

  const contentType = response.headers.get("content-type")
  if(contentType && contentType.includes("application/json")) {
    const body = await response.json()
    return {body, status: response.status, headers: response.headers}
  } else {
    return {body: await response.text(), status: response.status, headers: response.headers}
  }
}


const fetchy = (method, URL, timeout, path, body, opts) => {
  return _fetchy(method, timeout, URL + path, body, opts)
}

module.exports = fetchy