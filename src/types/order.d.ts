export interface IOrderItem {
  foodID: string
  foodName: string
  foodUnit: string
  foodUnitID: string
  isSetFood: number
  isBatching: number
  foodCount: number
  originPrice: string
  takeoutPackagingFee: string
  isDiscount: number
  duePrice: string
  batchNo: string
  remark: string
  SFMUnitCode?: string
  isSFDetail?: number
  promoteTags?: string
  childPromotionTags?: string
}
