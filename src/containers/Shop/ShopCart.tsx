import React, { FC, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Popup } from 'antd-mobile-v5'
import { Badge, Button } from 'antd-mobile'
import { connect } from 'react-redux'
import ShopCartList from './ShopCartList'
import { setOrderStatus, setPaymentStatus } from '../../store/actions/Common'
import { ORDER_STATUS, PAYMENT_STATUS, ROUTERS } from '../../CONSTANT'
import './css/ShopCart.less'

type MapStateToProps = Readonly<ReturnType<typeof mapStateToProps>>
type MapDispatchToProps = Readonly<typeof mapDispatchToProps>
type IProps = MapStateToProps & MapDispatchToProps & RouteComponentProps

const ShopCart: FC<IProps> = props => {
  const { goodsCount, history, goodsTotalPrice } = props
  const [cartListVisible, updateCardListVisible] = useState(false)
  const { NORMAL } = ORDER_STATUS
  const { UNPAID } = PAYMENT_STATUS
  const { ORDER_CREATE } = ROUTERS
  const pushToPage = () => {
    props.setPaymentStatus(UNPAID)
    props.setOrderStatus(NORMAL)
    history.push(ORDER_CREATE)
  }
  return (
    <div className="shop-card">
      <div className="row">
        <Button className="btn" disabled={goodsCount === 0} onClick={() => updateCardListVisible(!cartListVisible)}>
          购物车
          <Badge className="badge" size="small" text={goodsCount} overflowCount={99} />
        </Button>
        <span style={{ marginLeft: 10 }}>￥{goodsTotalPrice}</span>
      </div>
      <Button className="btn" disabled={!goodsCount} type="primary" onClick={pushToPage}>
        下单
      </Button>
      <Popup
        visible={cartListVisible}
        destroyOnClose
        getContainer={document.getElementById('mainContainer')}
        onMaskClick={() => updateCardListVisible(false)}
      >
        {cartListVisible ? <ShopCartList onClose={() => updateCardListVisible(false)} /> : null}
      </Popup>
    </div>
  )
}

const mapStateToProps = (state: any) => {
  const { goodsCount, goodsTotalPrice } = state.shop.toJS()
  return {
    goodsCount,
    goodsTotalPrice
  }
}
const mapDispatchToProps = {
  setOrderStatus,
  setPaymentStatus
}
export default React.memo(connect(mapStateToProps, mapDispatchToProps)(withRouter(ShopCart)))
