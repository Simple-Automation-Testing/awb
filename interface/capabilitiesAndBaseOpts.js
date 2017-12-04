const defaultCapabilities = JSON.stringify({
    desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        platform: 'ANY'
    }
})

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

module.exports = {
    baseOptionsStandAlone,
    baseOptionsChrome,
    defaultCapabilities
}