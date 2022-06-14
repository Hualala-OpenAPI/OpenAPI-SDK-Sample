import React, { FC } from 'react'
import { Icon, Result } from 'antd-mobile'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import './css/PaymentResult.less'

type MapStateToProps = Readonly<ReturnType<typeof mapStateToProps>>
type IProps = MapStateToProps & RouteComponentProps

const PaymentDetail: FC<IProps> = props => {
  const { orderInfo, history } = props
  const { dueTotalAmount, orderKey } = orderInfo
  const pushToPage = () => {
    history.push(`/order/${orderKey}`)
  }

  return (
    <div className="payment-result">
      <Result
        img={<Icon type="check-circle" className="icon" />}
        title="支付成功"
        message={`${dueTotalAmount}元`}
        buttonText="查看订单详情"
        buttonType="primary"
        onButtonClick={pushToPage}
      />
    </div>
  )
}
const mapStateToProps = (state: any) => {
  return {
    orderInfo: state.common.get('orderInfo').toJS()
  }
}
export default React.memo(connect(mapStateToProps)(withRouter(PaymentDetail)))
