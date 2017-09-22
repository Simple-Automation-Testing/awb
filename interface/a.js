":" //; exec /usr/bin/env node --harmony --expose-gc --trace-deprecation "$0" "$@"

const { requestInterface } = require('./util')

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

const resizeWindow = async function (options, sessionId, rect) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/window/current/size`
  console.log(rect)
  const body = await requestInterface(options, JSON.stringify(rect));
  return body
}


const getUrl = async function (options, sessionId) {
  if (!options) options = baseOptions;
  options.method = 'GET';
  options.path = `/wd/hub/session/${sessionId}/url`
  const { value } = await requestInterface(options);
  return value;
};


const clickElement = async function (options, sessionId, elementId) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/session/${sessionId}/element/${elementId}/click`
  const data = await requestInterface(options, JSON.stringify({button: 0}));
  console.log(data)
};


const getTitle = async function (options, sessionId) {
  if (!options) options = baseOptions;
  options.method = 'GET';
  options.path = `/wd/hub/session/${sessionId}/title`
  const { value } = await requestInterface(options);
  return value;
};


const goToUrl = async function (options, sessionId, url) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/url`
  const data = await requestInterface(options, JSON.stringify({
    url
  }));
};

const findElement = async function (options, sessionId, selector) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/element`
  const { value: { ELEMENT } } = await requestInterface(options, JSON.stringify({
    using: 'css selector', value: selector
  }));
  return ELEMENT;
};

const findElements = async function (options, sessionId, selector) {
  if (!options) options = baseOptions;
  options.method = 'POST';
  options.path = `/wd/hub/session/${sessionId}/elements`
  const data = await requestInterface(options, JSON.stringify({
    using: 'css selector', value: selector
  }));
  return data;
};

const initSession = async function (options, data) {
  if (!data) data = defaultCapabilities;
  if (!options) options = baseOptions;
  options.method = 'POST';
  const { sessionId } = await requestInterface(options, data);
  return sessionId;
};

const killSession = async function (options, sessionId) {
  if (!options) options = baseOptions;
  options.method = 'DELETE';
  options.path = `/wd/hub/session/${sessionId}`;
  await requestInterface(options);
};

const test = async () => {
  const sessionId = await initSession(undefined)
  await goToUrl(undefined, sessionId, 'https://weblium.com');
  const dataRes = await resizeWindow(undefined, sessionId, { width: 1200, height: 900 })
  console.log(dataRes)
  const elementId = await findElement(undefined, sessionId, '[title="Get started"]');
  const data = await findElements(undefined, sessionId, 'a');
  const data1 = await getUrl(undefined, sessionId);
  const data2 = await getTitle(undefined, sessionId);
  await clickElement(undefined, sessionId, elementId)
  // await killSession(undefined, sessionId);
};


try {
  test();
} catch (e) {
  console.error(e)
}
