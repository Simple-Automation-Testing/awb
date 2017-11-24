const {
  resizeWindow,
  killSession,
  initSession,
  findElements,
  findElement,
  goToUrl,
  getUrl,
  getTitle,
  clickElement,
  sendKeys,
  executeScript,
  syncWithDOM
} = require('./core');

const test = async () => {
  const { sessionId } = await initSession()
  await goToUrl(sessionId, 'https://weblium.com')
  await syncWithDOM(sessionId, 50000)
  await executeScript(sessionId, 'return document.body.innerHTML')
  // const dataRes = await resizeWindow(sessionId, { width: 1200, height: 900 });
  // const getStaerted = await findElement(sessionId, '[title="Get started"]');
  // const data = await findElements(sessionId, 'a');
  // const data1 = await getUrl(sessionId);
  // const data2 = await getTitle(sessionId);
  // await clickElement(sessionId, getStaerted)
  // const loginTab = await findElement(sessionId, '.tabs__link:nth-child(1)');
  // await clickElement(sessionId, loginTab);
  // const emailInput = await findElement(sessionId, '#id5');
  // const passwordInput = await findElement(sessionId, '#id9');
  // await sendKeys(sessionId, emailInput, 'test_d@weblium.com');
  // await sendKeys(sessionId, passwordInput, 'password');
  await killSession(sessionId)
}


try {
  test();
} catch (e) {
  console.error(e)
}