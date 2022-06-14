import BaseService from '../BaseService'

export default class ShopFoodService extends BaseService {
  static index(data = {}) {
    const url = '/doc/getOpenFood'
    return this.request({ url, data })
  }

  static check(data = {}) {
    const url = '/inventory/getAvailableFoodRemainQtyByShopID'
    return this.request({ url, data })
  }
}
