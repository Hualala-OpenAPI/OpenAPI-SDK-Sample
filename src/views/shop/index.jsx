import React from "react";
import {connect} from "react-redux";
import ShopTable from "../../containers/Shop/ShopTable";
import EnumController from "../../controllers/EnumController";
import ShopDetail from "../../containers/Shop/ShopDetail";
import "./index.less";

const ShopIndex = props => {
  const {moduleConfig} = props;
  const {paymentType} = moduleConfig;
  const {NOW, AFTER} = EnumController.PAYMENT_TYPE();

  return (
    <div className="shop-index" id="shopIndex">
      {NOW === paymentType ? <ShopDetail /> : null}
      {AFTER === paymentType ? <ShopTable /> : null}
    </div>
  );
};
const mapStateToProps = state => {
  return {
    moduleConfig: state.common.get("moduleConfig").toJS()
  };
};
export default React.memo(connect(mapStateToProps, null)(ShopIndex));
