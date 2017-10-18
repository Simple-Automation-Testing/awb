":" //; exec /usr/bin/env node --harmony --expose-gc --trace-deprecation "$0" "$@"
const { requestInterface } = require('./util');

let defaultCapabilities = JSON.stringify({
  desiredCapabilities: {
    browserName: 'chrome',
    javascriptEnabled: true,
    acceptSslCerts: true,
    platform: 'ANY'
  }
});

const baseOptions = {
  hostname: 'localhost',
  port: 4444,
  path: '/wd/hub/session',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 6000
};

async function getCurrentWindowHandle(sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'GET';
  options.path = `/wd/hub/session/${sessionId}/window_handle`;
  const { body } = await requestInterface(options);
  return body;
};

async function getCurrentWindowHandles (sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'GET';
  options.path = `/wd/hub/session/${sessionId}/window_handles`;
  const { body } = await requestInterface(options);
  return body;
};

async function getScreenshot(sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'GET';
  options.path = `/wd/hub/session/${sessionId}/screenshot`;
  const { body } = await requestInterface(options);
  return body;
};

async function forwardHistory(sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/forward`;
  const { body } = await requestInterface(options);
  return body;
};

async function backHistory(sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/back`;
  const { body } = await requestInterface(options);
  return body;
};

async function refreshCurrentPage(sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/refresh`;
  const { body } = await requestInterface(options);
  return body;
};

async function resizeWindow(sessionId, rect, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/window/current/size`;
  const { body } = await requestInterface(options, JSON.stringify(rect));
  return body;
};

async function getUrl(sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'GET';
  options.path = `/wd/hub/session/${sessionId}/url`;
  const { body: { value } } = await requestInterface(options);
  return value;
};

async function clickElement(sessionId, elementId, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/click`;
  const data = await requestInterface(options, JSON.stringify({ button: 0 }));
  return data;
};

async function submitElement(sessionId, elementId, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/submit`;
  const data = await requestInterface(options);
  return data;
};

async function clearElementText(sessionId, elementId, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/clear`;
  const data = await requestInterface(options);
  return data;
};

async function getElementText(sessionId, elementId, options) {
  if (!options) options = baseOptions;
  options.method = 'GET';
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/text`;
  const data = await requestInterface(options);
  return data;
};

async function getTitle(sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'GET';
  options.path = `/wd/hub/session/${sessionId}/title`;
  const { body: { value } } = await requestInterface(options);
  return value;
};

async function goToUrl(sessionId, url, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/url`
  const data = await requestInterface(options, JSON.stringify({
    url
  }));
};

async function findElement(sessionId, selector, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/element`
  const { body: { value: { ELEMENT } } } = await requestInterface(options, JSON.stringify({
    using: 'css selector', value: selector
  }));
  return ELEMENT;
};

async function findElements(sessionId, selector, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/elements`
  const data = await requestInterface(options, JSON.stringify({
    using: 'css selector', value: selector
  }));
  return data;
};

async function initSession(data, options) {
  if (!data) data = defaultCapabilities;
  if (!options) options = baseOptions;
  options.method = 'POST';
  const { body: { sessionId } } = await requestInterface(options, data);
  return sessionId;
};

async function sendKeys(sessionId, elementId, keysToSend, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/value`
  if (!Array.isArray(keysToSend)) {
    keysToSend = [keysToSend];
  }
  await requestInterface(options, JSON.stringify({value: keysToSend}));
};

async function killSession(sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'DELETE';
  options.path = `/wd/hub/session/${sessionId}`;
  await requestInterface(options);
};

module.exports = {
  sendKeys,
  resizeWindow,
  killSession,
  initSession,
  findElements,
  findElement,
  goToUrl,
  getUrl,
  getTitle,
  clickElement
};
