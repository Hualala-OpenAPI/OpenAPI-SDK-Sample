import moment from "moment";
import {fromJS} from "immutable";
import Config from "../Config";
import store from "../store";
import EnumController from "./EnumController";

export default class OrderController {
  static getDefaultParams() {
    const paymentType = store.getState().common.getIn(["moduleConfig", "paymentType"]);
    const peopleNum = store.getState().common.getIn(["moduleConfig", "peopleNum"]);
    const {NOW} = EnumController.PAYMENT_TYPE();
    return fromJS({
      isCheackOut: 0,
      isThirdPay: 2,
      bankCode: "weChat",
      isSentMsg: paymentType === NOW ? 0 : 1,
      groupID: Config.info.groupId,
      shopID: Config.info.shopId,
      msgType: "240",
      order: {
        orderSubType: 41,
        orderStatus: 15,
        discountTotalAmount: "0.00",
        tableName: Config.info.tableName,
        dinners: peopleNum,
        orderTime: moment().format("yyyyMMDDHHmm"),
        orderItem: [],
        deliveryAmount: "0",
        serviceAmount: "0",
        channelKey: "399_weixin",
        isAlreadyPaid: "0",
        orderMode: paymentType === NOW ? "1" : "2"
      }
    }).toJS();
  }

  // todo 过滤订单item
  static filterOrderItem(item) {
    const defaultItem = {
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
      batchNo: "1",
      remark: ""
    };
    if (item.hasOwnProperty("SFMUnitCode")) defaultItem.SFMUnitCode = item.SFMUnitCode;
    if (item.hasOwnProperty("isSFDetail")) defaultItem.isSFDetail = item.isSFDetail;
    if (item.hasOwnProperty("promoteTags")) defaultItem.promoteTags = item.promoteTags;
    if (item.hasOwnProperty("childPromotionTags")) defaultItem.childPromotionTags = item.childPromotionTags;
    if (item.hasOwnProperty("taste")) {
      const tasteRemark = this.filterRemark("口味:", item.taste);
      if (tasteRemark) defaultItem.remark += tasteRemark;
    }
    if (item.hasOwnProperty("make")) {
      const makeRemark = this.filterRemark("做法:", item.make);
      if (makeRemark) defaultItem.remark += makeRemark;
    }
    return defaultItem;
  }

  // todo 将购物车商品放到订单数据中
  static setGoodsToOrderParams(goods, options = {}) {
    let params = this.getDefaultParams();
    if (options.orderKey) params.order.orderKey = options.orderKey;
    goods.map(goodsItem => {
      params.order.orderItem.push(this.filterOrderItem(goodsItem));

      if (goodsItem.hasOwnProperty("combo")) {
        goodsItem.combo.items.map(comboItem => {
          params.order.orderItem.push(this.filterOrderItem(this.filterComboItem(comboItem, goodsItem.count)));

          if (comboItem.hasOwnProperty("sideDish")) {
            this.filterSideDish(comboItem.sideDish, params.order.orderItem, goodsItem.count);
          }
          if (comboItem.hasOwnProperty("extraMake")) {
            this.filterExtraMake(comboItem.extraMake, params.order.orderItem, goodsItem.count);
          }
        });
      }
      if (goodsItem.hasOwnProperty("sideDish")) {
        this.filterSideDish(goodsItem.sideDish, params.order.orderItem, goodsItem.count);
      }
      if (goodsItem.hasOwnProperty("extraMake")) {
        this.filterExtraMake(goodsItem.extraMake, params.order.orderItem, goodsItem.count);
      }
    });
    return params;
  }

  static filterComboItem(item, parentCount) {
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
      takeoutPackagingFee: "0.00",
      isDiscount: 0
    };
  }

  static filterSideDish(data, orderItem, parentCount) {
    if (!data || !data.length) return false;
    data.map(item => {
      item.items?.map(subItem => {
        orderItem.push(this.filterOrderItem({...subItem, count: parentCount}));
      });
    });
  }

  static filterExtraMake(data, orderItem, parentCount) {
    if (!data || !data.length) return false;
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
          takeoutPackagingFee: "0.00",
          isDiscount: 0
        })
      );
    });
  }

  static filterRemark(prefixText, data) {
    let text = `${prefixText}`;
    let arr = [];
    data.map(item => {
      item.items.map(subItem => {
        arr.push(subItem.notesName);
      });
    });
    if (arr.length) {
      arr.map((arrItem, arrIndex) => {
        text += arrItem;
        text += arrIndex !== arr.length - 1 ? "," : ";";
      });
    } else {
      return false;
    }
    return text;
  }
}
