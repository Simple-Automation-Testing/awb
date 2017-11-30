#!/usr/bin/env node

const { getChromeDriver, writeId, killProc, getStandalone, clearChrome, clearStandalone, spawnStandalone } = require('../macOSinstaller')
// wd install

const args = process.argv.slice(2)

try {
  if (args.includes('chrome') && args.includes('standalone')) {
    getChromeDriver('2.33').then(getStandalone)
  } else if (args.includes('chrome')) {
    getChromeDriver('2.33')
  } else if (args.includes('start') && args.includes('standalone')) {
    spawnStandalone().then(writeId)
  } else if (args.includes('standalone')) {
    getStandalone()
  } else if (args.includes('clear') && args.includes('all')) {
    clearChrome('2.33').then(clearStandalone)
  } else if (args.includes('killsession')) {
    killProc()
  }
} catch (error) {
  console.error(error.toString())
}