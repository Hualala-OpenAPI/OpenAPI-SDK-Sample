import { showToast } from '../Utils'
import { IBatchFoodItem, IOriginGoodsItem, IOriginUnitItem } from '../types/goods'

export default class GoodsPickerController {
  item: IOriginGoodsItem
  batchingFoodJson: IBatchFoodItem[] | number
  isSetFood: number
  units: IOriginUnitItem[]
  tasteGroupList: any[]
  makingMethodGroupList: any[]

  constructor(item: IOriginGoodsItem) {
    this.item = item
    this.batchingFoodJson = item.batchingFoodJson
    this.isSetFood = item.isSetFood
    this.units = item.units
    this.tasteGroupList = item.tasteGroupList
    this.makingMethodGroupList = item.makingMethodGroupList
  }

  // todo 查找第一个有库存的商品规格
  findFirstUnit() {
    const firstUnit = this.units?.find(unitItem => {
      if (unitItem.total && unitItem.total > 0) return unitItem
      return !('total' in unitItem)
    })
    if (firstUnit) return { ...firstUnit }
    return null
  }

  // todo 验证当前选择的内容是否符合加入到购物车内
  //    例如:某些必选项,或数量范围的条件,如果不达标不允许加入购物车
  verifyAdd(sideDish: any[], combo: any, taste: any, make: any) {
    const verifyObject: any = {}
    if (this.batchingFoodJson) {
      verifyObject.sideDish = this.verifySubGoods(sideDish)
      if (!verifyObject.sideDish) return false
    }

    if (this.isSetFood === 1) {
      verifyObject.combo = this.verifyCombo(combo)
      if (!verifyObject.combo) return false
    }

    if (this.tasteGroupList) {
      verifyObject.taste = this.verifySubGoods(taste)
      if (!verifyObject.taste) return false
    }

    if (this.makingMethodGroupList) {
      verifyObject.make = this.verifySubGoods(make)
      if (!verifyObject.make) return false
    }

    const verifyArr = Object.keys(verifyObject)
    if (verifyArr.length) {
      return verifyArr.every(verifyItem => verifyItem)
    }
    return true
  }

  // todo 验证limit相关的模块 配菜,口味,做法
  verifySubGoods(data: any[]) {
    if (!data) return false
    let status = true
    for (let i = 0; i < data.length; i++) {
      if (!this.verifyItemLimit(data[i])) {
        status = false
        break
      }
    }
    return status
  }

  // todo 验证套餐是否符合加入购物车的条件
  verifyCombo(data: any) {
    if (!data) return false
    const { canSwitch = '0', chooseCount, items } = data
    const length = items?.filter((subComboItem: any) => subComboItem.isSelected).length
    if (canSwitch === '1') {
      if (length !== Number(chooseCount)) {
        showToast({ content: `套餐明细最少选择${chooseCount}个`, icon: 'fail' })
        return false
      }
    }
    if (canSwitch === '2' && length < 1) {
      showToast({ content: '套餐明细最少选择1个', icon: 'fail' })
      return false
    }

    let itemsStatus = true
    for (let i = 0; i < items.length; i++) {
      const { make, sideDish, taste } = items[i]

      if (sideDish && !this.verifySubGoods(sideDish)) {
        itemsStatus = false
        break
      }
      if (taste && !this.verifySubGoods(taste)) {
        itemsStatus = false
        break
      }
      if (make && !this.verifySubGoods(make)) {
        itemsStatus = false
        break
      }
    }
    return itemsStatus
  }

  verifyItemLimit(item: any) {
    const { limit, items, groupName, batchingFoodTagName } = item
    const tipName = groupName || batchingFoodTagName
    const maxNum = Number(item.maxNum)
    const minNum = Number(item.minNum)

    if (limit === 'mandatoryLimit' && items.length !== maxNum) {
      showToast({ content: `${tipName}需要选择${maxNum}种`, icon: 'fail' })
      return false
    }

    if (limit === 'rangeLimit' && (items.length < minNum || items.length > maxNum)) {
      showToast({ content: `${tipName}选择范围${minNum}-${maxNum}`, icon: 'fail' })
      return false
    }

    return true
  }
}
