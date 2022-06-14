import moment from 'moment'
import { fromJS } from 'immutable'
import Config from '../Config'
import store from '../store'
import { IGoodsItem } from '../types/goods'
import { IOrderItem } from '../types/order'

export default class OrderController {
  static getDefaultParams() {
    const { peopleNum, dineWay, orderTime, username, telephone } = store.getState().common.get('moduleConfig').toJS()
    const shopInfo = store.getState().common.get('shopInfo').toJS()
    return fromJS({
      isCheackOut: 0,
      isThirdPay: 2,
      bankCode: 'weChat',
      isSentMsg: 0,
      groupID: Config.info.groupId,
      shopID: shopInfo.shopID,
      msgType: dineWay === 1 ? 121 : 120,
      order: {
        orderSubType: dineWay === 1 ? 21 : 20,
        orderStatus: 15,
        discountTotalAmount: '0.00',
        longitude: shopInfo.mapLongitudeValueBaiDu,
        latitude: shopInfo.mapLatitudeValueBaiDu,
        dinners: peopleNum,
        orderTime: moment(orderTime || undefined).format('yyyyMMDDHHmm'),
        takeoutRemark: 'SDK-Demo外卖备注',
        orderItem: [] as IOrderItem[],
        deliveryAmount: '0',
        serviceAmount: '0',
        channelKey: '399_weixin',
        isAlreadyPaid: '0',
        orderMode: 1,
        orderExtraInfo: {
          coordinateName: 1
        },
        userInfo: {
          userName: username,
          userMobile: telephone
        }
      }
    }).toJS()
  }

  // todo 过滤订单item
  static filterOrderItem(item: IGoodsItem): IOrderItem {
    const defaultItem: IOrderItem = {
      foodID: item.foodId,
      foodName: item.name,
      foodUnit: item.unit.name,
      foodUnitID: item.unit.id,
      isSetFood: item.isSetFood,
      isBatching: item.isBatching,
      foodCount: item.count,
      originPrice: String(item.unit.originPrice),
      takeoutPackagingFee: item.takeoutPackagingFee,
      isDiscount: item.isDiscount,
      duePrice: String(item.unit.price),
      batchNo: '1',
      remark: ''
    }
    if ('SFMUnitCode' in item) defaultItem.SFMUnitCode = item.SFMUnitCode
    if ('isSFDetail' in item) defaultItem.isSFDetail = item.isSFDetail
    if ('promoteTags' in item) defaultItem.promoteTags = item.promoteTags
    if ('childPromotionTags' in item) defaultItem.childPromotionTags = item.childPromotionTags
    if ('taste' in item) {
      const tasteRemark = this.filterRemark('口味:', item.taste)
      if (tasteRemark) defaultItem.remark += tasteRemark
    }
    if ('make' in item) {
      const makeRemark = this.filterRemark('做法:', item.make)
      if (makeRemark) defaultItem.remark += makeRemark
    }
    return defaultItem
  }

  // todo 将购物车商品放到订单数据中
  static setGoodsToOrderParams(goods: IGoodsItem[]) {
    const params: any = this.getDefaultParams()
    const { dineWay, address } = store.getState().common.get('moduleConfig').toJS()
    // todo 如果是配送的话 需要填写收货地址
    if (dineWay === 2) {
      params.order.takeoutAddress = address
    }
    goods.map(goodsItem => {
      params.order.orderItem.push(this.filterOrderItem(goodsItem))

      if ('combo' in goodsItem) {
        goodsItem.combo.items.map((comboItem: any) => {
          params.order.orderItem.push(this.filterOrderItem(this.filterComboItem(comboItem, goodsItem.count)))

          if ('sideDish' in comboItem) {
            this.filterSideDish(comboItem.sideDish, params.order.orderItem, goodsItem.count)
          }
          if ('extraMake' in comboItem) {
            this.filterExtraMake(comboItem.extraMake, params.order.orderItem, goodsItem.count)
          }
        })
      }
      if ('sideDish' in goodsItem) {
        this.filterSideDish(goodsItem.sideDish, params.order.orderItem, goodsItem.count)
      }
      if ('extraMake' in goodsItem) {
        this.filterExtraMake(goodsItem.extraMake, params.order.orderItem, goodsItem.count)
      }
    })
    return params
  }

  static filterComboItem(item: any, parentCount: number) {
    return {
      ...item,
      foodId: item.foodID,
      name: item.foodName,
      unit: {
        id: item.unitKey,
        name: item.unit,
        price: item.addPrice, // 套餐明细的价格默认为0 如果有加价按加价算
        originPrice: item.price
      },
      count: parentCount,
      takeoutPackagingFee: '0.00',
      isDiscount: 0
    }
  }

  static filterSideDish(data: any[] | undefined, orderItem: any, parentCount: number) {
    if (!data || !data.length) return false
    data.map(item => {
      item.items?.map((subItem: any) => {
        orderItem.push(this.filterOrderItem({ ...subItem, count: parentCount }))
      })
    })
  }

  static filterExtraMake(data: any[] | undefined, orderItem: any, parentCount: number) {
    if (!data || !data.length) return false
    data.map(item => {
      orderItem.push(
        this.filterOrderItem({
          ...item,
          foodId: -1,
          unit: {
            id: -1,
            name: item.unit,
            price: item.price,
            originPrice: item.price
          },
          isSetFood: 0,
          isSFDetail: 0,
          isBatching: item.isBatching,
          count: item.addPriceType === 2 ? parentCount : item.count,
          takeoutPackagingFee: '0.00',
          isDiscount: 0
        })
      )
    })
  }

  static filterRemark(prefixText: string, data: any[] | undefined) {
    let text = `${prefixText}`
    const arr: any[] = []
    if (data) {
      data.map(item => {
        item.items.map((subItem: any) => {
          arr.push(subItem.notesName)
        })
      })
    }
    if (arr.length) {
      arr.map((arrItem, arrIndex) => {
        text += arrItem
        text += arrIndex !== arr.length - 1 ? ',' : ';'
      })
    } else {
      return false
    }
    return text
  }
}
