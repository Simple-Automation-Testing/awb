const defaultCapabilities = JSON.stringify({
    desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        platform: 'ANY'
    }
})

const baseOptions = {
    hostname: 'localhost',
    port: 9515,
    path: '/wd/hub/session',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 6000
}

module.exports = {
    baseOptions,
    defaultCapabilities
}