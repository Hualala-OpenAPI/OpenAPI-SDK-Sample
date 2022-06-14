import { fromJS } from 'immutable'
import { Toast } from 'antd-mobile-v5'
import Config from '../Config'
import store from '../store'
import OrderService from '../services/order/OrderService'
import { setPaymentStatus } from '../store/actions/Common'
import { showToast } from '../Utils'
import { PAYMENT_STATUS } from '../CONSTANT'

export default class PaymentController {
  defaultParams: any
  constructor() {
    const { orderKey, dueTotalAmount } = store.getState().common.get('orderInfo').toJS()
    const dineWay = store.getState().common.getIn(['moduleConfig', 'dineWay'])
    const shopID = store.getState().common.getIn(['shopInfo', 'shopID'])
    this.defaultParams = fromJS({
      groupID: Config.info.groupId,
      shopID,
      orderKey,
      payment: [
        {
          payWay: '70',
          paymentSubjectName: 0,
          paymentSubjectID: 0,
          dueAmount: dueTotalAmount,
          paymentStatus: '20'
        }
      ],
      orderSubType: dineWay === 1 ? 21 : 20,
      isThirdPay: 2,
      checkoutType: 1,
      isSentMsg: 1,
      orderStatus: 20,
      paidTotalAmount: dueTotalAmount,
      channelKey: '399_weixin',
      msgType: dineWay === 1 ? 121 : 120
    }).toJS()
  }

  payment(options: any = {}) {
    return new Promise((resolve, reject) => {
      showToast({ content: '支付中...', duration: 0 })
      const params = this.defaultParams
      if (options.orderKey) params.orderKey = options.orderKey
      if (options.price) {
        params.paidTotalAmount = options.price
        params.payment[0].dueAmount = options.price
      }
      if (options.paymentItem) {
        params.payment[0].paymentSubjectName = options.paymentItem.subjectName
        params.payment[0].paymentSubjectID = options.paymentItem.subjectCode
      }
      OrderService.payment(params)
        .then((res: any) => {
          const { code, data } = res
          if (code !== '000') reject(res)
          resolve(data)
          store.dispatch(setPaymentStatus(PAYMENT_STATUS.PAID))
          showToast({ content: '支付成功', icon: 'success', duration: 1000 })
        })
        .catch(() => {
          Toast.clear()
        })
    })
  }
}
