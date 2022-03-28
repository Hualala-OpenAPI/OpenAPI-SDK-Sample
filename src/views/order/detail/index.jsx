import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Button} from "antd-mobile";
import {Toast, Modal} from "antd-mobile-v5";
import CommonHeader from "../../../containers/Main/components/MainHeader";
import OrderService from "../../../services/order/OrderService";
import Config from "../../../Config";
import {parseJson, showToast} from "../../../Utils";
import NoData from "../../../components/general/NoData";
import {filterOrderStatus} from "../../../Filter";
import {setOrderStatus} from "../../../store/actions/Common";
import EnumController from "../../../controllers/EnumController";
import "./index.less";

const {confirm} = Modal;
const OrderDetail = props => {
  const {orderStatus, paymentStatus, match} = props;
  const {groupId, shopId} = Config.info;
  const {id: orderKey} = match.params;
  const {PAID} = EnumController.PAYMENT_STATUS();
  const {CREATED, REFUND} = EnumController.ORDER_STATUS();
  const [item, updateItem] = useState(null);

  useEffect(() => {
    getItem();
  }, []);

  useEffect(() => {
    if (item) console.log("详情-", item);
  }, [item]);

  const getItem = () => {
    showToast({content: "订单查询..", duration: 0});
    OrderService.show({orderKey, groupID: groupId, shopID: shopId})
      .then(res => {
        const {code, data} = res;
        if (code !== "000") return false;
        updateItem(parseJson(data.payload));
      })
      .finally(() => {
        Toast.clear();
      });
  };

  const handleRefund = () => {
    showToast({content: "退款中..", duration: 0});
    fastRefund();
  };
  const fastRefund = () => {
    const params = {
      groupID: groupId,
      shopID: shopId,
      orderKey,
      thirdPartyStatus: 3,
      cancelOrderCause: "不想要了",
      operator: "OpenAPISDK堂食Demo操作",
      refundAmount: item.paidTotalAmount
    };
    OrderService.fastRefund(params)
      .then(res => {
        const {code} = res;
        if (code !== "000") return false;
        props.setOrderStatus(REFUND);
        showToast({content: "退款成功", icon: "success", duration: 1000});
        setTimeout(() => {
          getItem();
        }, 1000);
      })
      .catch(() => {
        Toast.clear();
      });
  };
  return (
    <div className="order-detail">
      <CommonHeader title="堂食-订单详情" />
      {item ? (
        <div className="content">
          <div className="order-item">集团名称 : {item.groupName}</div>
          <div className="order-item">店铺名称 : {item.shopName}</div>
          <div className="order-item">桌台名称 : {item.tableName}</div>
          <div className="order-item">用餐人数 : {item.dinners}</div>
          <div className="order-item">订单号 : {orderKey}</div>
          <div className="order-item">
            订单类型 : {item.orderType === 16 ? "开放平台" : item.orderType}({item.orderSubType === 41 ? "堂食" : item.orderSubType})
          </div>
          <div className="order-item">订单时间 : {item.orderTime}</div>
          <div className="order-item">订单状态 : {filterOrderStatus(item.orderStateCode)}</div>
          <div className="order-item">实付金额 : {item.paidTotalAmount}</div>
          <div className="subtitle">订单商品如下 :</div>
          <div className="goods">
            {item.orderItemList.map((subItem, subIndex) => {
              return (
                <div className="goods-item" key={subIndex}>
                  <div className="goods-item-content">
                    <div>
                      {subItem.isBatching === 3 ? "【做法】" : ""}
                      {subItem.foodName} x {subItem.foodCount}/{subItem.foodUnit}
                    </div>
                    <div>￥{subItem.duePrice}</div>
                  </div>
                  <div className="remark">{subItem.remark}</div>
                </div>
              );
            })}
          </div>

          {orderStatus === CREATED && paymentStatus === PAID ? (
            <Button
              className="fix-btn"
              type="warning"
              onClick={() =>
                confirm({
                  title: "确定要退款吗?",
                  confirmText: "确定",
                  getContainer: document.getElementById("mainContainer"),
                  onConfirm: handleRefund,
                  cancelText: "取消"
                })
              }
            >
              申请退款(不需要POS同意)
            </Button>
          ) : null}
        </div>
      ) : (
        <NoData />
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    orderStatus: state.common.get("orderStatus"),
    paymentStatus: state.common.get("paymentStatus")
  };
};
const mapDispatchToProps = {
  setOrderStatus
};
export default React.memo(connect(mapStateToProps, mapDispatchToProps)(withRouter(OrderDetail)));
