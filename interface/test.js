const  {
  resizeWindow,
  killSession,
  initSession,
  findElements,
  findElement,
  goToUrl,
  getUrl,
  getTitle,
  clickElement
} = require('./core')


const test = async () => {
  const sessionId = await initSession(undefined)
  await goToUrl(undefined, sessionId, 'https://weblium.com');
  const dataRes = await resizeWindow(undefined, sessionId, { width: 1200, height: 900 })
  const elementId = await findElement(undefined, sessionId, '[title="Get started"]');
  const data = await findElements(undefined, sessionId, 'a');
  const data1 = await getUrl(undefined, sessionId);
  const data2 = await getTitle(undefined, sessionId);
  await clickElement(undefined, sessionId, elementId)
  await killSession(undefined, sessionId);
};


try {
  test();
} catch (e) {
  console.error(e)
}