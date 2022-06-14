import { Moment } from 'moment'

export interface IModuleConfig {
  peopleNum: number
  dineWay: number
  orderTime?: Moment
  username?: string
  telephone?: string
  address?: string
}

export interface IOrderInfo {
  orderKey: string
  dueTotalAmount: string
  [key: string]: any
}
