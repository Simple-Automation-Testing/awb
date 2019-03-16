const {walkSync} = require('./utils')
const exec = require('child_process').exec;
const browsers = ['chrome', 'firefox']
const specs = walkSync('./specs')

const runnerConfig = {
  retry: 1,
}

Array.prototype.shuffle = function() {
  const input = this
  for(let i = input.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const itemAtIndex = input[randomIndex]
    input[randomIndex] = input[i]
    input[i] = itemAtIndex
  }
  return input
}

const launcher = (command) => new Promise((res) => {
  const proc = exec(command)
  proc.stdout.on('data', (data) => console.log(data.toString('utf8')))
  proc.stderr.on('data', (data) => console.log(data.toString('utf8')))
  proc.stdin.on('data', (data) => console.log(data.toString('utf8')))
  proc.on('error', (e) => {console.error(e)})
  proc.on('close', (code) => {
    code ? res(proc.spawnargs.find(arg => arg.includes('RUN_BROWSER'))) : res()
  })
})

function shuffled(arr) {
  return arr.reduce((acc, spec) => {
    browsers.forEach(browser => {
      const launcherPromise = launcher(`RUN_BROWSER=${browser} ./node_modules/.bin/protractor  ./protractor.conf.js  --specs ${spec}`)
      acc.push(launcherPromise)
    })
    return acc
  }, []).shuffle()
}

const runLaunchers = async (launchers = []) => {
  if(!launchers.length) return
  const resolvesCmd = async (arrPromises) => (await Promise.all(arrPromises)).filter(cmd => cmd)
  let count = 0

  const retry = async (retryLaunchers = []) => {
    if(count === runnerConfig.retry) return

    const retryList = retryLaunchers.map(rerun => launcher(rerun))
    retryLaunchers = await resolvesCmd(retryList)

    if(!retryLaunchers.length) return

    count++
    await retry(retryLaunchers)
  }

  retry(await resolvesCmd(launchers))
}

runLaunchers(shuffled(specs)).then(console.log)