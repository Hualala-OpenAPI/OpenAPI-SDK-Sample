import React, { FC, useEffect, useState } from 'react'
import { Button, List, Radio } from 'antd-mobile'
import { Toast } from 'antd-mobile-v5'
import { connect } from 'react-redux'
import Config from '../../Config'
import ShopService from '../../services/shop/ShopService'
import PaymentController from '../../controllers/PaymentController'
import { showToast } from '../../Utils'
import './css/PaymentDetail.less'

const { RadioItem } = Radio
type MapStateToProps = Readonly<ReturnType<typeof mapStateToProps>>
type MapDispatchToProps = Readonly<ReturnType<typeof mapDispatchToProps>>
type IProps = {
  onFinished: (status: boolean) => void
} & MapStateToProps &
  MapDispatchToProps

const PaymentDetail: FC<IProps> = props => {
  const { orderInfo, shopInfo, onFinished } = props
  const { orderKey, dueTotalAmount } = orderInfo
  const [paymentItem, updatePaymentItem] = useState<any>(null)
  const [canPay, updateCanPay] = useState<boolean>(true)

  useEffect(() => {
    getPaymentList()
  }, [])

  const getPaymentList = () => {
    const { groupId: groupID } = Config.info
    const { shopID } = shopInfo
    showToast({ content: '获取支付科目..', duration: 0 })
    ShopService.subject({ groupID, shopID }).then(res => {
      const { code, data } = res
      if (code !== '000') return false
      const thirdPayment = data.paySubjectList.find((item: any) => item.subjectName === '第三方支付')
      updatePaymentItem(thirdPayment)
      updateCanPay(true)
      Toast.clear()
    })
  }

  const handleOnOk = () => {
    const paymentController = new PaymentController()
    paymentController
      .payment({
        paymentItem: {
          subjectName: '第三方支付',
          subjectCode: '51010441'
        },
        orderKey,
        price: dueTotalAmount
      })
      .then(() => {
        onFinished(true)
      })
  }

  return (
    <div className="payment-detail">
      <div className="title">支付信息</div>
      <div className="price">支付金额:￥{dueTotalAmount}</div>
      <div className="content-container">
        <List>
          <RadioItem checked>{paymentItem?.subjectName || '第三方支付'}</RadioItem>
        </List>
      </div>
      <div className="btn-container">
        <Button disabled={!canPay} type="primary" onClick={handleOnOk}>
          确定
        </Button>
      </div>
    </div>
  )
}
const mapStateToProps = (state: any) => {
  return {
    moduleConfig: state.common.get('moduleConfig').toJS(),
    orderInfo: state.common.get('orderInfo').toJS(),
    shopInfo: state.common.get('shopInfo').toJS()
  }
}
const mapDispatchToProps = () => ({})
export default React.memo(connect(mapStateToProps, mapDispatchToProps)(PaymentDetail))
