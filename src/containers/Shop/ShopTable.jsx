import React, {useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import {Popup} from "antd-mobile-v5";
import {Button, Modal} from "antd-mobile";
import {connect} from "react-redux";
import Config from "../../Config";
import CommonHeader from "../Main/components/MainHeader";
import EnumController from "../../controllers/EnumController";
import TableController from "../../controllers/TableController";
import ShopTableGoodsItem from "../Main/OrderGoodsItem";
import {getTableStatus} from "../../store/actions/Table";
import PaymentDetail from "../Payment/PaymentDetail";
import NoData from "../../components/general/NoData";
import "./css/ShopTable.less";
import {showToast} from "../../Utils";

const ShopTable = props => {
  const {tableName} = Config.info;
  const tableController = new TableController();
  const {tableInfo, paymentAmount, paymentStatus} = props;
  const {UNPAID} = EnumController.PAYMENT_STATUS();
  const [paymentDialogVisible, updatePaymentDialogVisible] = useState(false);

  useEffect(() => {
    showToast({content: "查询桌台信息..", duration: 0});
    setTimeout(() => {
      props.getTableStatus();
    }, 1500);
  }, []);

  const renderTableGoods = () => {
    if (tableInfo.foodLst.length) {
      tableController.init(tableInfo.foodLst);
      return tableController.getItems().map((item, index) => {
        return <ShopTableGoodsItem key={index} item={item} controller={tableController} />;
      });
    }
    return <NoData>暂无菜品</NoData>;
  };

  const pushToPage = url => {
    const {history} = props;
    history.push(url);
  };

  return (
    <div className="shop-table">
      <CommonHeader title="堂食-桌台查询" />
      {tableInfo ? (
        <div className="table-content">
          <div>已下单菜品:</div>
          {renderTableGoods()}
        </div>
      ) : (
        <div className="no-table">{tableName}未开台</div>
      )}

      <div className="btn-container">
        <Button type="primary" size="large" onClick={() => pushToPage(EnumController.ROUTERS().SHOP_DETAIL)}>
          {tableInfo ? "加菜" : "点菜 "}
        </Button>
        {tableInfo && paymentStatus === UNPAID ? (
          <Button type="warning" size="large" onClick={() => updatePaymentDialogVisible(true)}>
            支付
            {paymentAmount > 0 ? `￥${paymentAmount}` : ""}
          </Button>
        ) : null}
      </div>
      <Popup
        visible={paymentDialogVisible}
        destroyOnClose
        getContainer={document.getElementById("mainContainer")}
        onMaskClick={() => updatePaymentDialogVisible(false)}
      >
        {paymentDialogVisible ? <PaymentDetail onFinished={() => updatePaymentDialogVisible(false)} /> : null}
      </Popup>
    </div>
  );
};
const mapStateToProps = state => {
  const {tableInfo, paymentAmount} = state.table.toJS();
  return {
    tableInfo,
    paymentAmount,
    paymentStatus: state.common.get("paymentStatus")
  };
};
const mapDispatchToProps = {
  getTableStatus
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShopTable));
