let timeout = 12000

const defaultChromeCapabilities = {
    desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        platform: 'ANY'
    }
}

const defaultSafariCapabilities = {
    desiredCapabilities: {
        browserName: 'safari',
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
    timeout
}

const baseOptionsChrome = {
    hostname: 'localhost',
    port: 9515,
    path: '/session',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout
}

const baseOptionsFirefox = {
    hostname: 'localhost',
    port: 9516,
    path: '/session',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout
}

module.exports = {
    timeout,
    baseOptionsStandAlone,
    baseOptionsChrome,
    baseOptionsFirefox,

    defaultSafariCapabilities,
    defaultChromeCapabilities,
    defaultFirefoxCapabilities
}