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

const getCurrentWindowHandle = async function (sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'GET';
  options.path = `/wd/hub/session/${sessionId}/window_handle`;
  const { body } = await requestInterface(options);
  return body;
};

const getCurrentWindowHandles = async function (sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'GET';
  options.path = `/wd/hub/session/${sessionId}/window_handles`;
  const { body } = await requestInterface(options);
  return body;
};

const getScreenshot = async function (sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'GET';
  options.path = `/wd/hub/session/${sessionId}/screenshot`;
  const { body } = await requestInterface(options);
  return body;
};

const forwardHistory = async function (sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/forward`;
  const { body } = await requestInterface(options);
  return body;
};

const backHistory = async function (sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/back`;
  const { body } = await requestInterface(options);
  return body;
};

const refreshCurrentPage = async function (sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/refresh`;
  const { body } = await requestInterface(options);
  return body;
};

const resizeWindow = async function (sessionId, rect, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/window/current/size`;
  const { body } = await requestInterface(options, JSON.stringify(rect));
  return body;
};

const getUrl = async function (sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'GET';
  options.path = `/wd/hub/session/${sessionId}/url`;
  const { body: { value } } = await requestInterface(options);
  return value;
};

const clickElement = async function (sessionId, elementId, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/click`;
  const data = await requestInterface(options, JSON.stringify({ button: 0 }));
  return data;
};

const submitElement = async function (sessionId, elementId, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/submit`;
  const data = await requestInterface(options);
  return data;
};

const clearElementText = async function (sessionId, elementId, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/clear`;
  const data = await requestInterface(options);
  return data;
};

const getElementText = async function (sessionId, elementId, options) {
  if (!options) options = baseOptions;
  options.method = 'GET';
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/text`;
  const data = await requestInterface(options);
  return data;
};

const getTitle = async function (sessionId, options) {
  if (!options) options = baseOptions;
  options.method = 'GET';
  options.path = `/wd/hub/session/${sessionId}/title`;
  const { body: { value } } = await requestInterface(options);
  return value;
};

const goToUrl = async function (sessionId, url, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/url`
  const data = await requestInterface(options, JSON.stringify({
    url
  }));
};

const findElement = async function (sessionId, selector, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/element`
  const { body: { value: { ELEMENT } } } = await requestInterface(options, JSON.stringify({
    using: 'css selector', value: selector
  }));
  return ELEMENT;
};

const findElements = async function (sessionId, selector, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/elements`
  const data = await requestInterface(options, JSON.stringify({
    using: 'css selector', value: selector
  }));
  return data;
};

const initSession = async function (data, options) {
  if (!data) data = defaultCapabilities;
  if (!options) options = baseOptions;
  options.method = 'POST';
  const { body: { sessionId } } = await requestInterface(options, data);
  return sessionId;
};

const sendKeys = async function (sessionId, elementId, keysToSend, options) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/element/${elementId}/value`
  if (!Array.isArray(keysToSend)) {
    keysToSend = [keysToSend];
  }
  await requestInterface(options, JSON.stringify({value: keysToSend}));
};

const killSession = async function (sessionId, options) {
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
