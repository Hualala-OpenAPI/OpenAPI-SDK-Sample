import { fromJS } from 'immutable'
import {
  SHOP_SET_GOODS_ITEM,
  SHOP_SET_GOODS_COUNT,
  SHOP_DELETE_GOODS_ITEM,
  SHOP_CLEAR_ALL_GOODS,
  SHOP_SET_GOODS_TOTAL_PRICE
} from '../Constants'
import { filterAmount } from '../../Utils'
import GoodsController from '../../controllers/GoodsController'
import { Dispatch } from 'redux'

const delItemByIndex = function (index: number) {
  return {
    type: SHOP_DELETE_GOODS_ITEM,
    payload: index
  }
}
const setGoodsItem = function (item: any) {
  return {
    type: SHOP_SET_GOODS_ITEM,
    payload: item
  }
}

const setGoodsCount = function (total: number) {
  return {
    type: SHOP_SET_GOODS_COUNT,
    payload: total
  }
}

const setGoodsTotalPrice = function (totalPrice: number) {
  return {
    type: SHOP_SET_GOODS_TOTAL_PRICE,
    payload: totalPrice
  }
}
const clearGoodsList = function () {
  return {
    type: SHOP_CLEAR_ALL_GOODS
  }
}
const changeGoodsInfo = ({ item, total, totalPrice, dispatch, clear = false }: any) => {
  if (item) {
    const { type, index } = item
    type === 'add' && dispatch(setGoodsItem(item))
    type === 'subtract' && dispatch(delItemByIndex(index))
  }
  if (total >= 0) dispatch(setGoodsCount(total))
  if (totalPrice >= 0) dispatch(setGoodsTotalPrice(totalPrice))
  // 清空所有
  clear && dispatch(clearGoodsList())
}

export const addGoodsItem = (item: any, num = item?.count, type?: string) => {
  return (dispatch: Dispatch, state: any) => {
    const { price, combo } = item
    const goodsList = state().shop.get('goodsList').toJS()
    const curItem: any = fromJS(item).toJS()
    const index = type === 'cart' ? GoodsController.findGoodsIndexById(item.id, goodsList) : GoodsController.findGoodsIndex(item, goodsList)
    if (index >= 0) {
      // todo 存在的话更新数量
      curItem.count = goodsList[index].count + num
    }
    let extraPrice = 0
    // 计算做法的价格
    if (combo) {
      combo.items.map((comboItem: any) => {
        extraPrice += GoodsController.getExtraMakePrice(comboItem.extraMake, index, num)
      })
    } else {
      extraPrice = GoodsController.getExtraMakePrice(curItem.extraMake, index, num)
    }
    const newTotal = state().shop.get('goodsCount') + num
    const oldTotalPrice = state().shop.get('goodsTotalPrice')
    const newTotalPrice = filterAmount(oldTotalPrice + price * num + extraPrice)
    changeGoodsInfo({
      item: {
        type: 'add',
        index: index >= 0 ? index : goodsList.length,
        item: curItem
      },
      total: newTotal,
      totalPrice: newTotalPrice,
      dispatch
    })
  }
}
export const subtractGoodsItem = (item: any) => {
  return (dispatch: Dispatch, state: any) => {
    const goodsList = state().shop.get('goodsList')
    const oldTotalPrice = state().shop.get('goodsTotalPrice')
    const index = GoodsController.findGoodsIndex(item, goodsList)
    const oldItem = goodsList.get(index)
    const { minOrderCount, price } = oldItem
    oldItem.count -= minOrderCount

    let extraPrice = 0
    // 计算做法的价格
    if (oldItem.combo) {
      oldItem.combo.items.map((comboItem: any) => {
        extraPrice += GoodsController.getExtraMakePrice(comboItem.extraMake, oldItem.count <= 0 ? -1 : 1, minOrderCount)
      })
    } else {
      extraPrice = GoodsController.getExtraMakePrice(oldItem.extraMake, oldItem.count <= 0 ? -1 : 1, minOrderCount)
    }
    const newTotal = state().shop.get('goodsCount') - minOrderCount
    const newTotalPrice = filterAmount(oldTotalPrice - price - extraPrice)
    changeGoodsInfo({
      item: {
        type: oldItem.count > 0 ? 'add' : 'subtract',
        index,
        item: oldItem
      },
      total: newTotal,
      totalPrice: newTotalPrice,
      dispatch
    })
  }
}

export function clearGoods() {
  return (dispatch: Dispatch) => {
    changeGoodsInfo({ clear: true, total: 0, totalPrice: 0, dispatch })
  }
}
