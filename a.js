function spawnStandalone() {
  const stPath = 'C:/Users/IEUser/Downloads/selenium-server-standalone-3.11.0.jar'
  const iePath = 'C:/Users/IEUser/Downloads/IEDriverServer.exe'
  return new Promise((resolve, reject) => {
    try {
      const nodeProc = spawn('java', [
        `-Dwebdriver.ie.driver=${iePath}`,
        '-jar',
        `${stPath}`,
        '-port',
        '10259'
      ], {
          stdio: ['pipe', process.stdout, process.stderr]
        })
      resolve(nodeProc)
    } catch (error) {
      console.error(error.toString())
    }
  })
}