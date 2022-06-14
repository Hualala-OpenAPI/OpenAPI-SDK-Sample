import BaseService from '../BaseService'

export default class OrderService extends BaseService {
  static show(data = {}) {
    const url = '/order/query'
    return this.request({ url, data })
  }

  static create(data = {}) {
    const url = '/order/createOrder'
    return this.request({ url, data })
  }

  static payment(data = {}) {
    const url = '/order/payout'
    return this.request({ url, data })
  }

  static fastRefund(data = {}) {
    const url = '/order/updateOrderStatus'
    return this.request({ url, data })
  }

  static exchangeFood(data = {}) {
    const url = '/order/returnFood'
    return this.request({ url, data })
  }

  static confirm(data = {}) {
    const url = '/order/confirmWechatOrder'
    return this.request({ url, data })
  }
}
