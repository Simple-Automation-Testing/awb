enum Methods {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

interface Opts {
  headers?: {
    'Content-Type'?: string
    'Authorization'?: string
    'Content-Length'?: string
  }
}


export declare function fetchy(method: Methods, timeout: number, url: string, body: object | string, opts: Opts): Promise
