import {Toast} from "antd-mobile-v5";
import {TABLE_SET_INFO, TABLE_SET_PAYMENT_AMOUNT, TABLE_SET_STATUS} from "../Constants";
import TableService from "../../services/table/TableService";
import Config from "../../Config";
import EnumController from "../../controllers/EnumController";
import {filterAmount, showToast} from "../../Utils";
import {setPaymentStatus} from "./Common";

export function setTableStatus(status) {
  return {
    type: TABLE_SET_STATUS,
    payload: status
  };
}

export function setTableInfo(info) {
  return {
    type: TABLE_SET_INFO,
    payload: info
  };
}

export function setPaymentAmount(amount) {
  return {
    type: TABLE_SET_PAYMENT_AMOUNT,
    payload: amount
  };
}

// todo 桌台开台后,查询桌台信息
function getTableInfo(msgId, cb) {
  showToast({content: "查询桌台信息..", duration: 0});
  const {shopId, groupId} = Config.info;
  setTimeout(() => {
    TableService.show({shopID: shopId, groupID: groupId, msgId: Number(msgId)})
      .then(res => {
        const {code, data} = res;
        if (code !== "000") return false;
        console.log("桌台信息", data);
        if (cb) cb(data);
      })
      .finally(() => {
        Toast.clear();
      });
  }, 1000);
}

// todo 查询桌台状态,如果开台会返回msgId
export function getTableStatus(cb) {
  return dispatch => {
    const {shopId, groupId, tableName} = Config.info;
    const {NORMAL, ACTIVE} = EnumController.TABLE_STATUS();
    const {UNPAID, PAID} = EnumController.PAYMENT_STATUS();
    TableService.getStatus({shopIDList: [shopId], groupID: groupId, tableName})
      .then(res => {
        const {code, data} = res;
        if (code === "000" && data.msgID) {
          getTableInfo(data.msgID, info => {
            dispatch(setTableInfo(info));
            const amount = filterAmount(Number(info.foodAmount) - Number(info.paidAmount));
            dispatch(setPaymentAmount(amount));
            dispatch(setPaymentStatus(amount > 0 ? UNPAID : PAID));
            if (cb) cb(info);
          });
          dispatch(setTableStatus(ACTIVE));
        }
      })
      .catch(error => {
        const {code, message} = error;
        if (code === "10001_108" && message === "桌台未开台") {
          console.log("桌台未开台-", error);
          dispatch(setTableStatus(NORMAL));
          Toast.clear();
        }
      });
  };
}
