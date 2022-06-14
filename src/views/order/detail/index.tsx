import React, { FC, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd-mobile'
import { Toast, Modal } from 'antd-mobile-v5'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { RouteComponentProps } from 'react-router-dom'
import CommonHeader from '../../../containers/Main/components/MainHeader'
import OrderService from '../../../services/order/OrderService'
import Config from '../../../Config'
import { parseJson, showToast } from '../../../Utils'
import NoData from '../../../components/general/NoData'
import { filterOrderStatus, filterOrderSubType } from '../../../Filter'
import { setOrderStatus } from '../../../store/actions/Common'
import { ORDER_STATUS } from '../../../CONSTANT'
import './index.less'

const { confirm } = Modal

type MapStateToProps = Readonly<ReturnType<typeof mapStateToProps>>
type MapDispatchToProps = Readonly<ReturnType<typeof mapDispatchToProps>>
type IMatch = { id: string }
type IProps = MapStateToProps & MapDispatchToProps & RouteComponentProps<IMatch>

const OrderDetail: FC<IProps> = props => {
  const { match, shopInfo, moduleConfig } = props
  const { groupId } = Config.info
  const { shopID } = shopInfo
  const { dineWay } = moduleConfig
  const { id: orderKey } = match.params
  const { REFUND } = ORDER_STATUS
  const [item, updateItem] = useState<any>(null)

  useEffect(() => {
    getItem()
  }, [])

  const getItem = () => {
    showToast({ content: '订单查询..', duration: 0 })
    OrderService.show({ orderKey, groupID: groupId, shopID })
      .then((res: any) => {
        const { code, data } = res
        if (code !== '000') return false
        updateItem(parseJson(data.payload))
      })
      .finally(() => {
        Toast.clear()
      })
  }

  const handleRefund = () => {
    showToast({ content: '退款中..', duration: 0 })
    fastRefund()
  }
  const fastRefund = () => {
    const params = {
      groupID: groupId,
      shopID,
      orderKey,
      thirdPartyStatus: 3,
      cancelOrderCause: '不想要了',
      operator: 'OpenAPISDK外卖Demo操作',
      refundAmount: item.paidTotalAmount
    }
    OrderService.fastRefund(params)
      .then((res: any) => {
        const { code } = res
        if (code !== '000') return false
        props.setOrderStatus(REFUND)
        showToast({ content: '退款成功', icon: 'success' })
        getItem()
      })
      .catch(() => {
        Toast.clear()
      })
  }

  const handleReceipt = () => {
    const params = {
      groupID: Config.info.groupId,
      shopID,
      orderKey,
      status: 4
    }
    OrderService.confirm(params).then(res => {
      const { code } = res
      if (code !== '000') return false
      showToast({ content: `确认${dineWay === 1 ? '自提' : '送达'}中..` })
      getItem()
    })
  }

  const showReceiptBtn = () => {
    switch (Number(item.orderStateCode)) {
      case 50:
      case 60:
      case 65:
        return false
      default:
        return true
    }
  }
  return (
    <div className="order-detail">
      <CommonHeader title={`${dineWay === 1 ? '自提' : '外卖'}-订单详情`} />
      {item ? (
        <div className="content">
          <div className="order-item">集团名称 : {item.groupName}</div>
          <div className="order-item">店铺名称 : {item.shopName}</div>
          <div className="order-item">用餐人数 : {item.dinners}</div>
          <div className="order-item">订单号 : {orderKey}</div>
          <div className="order-item">
            订单类型 : {item.orderType === 16 ? '开放平台' : item.orderType}({filterOrderSubType(item.orderSubType)})
          </div>
          <div className="order-item">订单时间 : {item.orderTime}</div>
          <div className="order-item">订单状态 : {filterOrderStatus(item.orderStateCode)}</div>
          <div className="order-item">实付金额 : {item.paidTotalAmount}</div>
          <div className="subtitle">订单商品如下 :</div>
          <div className="goods">
            {item.orderItemList.map((subItem: any, subIndex: number) => {
              return (
                <div className="order-goods-item" key={subIndex}>
                  <div className="order-goods-item-content">
                    <div>
                      {subItem.isBatching === 3 ? '【做法】' : ''}
                      {subItem.foodName} x {subItem.foodCount}/{subItem.foodUnit}
                    </div>
                    <div>￥{subItem.duePrice}</div>
                  </div>
                  <div className="remark">{subItem.remark}</div>
                </div>
              )
            })}
          </div>

          <div className="btn-info">
            {Number(item.orderStateCode) !== 65 ? (
              <Button
                type="warning"
                onClick={() =>
                  confirm({
                    title: '确定要退款吗?',
                    confirmText: '确定',
                    getContainer: document.getElementById('mainContainer'),
                    onConfirm: handleRefund,
                    cancelText: '取消'
                  })
                }
              >
                申请退款(不需要POS同意)
              </Button>
            ) : null}

            {showReceiptBtn() ? (
              <Button
                type="primary"
                onClick={() =>
                  confirm({
                    title: `确认${dineWay === 1 ? '自提' : '送达'}了吗?`,
                    confirmText: '确定',
                    getContainer: document.getElementById('mainContainer'),
                    onConfirm: handleReceipt,
                    cancelText: '取消'
                  })
                }
              >
                {dineWay === 1 ? '确认自提' : '确认送达'}
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <NoData />
      )}
    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    shopInfo: state.common.get('shopInfo').toJS(),
    moduleConfig: state.common.get('moduleConfig').toJS()
  }
}
const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => ({
  setOrderStatus(status: number) {
    dispatch(setOrderStatus(status))
  }
})
export default React.memo(connect(mapStateToProps, mapDispatchToProps)(OrderDetail))
