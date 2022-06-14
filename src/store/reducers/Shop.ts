import { fromJS } from 'immutable'
import { PURGE } from 'redux-persist'
import {
  SHOP_CLEAR_ALL_GOODS,
  SHOP_DELETE_GOODS_ITEM,
  SHOP_SET_GOODS_COUNT,
  SHOP_SET_GOODS_ITEM,
  SHOP_SET_GOODS_TOTAL_PRICE
} from '../Constants'
import { IAction } from '../../types/store'

const defaultState: any = fromJS({
  goodsList: [], // 当前在购物车的商品
  goodsCount: 0, // 购物车数量
  goodsTotalPrice: 0 // 购物车总价格
})
export default (state = defaultState, action: IAction) => {
  const { type, payload } = action
  switch (type) {
    case SHOP_SET_GOODS_ITEM:
      return state.setIn(['goodsList', payload.index], payload.item)
    case SHOP_SET_GOODS_COUNT:
      return state.set('goodsCount', payload)
    case SHOP_SET_GOODS_TOTAL_PRICE:
      return state.set('goodsTotalPrice', payload)
    case SHOP_DELETE_GOODS_ITEM:
      return state.set('goodsList', state.get('goodsList').delete(payload))
    case SHOP_CLEAR_ALL_GOODS:
      return state.set('goodsList', fromJS([]))
    case PURGE:
      return defaultState
    default:
      return state
  }
}
