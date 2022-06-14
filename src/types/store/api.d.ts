export interface IApiItem {
  url: string | undefined
  params: {
    [key: string]: any
  }
  result: {
    [key: string]: any
  }
}
