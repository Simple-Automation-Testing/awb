const defaultChromeCapabilities = {
    desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        platform: 'ANY'
    }
}
const defaultFirefoxCapabilities = {
    desiredCapabilities: {
        browserName: "firefox",
        acceptSslCerts: true,
        shardTestFiles: false,
        javascriptEnabled: true,
        acceptSslCerts: true,
        platform: 'ANY'
    }
}
const baseOptionsStandAlone = {
    hostname: 'localhost',
    port: 4444,
    path: '/wd/hub/session',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 6000
}

const baseOptionsChrome = {
    hostname: 'localhost',
    port: 9515,
    path: '/session',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 6000
}

const baseOptionsFirefox = {
    hostname: 'localhost',
    port: 9516,
    path: '/session',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 6000
}

module.exports = {
    baseOptionsStandAlone,
    baseOptionsChrome,
    baseOptionsFirefox,
    defaultChromeCapabilities,
    defaultFirefoxCapabilities
}