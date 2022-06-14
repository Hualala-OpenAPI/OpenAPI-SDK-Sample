import { Method } from 'axios'

export interface IRequest {
  url: string
  method?: Method | undefined
  isProxy?: boolean
  params?: any
  data?: any
}

export interface IResponse {
  code: string
  message: string
  data: any
}
