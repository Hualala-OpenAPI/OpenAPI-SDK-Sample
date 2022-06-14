import { fromJS } from 'immutable'
import {
  COMMON_SET_FOOD_TAGS,
  COMMON_SET_GOODS_CATALOG,
  COMMON_SET_MODULE_CONFIG,
  COMMON_SET_ORDER_INFO,
  COMMON_SET_ORDER_STATUS,
  COMMON_SET_ORIGIN_GOODS_LIST,
  COMMON_SET_PAYMENT_STATUS,
  COMMON_SET_SHOP_INFO
} from '../Constants'
import Config from '../../Config'
import { Dispatch } from 'redux'
import OriginGoodsController from '../../controllers/OriginGoodsController'
import { IOldFoodTagItem, IOldGoodsItem, IOriginCatalogItem, IOriginGoodsItem, IOriginUnitItem } from '../../types/goods'
import { IModuleConfig, IOrderInfo } from '../../types/store/common'
import { IShopItem } from '../../types/views/shop'
import ShopFoodService from '../../services/shop/ShopFoodService'

const setFoodTags = function (items: IOldFoodTagItem[]) {
  return {
    type: COMMON_SET_FOOD_TAGS,
    payload: items
  }
}
const setGoodsCatalog = function (items: IOriginCatalogItem[]) {
  return {
    type: COMMON_SET_GOODS_CATALOG,
    payload: items
  }
}
const setOriginGoodsList = function (items: IOriginGoodsItem[]) {
  return {
    type: COMMON_SET_ORIGIN_GOODS_LIST,
    payload: items
  }
}

export function setModuleConfig(config: IModuleConfig) {
  return {
    type: COMMON_SET_MODULE_CONFIG,
    payload: config
  }
}

export function setPaymentStatus(status: number) {
  return {
    type: COMMON_SET_PAYMENT_STATUS,
    payload: status
  }
}

export const setOrderStatus = (status: number) => {
  return {
    type: COMMON_SET_ORDER_STATUS,
    payload: status
  }
}
export const setShopInfo = (info: IShopItem) => {
  return {
    type: COMMON_SET_SHOP_INFO,
    payload: info
  }
}

export const setOrderInfo = (info: IOrderInfo) => {
  return {
    type: COMMON_SET_ORDER_INFO,
    payload: info
  }
}
function checkGoods(goodsList: IOriginGoodsItem[], params: { groupID: string | undefined; shopID: string }) {
  return new Promise(resolve => {
    ShopFoodService.check(params).then(res => {
      const { code, data } = res
      if (code !== '000') resolve(goodsList)
      if (!data.foodRemainInfo) resolve(goodsList)
      const list: any = fromJS(goodsList).toJS() || []
      data?.foodRemainInfo?.map((remainItem: any) => {
        const goodsIndex = list.findIndex((goodsItem: IOriginGoodsItem) => goodsItem?.name === remainItem.foodName)
        const goodsItem: any = goodsIndex >= 0 ? fromJS(list[goodsIndex]).toJS() : {}
        goodsItem.units = goodsItem?.units?.map((unitItem: IOriginUnitItem) => {
          if (unitItem.id === remainItem.unitkey) {
            return {
              ...unitItem,
              total: Number(remainItem.amount)
            }
          }
          return unitItem
        })
        list[goodsIndex] = goodsItem
      })
      resolve(list)
    })
  })
}

export function getGoodsList() {
  return (dispatch: Dispatch, state: any) => {
    const { groupId: groupID } = Config.info
    const shopID = state().common.getIn(['shopInfo', 'shopID'])
    const params = { groupID, shopID }
    ShopFoodService.index(params).then(res => {
      const { code, data } = res
      const catalogItems: IOriginCatalogItem[] = []
      if (code !== '000') return false
      const footList: IOriginGoodsItem[] = data.foodList.map((item: IOldGoodsItem) => {
        if (!catalogItems.some(catalogItem => catalogItem.id === item.foodCategoryID)) {
          catalogItems.push(OriginGoodsController.filterCatalog(item))
        }
        return OriginGoodsController.filterItem(item)
      })
      checkGoods(footList, params).then((goodsList: any) => {
        dispatch(setFoodTags(data.foodTags))
        dispatch(setOriginGoodsList(goodsList))
        dispatch(setGoodsCatalog(catalogItems))
      })
    })
  }
}
