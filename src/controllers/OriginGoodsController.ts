import { fromJS } from 'immutable'
import { parseJson } from '../Utils'
import store from '../store'
import { IOriginGoodsItem, IOldGoodsItem, IOldUnitItem } from '../types/goods'

export default class OriginGoodsController {
  // todo 过滤基础商品数据
  static filterItem(item: IOldGoodsItem): IOriginGoodsItem {
    const units = item.units.map(unitItem => this.filterUnit(unitItem))
    return {
      foodId: item.foodID,
      foodID: item.foodID,
      id: item.foodID,
      name: item.foodName,
      catalogId: item.foodCategoryID,
      catalogName: item.foodCategoryName,
      isBatching: 0, // 普通菜
      isActive: item.isActive === 'true', // 是否启动
      isOpen: item.isOpen === 'true', // 是否上架
      batchingFoodJson: typeof item.batchingFoodJson === 'string' ? parseJson(item.batchingFoodJson) : item.batchingFoodJson, // 配菜信息json
      isDiscount: item.isDiscount === 'true' ? 1 : 0, // 是否打折
      takeoutPackagingFee: item.takeoutPackagingFee, // 打包费
      isSetFood: item.isSetFood === 'true' ? 1 : 0, // 是否是套餐
      setFoodDetailJson: this.filterCombo(item.setFoodDetailJson), // 套餐明细
      tasteGroupList: parseJson(item.tasteGroupList), // 口味
      makingMethodGroupList: parseJson(item.makingMethodGroupList), // 做法
      units, // 规格数组
      minOrderCount: Number(item.minOrderCount) || 1, // 起售份数
      batchingFoodTagID: Number(item.batchingFoodTagID) // 配料标签ID
    }
  }

  // 过滤单位
  static filterUnit(item: IOldUnitItem) {
    return {
      id: item.unitKey,
      name: item.unit,
      price: Number(item.price),
      count: 0,
      originPrice: Number(item.originalPrice)
    }
  }

  // 过滤分类
  static filterCatalog(item: IOldGoodsItem) {
    return {
      id: item.foodCategoryID,
      name: item.foodCategoryName
    }
  }

  // 过滤初始的套餐
  static filterCombo(json: any) {
    const newJson = parseJson(json)
    if (newJson) {
      const combo: any = fromJS(newJson).toJS()
      combo.foodLst = combo.foodLst.map((item: any) => {
        return {
          ...item,
          items: item.items.map((subItem: any) => this.filterSubComboItem(subItem))
        }
      })
      return combo
    }
    return null
  }

  static filterSubComboItem(item: any) {
    return fromJS({
      ...item,
      isBatching: 0,
      isSetFood: 1,
      isSFDetail: 1,
      isSelected: item.selected === '1',
      sideDish: [],
      taste: [],
      make: []
    }).toJS()
  }

  // todo 根据batchingFoodTagID获取相应的配菜列表
  static getSideDishByFoodTagId(foodTagId: string) {
    const originGoodsList = store.getState().common.get('originGoodsList')
    const foodTags = store.getState().common.get('foodTags')
    const tagItem = foodTags?.find((tagItem: any) => tagItem.get('itemID') === foodTagId && tagItem.get('isActive') === 'true')
    const subGoodsArr = tagItem?.get('foodIDs').split(',') || []
    const sideDishList: any[] = []
    subGoodsArr?.map((subGoodsItem: any) => {
      const tempSubGoodsItem = originGoodsList?.find((goodsItem: any) => goodsItem.get('id') === subGoodsItem)
      if (tempSubGoodsItem) sideDishList.push(tempSubGoodsItem?.toJS())
    })
    return sideDishList
  }

  // todo 根据itemId获取源数据item
  static getItemById(itemId: string) {
    const originGoodsList = store.getState().common.get('originGoodsList')
    return originGoodsList?.find((item: any) => item.get('id') === itemId)?.toJS()
  }
}
