import BaseService from '../BaseService'

export default class ShopService extends BaseService {
  static index(data = {}) {
    const url = '/doc/getAllShop'
    return this.request({ url, data })
  }

  static subject(data = {}) {
    const url = '/doc/getPaySubject'
    return this.request({ url, data })
  }
}
