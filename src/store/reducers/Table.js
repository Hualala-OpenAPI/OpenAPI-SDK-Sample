import {fromJS} from "immutable";
import {TABLE_SET_INFO, TABLE_SET_PAYMENT_AMOUNT, TABLE_SET_STATUS} from "../Constants";
import EnumController from "../../controllers/EnumController";

const defaultState = fromJS({
  tableInfo: null,
  tableStatus: EnumController.TABLE_STATUS().NORMAL,
  paymentAmount: 0 // 待支付金额
});
export default (state = defaultState, action) => {
  const {type, payload} = action;
  switch (type) {
    case TABLE_SET_INFO:
      return state.set("tableInfo", fromJS(payload));
    case TABLE_SET_STATUS:
      return state.set("tableStatus", payload);
    case TABLE_SET_PAYMENT_AMOUNT:
      return state.set("paymentAmount", payload);
    default:
      return state;
  }
};
