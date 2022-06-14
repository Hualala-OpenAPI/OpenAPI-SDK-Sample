// todo api返回的未处理的 - 单个商品的规格数据
export interface IOldUnitItem {
  [key: string]: any
}
// todo api返回的未处理的 - 单个商品数据
export interface IOldGoodsItem {
  [key: string]: any
  units: IOldUnitItem[]
}
// todo 筛选过的源数据
export interface IOriginGoodsItem {
  foodId: string
  foodID: string
  id: string
  name: string
  catalogId: string
  catalogName: string
  isBatching: number
  isActive: boolean
  isOpen: boolean
  batchingFoodJson: IBatchFoodItem[] | number
  isDiscount: number
  takeoutPackagingFee: string
  isSetFood: number
  setFoodDetailJson: any
  tasteGroupList: any
  makingMethodGroupList: any
  units: IOriginUnitItem[]
  minOrderCount: number
  batchingFoodTagID: number
  count?: number
}
// todo 筛选过的源规格数据
export interface IOriginUnitItem {
  id: string
  name: string
  price: number
  count: number
  originPrice: number
  total?: number
}

// todo 配菜Item
export interface IBatchFoodItem {
  maxNum: string
  joinFood: IJoinFoodItem[]
  batchingFoodTagID: string
  noRepeatableSelect: false
  minNum: string
  takeMoney: string
  limit: string
  priceDisable: boolean
  batchingFoodTagName: string
}
export interface IJoinFoodItem {
  foodID: string
  foodName: string
  num: number
}

// todo 过滤后的分类item
export interface IOriginCatalogItem {
  id: string
  name: string
}
// todo foodTagItem
export interface IOldFoodTagItem {
  itemID: string
  isActive: string
  [key: string]: any
}

// todo 添加到购物车的商品
export interface IGoodsItem extends IOriginGoodsItem {
  id: string
  count: number
  price: number
  unit?: any
  isSFDetail?: number
  SFMUnitCode?: string
  promoteTags?: string
  childPromotionTags?: string
  sideDish?: any[]
  taste?: any[]
  make?: any[]
  extraMake?: any[]
  combo?: any
}
