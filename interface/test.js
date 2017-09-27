const  {
  resizeWindow,
  killSession,
  initSession,
  findElements,
  findElement,
  goToUrl,
  getUrl,
  getTitle,
  clickElement,
  sendKeys
} = require('./core')

const test = async () => {
  const sessionId = await initSession(undefined);
  await goToUrl(undefined, sessionId, 'https://weblium.com');
  const dataRes = await resizeWindow(undefined, sessionId, { width: 1200, height: 900 });
  const getStaerted = await findElement(undefined, sessionId, '[title="Get started"]');
  const data = await findElements(undefined, sessionId, 'a');
  const data1 = await getUrl(undefined, sessionId);
  const data2 = await getTitle(undefined, sessionId);
  await clickElement(undefined, sessionId, getStaerted)
  const loginTab = await findElement(undefined, sessionId, '.tabs__link:nth-child(1)');
  await clickElement(undefined, sessionId, loginTab)
  const emailInput = await findElement(undefined, sessionId, '#id5');
  const passwordInput = await findElement(undefined, sessionId, '#id9');
  await sendKeys(undefined, sessionId, emailInput, 'test_d@weblium.com');
  await sendKeys(undefined, sessionId, passwordInput, 'password');
  
};


try {
  test();
} catch (e) {
  console.error(e)
}