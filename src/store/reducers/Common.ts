import { fromJS } from 'immutable'
import {
  COMMON_SET_FOOD_TAGS,
  COMMON_SET_GOODS_CATALOG,
  COMMON_SET_MODULE_CONFIG,
  COMMON_SET_ORDER_STATUS,
  COMMON_SET_ORIGIN_GOODS_LIST,
  COMMON_SET_PAYMENT_STATUS,
  COMMON_SET_SHOP_INFO,
  COMMON_SET_ORDER_INFO
} from '../Constants'
import { IAction } from '../../types/store'
import { ORDER_STATUS, PAYMENT_STATUS } from '../../CONSTANT'
import { PURGE } from 'redux-persist'

const defaultState: any = fromJS({
  moduleConfig: {},
  shopInfo: {},
  orderInfo: {},
  orderStatus: ORDER_STATUS.NORMAL,
  paymentStatus: PAYMENT_STATUS.UNPAID,
  originGoodsList: [],
  foodTags: [],
  goodsCatalog: [] // 商品分类
})

export default (state = defaultState, action: IAction) => {
  const { type, payload } = action
  switch (type) {
    case COMMON_SET_MODULE_CONFIG:
      return state.set('moduleConfig', fromJS(payload))
    case COMMON_SET_PAYMENT_STATUS:
      return state.set('paymentStatus', payload)
    case COMMON_SET_ORDER_STATUS:
      return state.set('orderStatus', payload)
    case COMMON_SET_FOOD_TAGS:
      return state.set('foodTags', fromJS(payload))
    case COMMON_SET_ORIGIN_GOODS_LIST:
      return state.set('originGoodsList', fromJS(payload))
    case COMMON_SET_GOODS_CATALOG:
      return state.set('goodsCatalog', fromJS(payload))
    case COMMON_SET_SHOP_INFO:
      return state.set('shopInfo', fromJS(payload))
    case COMMON_SET_ORDER_INFO:
      return state.set('orderInfo', fromJS(payload))
    case PURGE:
      return defaultState
    default:
      return state
  }
}
