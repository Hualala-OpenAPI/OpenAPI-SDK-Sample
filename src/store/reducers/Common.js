import {fromJS} from "immutable";
import {
  COMMON_SET_FOOD_TAGS,
  COMMON_SET_GOODS_CATALOG,
  COMMON_SET_MODULE_CONFIG,
  COMMON_SET_ORDER_STATUS,
  COMMON_SET_ORIGIN_GOODS_LIST,
  COMMON_SET_PAYMENT_STATUS
} from "../Constants";
import EnumController from "../../controllers/EnumController";

const defaultState = fromJS({
  moduleConfig: {}, // 堂食的配置项
  orderStatus: EnumController.ORDER_STATUS().NORMAL,
  paymentStatus: EnumController.PAYMENT_STATUS().UNPAID,
  originGoodsList: [], // 店铺内所有菜品
  foodTags: [], // 配菜使用
  goodsCatalog: [] // 商品分类
});
export default (state = defaultState, action) => {
  const {type, payload} = action;
  switch (type) {
    case COMMON_SET_MODULE_CONFIG:
      return state.set("moduleConfig", fromJS(payload));
    case COMMON_SET_PAYMENT_STATUS:
      return state.set("paymentStatus", payload);
    case COMMON_SET_ORDER_STATUS:
      return state.set("orderStatus", payload);
    case COMMON_SET_FOOD_TAGS:
      return state.set("foodTags", fromJS(payload));
    case COMMON_SET_ORIGIN_GOODS_LIST:
      return state.set("originGoodsList", fromJS(payload));
    case COMMON_SET_GOODS_CATALOG:
      return state.set("goodsCatalog", fromJS(payload));
    default:
      return state;
  }
};
