interface BrowserCaps {
  javascriptEnabled?: boolean
  acceptSslCerts?: boolean
  platform?: string
  browserName?: string
}

export interface Config {
  withStandalone?: boolean, // if true will run selenium standalone server when call start startDriver(), default true
  remote?: boolean, // if remote true startDriver() will not work, default false
  directConnect?: boolean, // if directConnect true directConnect() will run gecko or chrome driver without selenium standalone server, default false
  host?: string, // host, default 'localhost' or '127.0.0.1' or '0.0.0.0'
  port?: string | number, // port on what will be runned browser driver 
  desiredCapabilities?: BrowserCaps
  timeout?: number// time what will wait response from d
}