import {fromJS} from "immutable";
import {Toast} from "antd-mobile-v5";
import Config from "../Config";
import store from "../store";
import EnumController from "./EnumController";
import OrderService from "../services/order/OrderService";
import {setPaymentStatus} from "../store/actions/Common";
import {showToast} from "../Utils";

export default class PaymentController {
  constructor() {
    const {paymentAmount = 0, tableInfo} = store.getState().common.toJS();
    const paymentType = store.getState().common.getIn(["moduleConfig", "paymentType"]);
    const {NOW} = EnumController.PAYMENT_TYPE();
    this.defaultParams = fromJS({
      groupID: Config.info.groupId,
      shopID: Config.info.shopId,
      orderKey: tableInfo?.channelOrderKey,
      payment: [
        {
          payWay: "70",
          paymentSubjectName: 0,
          paymentSubjectID: 0,
          dueAmount: paymentAmount,
          paymentStatus: "20"
        }
      ],
      orderSubType: 41,
      isThirdPay: 2,
      checkoutType: paymentType === NOW ? "1" : "2",
      isSentMsg: 1,
      orderStatus: 20,
      paidTotalAmount: paymentAmount,
      channelKey: "399_weixin",
      msgType: 240
    }).toJS();
  }

  // todo 外部可以传入别的orderKey和支付金额,默认的orderKey和金额是从桌台信息获取
  payment(options = {}) {
    return new Promise((resolve, reject) => {
      showToast({content: "支付中...", duration: 0});
      const params = this.defaultParams;
      if (options.orderKey) params.orderKey = options.orderKey;
      if (options.price) {
        params.paidTotalAmount = options.price;
        params.payment[0].dueAmount = options.price;
      }
      if (options.paymentItem) {
        params.payment[0].paymentSubjectName = options.paymentItem.subjectName;
        params.payment[0].paymentSubjectID = options.paymentItem.subjectCode;
      }
      OrderService.payment(params)
        .then(res => {
          const {code, data} = res;
          if (code !== "000") reject(res);
          resolve(data);
          store.dispatch(setPaymentStatus(EnumController.PAYMENT_STATUS().PAID));
          showToast({content: "支付成功", icon: "success", duration: 1000});
        })
        .catch(() => {
          Toast.clear();
        });
    });
  }
}
