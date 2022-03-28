import React, {useEffect, useState} from "react";
import {Button, List, Radio} from "antd-mobile";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import Config from "../../Config";
import ShopService from "../../services/shop/ShopService";
import PaymentController from "../../controllers/PaymentController";
import "./css/PaymentDetail.less";
import {showToast} from "../../Utils";
import {getTableStatus} from "../../store/actions/Table";

const {RadioItem} = Radio;
const PaymentDetail = props => {
  const {history, paymentAmount, showCancel = true, tableInfo, onFinished} = props;
  const [paymentItem, updatePaymentItem] = useState(null);
  const [canPay, updateCanPay] = useState(false);

  useEffect(() => {
    showToast({content: "查询桌台信息..", duration: 0});
    props.getTableStatus(() => {
      getPaymentList();
    });
  }, []);

  const getPaymentList = () => {
    const {groupId, shopId} = Config.info;
    ShopService.subject({groupID: groupId, shopID: shopId}).then(res => {
      const {code, data} = res;
      if (code !== "000") return false;
      const thirdPayment = data.paySubjectList.find(item => item.subjectName === "第三方支付");
      updatePaymentItem(thirdPayment);
      updateCanPay(true);
    });
  };

  const handleOnOk = () => {
    const paymentController = new PaymentController();
    const {channelOrderKey: orderKey} = tableInfo;
    paymentController.payment({paymentItem, orderKey, price: paymentAmount}).then(data => {
      onFinished(true);
    });
  };

  return (
    <div className="payment-detail">
      <div className="title">支付信息</div>
      <div className="price">支付金额:￥{paymentAmount}</div>
      <div className="content-container">
        <List>
          <RadioItem checked>{paymentItem?.subjectName || "第三方支付"}</RadioItem>
        </List>
      </div>
      <div className="btn-container">
        {showCancel ? <Button onClick={() => onFinished(false)}>取消</Button> : null}
        <Button disabled={!canPay} type="primary" onClick={handleOnOk}>
          确定
        </Button>
      </div>
    </div>
  );
};
const mapStateToProps = state => {
  const {tableInfo, paymentAmount} = state.table.toJS();
  return {
    tableInfo,
    paymentAmount
  };
};
const mapDispatchToProps = {
  getTableStatus
};
export default React.memo(connect(mapStateToProps, mapDispatchToProps)(withRouter(PaymentDetail)));
