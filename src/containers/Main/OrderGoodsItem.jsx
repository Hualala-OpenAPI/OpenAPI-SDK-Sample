import React, {Fragment} from "react";
import {connect} from "react-redux";
import {Toast, Modal} from "antd-mobile-v5";
import {Button} from "antd-mobile";
import {filterAmount, showToast} from "../../Utils";
import EnumController from "../../controllers/EnumController";
import OrderService from "../../services/order/OrderService";
import {getTableStatus} from "../../store/actions/Table";
import Config from "../../Config";
import "./css/OrderGoodsItem.less";

const {confirm} = Modal;

const OrderGoodsItem = props => {
  const {tableInfo, item, controller, paymentStatus, paymentType} = props;
  const {UNPAID} = EnumController.PAYMENT_STATUS();
  const {AFTER} = EnumController.PAYMENT_TYPE();

  const handleExchange = info => {
    const {groupId, shopId} = Config.info;
    const {foodID, foodName, foodUnit, foodUnitID, isSetFood, isSFDetail, isDiscount, isBatching, sFMUnitCode, foodCount, duePrice} = info;
    const params = {
      groupID: groupId,
      shopID: shopId,
      orderKey: tableInfo?.channelOrderKey,
      returnFood: [
        {
          foodID,
          foodName,
          foodUnit,
          foodUnitID,
          isDiscount,
          duePrice: duePrice,
          returnFoodCount: foodCount,
          isBatching,
          SFMUnitCode: sFMUnitCode,
          isSetFood,
          isSFDetail
        }
      ]
    };
    showToast({content: "退菜中..", duration: 0});
    OrderService.exchangeFood(params)
      .then(res => {
        const {code} = res;
        if (code !== "000") return false;
        showToast({content: `${foodName}已退`, icon: "success", duration: 1000});
        setTimeout(() => {
          showToast({content: "查询桌台信息..", duration: 0});
          props.getTableStatus();
        }, 1000);
      })
      .catch(() => {
        Toast.clear();
      });
  };

  const renderCell = (info, sub = false) => {
    return (
      <div className={`order-goods-item ${sub ? "sub-item" : ""}`}>
        <div className="row">
          <div className="left">
            <div className="name">{info.foodName}</div>
            <div className="unit">
              x{info.foodCount}/{info.foodUnit}
            </div>
          </div>
          <div className="right">
            <div className="price">{renderPrice(info)}</div>
            {paymentType === AFTER && paymentStatus === UNPAID ? (
              <Button
                type="warning"
                size="small"
                onClick={() =>
                  confirm({
                    title: "确定要退菜吗?",
                    confirmText: "确定",
                    getContainer: document.getElementById("mainContainer"),
                    onConfirm: () => handleExchange(info),
                    cancelText: "取消"
                  })
                }
              >
                退菜
              </Button>
            ) : null}
          </div>
        </div>
        <div className="remark">{info.remark}</div>
        <div className="sub-container">{renderSubInfo(info)}</div>
      </div>
    );
  };

  const renderPrice = info => {
    return `￥${filterAmount(Number(info.duePrice) * Number(info.foodCount))}`;
  };
  const renderSubItem = data => {
    return data.map((dataItem, dataIndex) => {
      return <Fragment key={dataIndex}>{renderCell(dataItem, true)}</Fragment>;
    });
  };

  const renderSubInfo = info => {
    const {isSetFood, isBatching, isSFDetail} = info;
    if (isSetFood === 1) {
      if (isSFDetail === 1) return renderSubItem(controller.findSideDish(info));
      return renderSubItem(controller.findSubCombo(info));
    }
    if (isSetFood === 0 && isBatching === 1) {
      return renderSubItem(controller.findSideDish(info));
    }
  };

  return renderCell(item);
};
const mapStateToProps = state => {
  return {
    paymentType: state.common.getIn(["moduleConfig", "paymentType"]),
    paymentStatus: state.common.get("paymentStatus"),
    tableInfo: state.table.toJS().tableInfo
  };
};
const mapDispatchToProps = {
  getTableStatus
};
export default React.memo(connect(mapStateToProps, mapDispatchToProps)(OrderGoodsItem));
