import React from "react";
import {Icon, Result} from "antd-mobile";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import "./css/PaymentResult.less";

const PaymentDetail = props => {
  const {tableInfo, paymentAmount, history} = props;
  const pushToPage = () => {
    const {channelOrderKey: orderKey} = tableInfo;
    history.push(`/order/${orderKey}`);
  };

  return (
    <div className="payment-result">
      <Result
        img={<Icon type="check-circle" className="icon" />}
        title="支付成功"
        message={`${paymentAmount}元`}
        buttonText="查看订单详情"
        buttonType="primary"
        onButtonClick={pushToPage}
      />
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
export default connect(mapStateToProps)(withRouter(PaymentDetail));
