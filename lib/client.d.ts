import { Config } from './config'

interface SessionLocalStorage {
  get: (key: string) => Promise<string>
  set: (key: string, value: string) => Promise<any>
  clear: () => Promise<any>
  getAll: () => Promise<object>
}

declare class Client {
  constructor()

  sessionStorage: SessionLocalStorage
  localStorage: SessionLocalStorage

  getSize(): Promise<{ height: number, width: number }>
  refresh(): Promise<any>
  back(): Promise<any>
  forward(): Promise<any>
  takeScreenshot(): Promise<string>
  waitForUrlIncludes(): Promise<any>
  resizeWindow(): Promise<any>
  startDriver(): Promise<any>
  stopDriver(): Promise<any>
  switchToFrame(): Promise<any>
  getSession(): Promise<any>
  closeCurrentTab(): Promise<any>
  executeScript(): Promise<any>
  executeScriptAsync(): Promise<any>
  getUrl(): Promise<string>
  sleep(): Promise<any>
  getTitle(): Promise<string>
  goTo(url: string): Promise<any>
  getBrowserTabs(): Promise<Array<string>>
  getCurrentBrowserTab(): Promise<string>
  switchToTab(index: number): Promise<any>
  closeBrowser(): Promise<any>
}
