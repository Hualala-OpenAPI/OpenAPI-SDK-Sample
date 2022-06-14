import React, { FC, Ref, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Toast } from 'antd-mobile-v5'
import { Button } from 'antd-mobile'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import CommonHeader from '../../../containers/Main/components/MainHeader'
import { clearGoods } from '../../../store/actions/Shop'
import { setOrderInfo, setOrderStatus } from '../../../store/actions/Common'
import OrderController from '../../../controllers/OrderController'
import OrderService from '../../../services/order/OrderService'
import NoData from '../../../components/general/NoData'
import { showToast } from '../../../Utils'
import PaymentDetail from '../../../containers/Payment/PaymentDetail'
import PaymentResult from '../../../containers/Payment/PaymentResult'
import { ORDER_STATUS, PAYMENT_STATUS } from '../../../CONSTANT'
import CommonPopup from '../../../containers/Main/components/CommonPopup'
import ShopCartListItem from '../../../containers/Shop/components/ShopCartListItem'
import DeliveryInfo from '../../../containers/Shop/components/DeliveryInfo'
import ShopInfo from '../../../containers/Shop/components/ShopInfo'
import './index.less'

type MapStateToProps = Readonly<ReturnType<typeof mapStateToProps>>
type MapDispatchToProps = Readonly<ReturnType<typeof mapDispatchToProps>>
type IProps = MapStateToProps & MapDispatchToProps & RouteComponentProps

const OrderCreate: FC<IProps> = props => {
  const { goodsList, paymentStatus, orderStatus, shopInfo, moduleConfig, goodsTotalPrice } = props
  const { dineWay } = moduleConfig
  const { UNPAID } = PAYMENT_STATUS
  const { NORMAL, CREATED } = ORDER_STATUS
  const goodsContentRef: Ref<any> = useRef()
  const [paymentVisible, updatePaymentVisible] = useState(false)
  const [paymentResultVisible, updatePaymentResultVisible] = useState(false)
  const [goodsContentHeight, updateGoodsContentHeight] = useState(200)

  useEffect(() => {
    const { height: parentHeight, top: parentTop } = goodsContentRef.current.offsetParent.getBoundingClientRect()
    const { top } = goodsContentRef.current.getBoundingClientRect()
    updateGoodsContentHeight(parentHeight - top + parentTop - 75)
    nowPayment()
  }, [])

  const nowPayment = () => {
    createOrder((data: any) => {
      Toast.clear()
      props.setOrderInfo(data)
      updatePaymentVisible(true)
    })
  }

  const createOrder = (cb?: Function) => {
    showToast({ content: '创建订单中..', duration: 0 })
    const params = OrderController.setGoodsToOrderParams(goodsList)
    OrderService.create(params).then((res: any) => {
      const { code, data } = res
      if (code !== '000') return false
      if (cb) cb(data)
      if (orderStatus === NORMAL) props.setOrderStatus(CREATED)
    })
  }

  const renderGoods = () => {
    if (goodsList.length) {
      return goodsList.map((item: any, index: number) => {
        return <ShopCartListItem key={index} item={item} />
      })
    }
    return <NoData customStyle={{ minHeight: 100 }}>暂无菜品</NoData>
  }

  const paymentFinished = (status: boolean) => {
    updatePaymentVisible(false)
    if (status) updatePaymentResultVisible(true)
  }
  return (
    <div className="order-create">
      <CommonHeader title={`${dineWay === 1 ? '自提' : '外卖'}-创建订单`} />
      <ShopInfo item={shopInfo} />
      <DeliveryInfo moduleConfig={moduleConfig} shopInfo={shopInfo} />

      <div className="goods-content" ref={goodsContentRef} style={{ height: goodsContentHeight }}>
        {renderGoods()}
      </div>

      <div className="bottom-info">
        {paymentStatus === UNPAID ? (
          <Button size="small" type="warning" onClick={nowPayment}>
            支付 ￥{goodsTotalPrice}
          </Button>
        ) : null}
      </div>

      <CommonPopup visible={paymentVisible} onMaskClick={() => updatePaymentVisible(false)}>
        {paymentVisible ? <PaymentDetail onFinished={paymentFinished} /> : null}
      </CommonPopup>

      <CommonPopup visible={paymentResultVisible}>{<PaymentResult />}</CommonPopup>
    </div>
  )
}
const mapStateToProps = (state: any) => {
  const { orderStatus, paymentStatus, shopInfo, moduleConfig } = state.common.toJS()
  const { goodsList, goodsTotalPrice } = state.shop.toJS()
  return {
    goodsList,
    goodsTotalPrice,
    orderStatus,
    paymentStatus,
    shopInfo,
    moduleConfig
  }
}
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  setOrderStatus(status: number) {
    dispatch(setOrderStatus(status))
  },
  clearGoods() {
    dispatch(clearGoods())
  },
  setOrderInfo(info: any) {
    dispatch(setOrderInfo(info))
  }
})
export default React.memo(connect(mapStateToProps, mapDispatchToProps)(withRouter(OrderCreate)))
