import { Config } from './config'
import { ElementAWB } from './element'

interface SessionLocalStorage {
  get: (key: string) => Promise<string>
  set: (key: string, value: string) => Promise<any>
  clear: () => Promise<any>
  getAll: () => Promise<object>
}


interface Alert {
  accept: () => Promise<void>
  dismiss: () => Promise<void>
  getText: () => Promise<string>
  sendKeys: (text: string) => Promise<void>
}

declare class Client {
  constructor()

  sessionStorage: SessionLocalStorage
  localStorage: SessionLocalStorage
  alert: Alert

  getSize(): Promise<{ height: number, width: number }>
  refresh(): Promise<any>
  back(): Promise<any>
  forward(): Promise<any>
  takeScreenshot(): Promise<string>
  waitForUrlIncludes(): Promise<void>
  waitForTitleInclude(): Promise<void>
  resizeWindow(width: number, height: number): Promise<any>
  startDriver(): Promise<any>
  stopDriver(): Promise<any>
  switchToFrame(element: ElementAWB): Promise<any>
  getSession(): Promise<any>
  closeCurrentTab(): Promise<any>
  executeScript(script: string | any, funcArgs?: any): Promise<any>
  executeScriptAsync(script: string | any, funcArgs?: any): Promise<any>
  getUrl(): Promise<string>
  sleep(time?: number): Promise<any>
  getTitle(): Promise<string>
  goTo(url: string): Promise<any>
  getBrowserTabs(): Promise<Array<string>>
  getCurrentBrowserTab(): Promise<string>
  switchToTab(index: number): Promise<any>
  switchBack(): Promise<any>
  close(): Promise<any>
}
