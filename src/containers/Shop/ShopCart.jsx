import React, {useState} from "react";
import {withRouter} from "react-router-dom";
import {Popup} from "antd-mobile-v5";
import {Badge, Button, Modal} from "antd-mobile";
import {connect} from "react-redux";
import EnumController from "../../controllers/EnumController";
import ShopCartList from "./ShopCartList";
import {setOrderStatus, setPaymentStatus} from "../../store/actions/Common";
import "./css/ShopCart.less";

const ShopCart = props => {
  const {goodsCount, history, goodsTotalPrice} = props;
  const [cartListVisible, updateCardListVisible] = useState(false);
  const {NORMAL} = EnumController.ORDER_STATUS();
  const {UNPAID} = EnumController.PAYMENT_STATUS();
  const {ORDER_CREATE} = EnumController.ROUTERS();
  const pushToPage = () => {
    props.setPaymentStatus(UNPAID);
    props.setOrderStatus(NORMAL);
    history.push(ORDER_CREATE);
  };
  return (
    <div className="shop-card">
      <div className="row">
        <Button className="btn" disabled={goodsCount === 0} onClick={() => updateCardListVisible(!cartListVisible)}>
          购物车
          <Badge className="badge" size="small" text={goodsCount} overflowCount={99} />
        </Button>
        <span style={{marginLeft: 10}}>￥{goodsTotalPrice}</span>
      </div>
      <Button className="btn" disabled={!goodsCount} type="primary" onClick={pushToPage}>
        下单
      </Button>
      <Popup
        visible={cartListVisible}
        destroyOnClose
        getContainer={document.getElementById("mainContainer")}
        onMaskClick={() => updateCardListVisible(false)}
      >
        {cartListVisible ? <ShopCartList onClose={() => updateCardListVisible(false)} /> : null}
      </Popup>
    </div>
  );
};

const mapStateToProps = state => {
  const {goodsCount, goodsTotalPrice} = state.shop.toJS();
  return {
    goodsCount,
    goodsTotalPrice
  };
};
const mapDispatchToProps = {
  setOrderStatus,
  setPaymentStatus
};
export default React.memo(connect(mapStateToProps, mapDispatchToProps)(withRouter(ShopCart)));
