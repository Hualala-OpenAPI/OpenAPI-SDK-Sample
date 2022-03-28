import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Popup, Toast} from "antd-mobile-v5";
import {Button, Modal} from "antd-mobile";
import {withRouter} from "react-router-dom";
import CommonHeader from "../../../containers/Main/components/MainHeader";
import EnumController from "../../../controllers/EnumController";
import {clearGoods} from "../../../store/actions/Shop";
import {setOrderStatus, setPaymentStatus} from "../../../store/actions/Common";
import {getTableStatus, setPaymentAmount, setTableInfo} from "../../../store/actions/Table";
import OrderController from "../../../controllers/OrderController";
import OrderService from "../../../services/order/OrderService";
import PaymentDetail from "../../../containers/Payment/PaymentDetail";
import ShopTableGoodsItem from "../../../containers/Main/OrderGoodsItem";
import TableController from "../../../controllers/TableController";
import NoData from "../../../components/general/NoData";
import "./index.less";
import {showToast} from "../../../Utils";
import PaymentResult from "../../../containers/Payment/PaymentResult";

const OrderCreate = props => {
  const {moduleConfig, goodsList, tableInfo, paymentStatus, orderStatus, paymentAmount, history} = props;
  const {paymentType} = moduleConfig;
  const {UNPAID} = EnumController.PAYMENT_STATUS();
  const {NOW, AFTER} = EnumController.PAYMENT_TYPE();
  const {NORMAL, CREATED} = EnumController.ORDER_STATUS();
  const tableController = new TableController();
  const [paymentVisible, updatePaymentVisible] = useState(false);
  const [paymentResultVisible, updatePaymentResultVisible] = useState(false);

  useEffect(() => {
    if (paymentType !== NOW && orderStatus === CREATED) {
      updateTableStatus();
    }

    if (orderStatus === NORMAL && goodsList.length) {
      if (paymentType === NOW) nowPayment();
      if (paymentType === AFTER) afterPayment();
    }
  }, []);

  const nowPayment = () => {
    createOrder(data => {
      Toast.clear();
      props.setTableInfo({channelOrderKey: data?.orderKey});
      props.setPaymentAmount(data?.dueTotalAmount);
      updatePaymentVisible(true);
    });
  };
  const afterPayment = () => {
    createOrder(() => {
      updateTableStatus();
    });
  };
  const createOrder = cb => {
    showToast({content: "创建订单中..", duration: 0});
    const params = OrderController.setGoodsToOrderParams(goodsList, {
      orderKey: tableInfo?.channelOrderKey
    });
    OrderService.create(params)
      .then(res => {
        const {code, data} = res;
        if (code !== "000") return false;
        if (cb) cb(data);
        if (orderStatus === NORMAL) props.setOrderStatus(CREATED);
      })
      .catch(() => {
        Toast.clear();
      });
  };
  const updateTableStatus = () => {
    showToast({content: "查询桌台信息..", duration: 0});
    setTimeout(() => {
      props.getTableStatus();
    }, 1500);
  };
  const addShop = () => {
    props.clearGoods();
    history.go(-1);
  };

  const renderGoods = () => {
    if (tableInfo?.foodLst?.length) {
      tableController.init(tableInfo.foodLst);
      return tableController.getItems().map((item, index) => {
        return <ShopTableGoodsItem key={index} item={item} controller={tableController} />;
      });
    }
    return <NoData customStyle={{minHeight: 100}}>暂无菜品</NoData>;
  };

  const paymentFinished = status => {
    updatePaymentVisible(false);
    if (status) updatePaymentResultVisible(true);
  };
  return (
    <div className="order-create">
      <CommonHeader title="堂食-创建订单" />
      <div className="goods-content">{renderGoods()}</div>

      {paymentType === AFTER ? (
        <div className="bottom-info">
          <Button size="small" type="primary" onClick={addShop}>
            加菜
          </Button>
          {paymentStatus === UNPAID ? (
            <Button size="small" type="warning" onClick={() => updatePaymentVisible(true)}>
              支付
              {paymentAmount > 0 ? `￥${paymentAmount}` : ""}
            </Button>
          ) : null}
        </div>
      ) : null}
      <Popup
        visible={paymentVisible}
        destroyOnClose
        position="top"
        bodyStyle={{
          background: "none",
          height: "100%"
        }}
        getContainer={document.getElementById("mainContainer")}
        onMaskClick={() => updatePaymentVisible(false)}
      >
        {paymentVisible ? <PaymentDetail showCancel={paymentType !== NOW} onFinished={paymentFinished} /> : null}
      </Popup>

      <Popup
        visible={paymentResultVisible}
        destroyOnClose
        position="top"
        bodyStyle={{
          background: "none",
          height: "100%"
        }}
        getContainer={document.getElementById("mainContainer")}
      >
        <PaymentResult />
      </Popup>
    </div>
  );
};
const mapStateToProps = state => {
  const {tableInfo, paymentAmount} = state.table.toJS();
  const {orderStatus, paymentStatus, moduleConfig} = state.common.toJS();
  const {goodsList} = state.shop.toJS();
  return {
    tableInfo,
    goodsList,
    paymentAmount,
    orderStatus,
    paymentStatus,
    moduleConfig
  };
};
const mapDispatchToProps = {
  setOrderStatus,
  clearGoods,
  setPaymentStatus,
  setPaymentAmount,
  setTableInfo,
  getTableStatus
};
export default React.memo(connect(mapStateToProps, mapDispatchToProps)(withRouter(OrderCreate)));
