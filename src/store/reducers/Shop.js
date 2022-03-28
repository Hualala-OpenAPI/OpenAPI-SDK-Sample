import {fromJS} from "immutable";
import {CLEAR_ALL_GOODS, DELETE_GOODS_ITEM, SET_GOODS_COUNT, SET_GOODS_ITEM, SET_GOODS_TOTAL_PRICE} from "../Constants";

const defaultState = fromJS({
  goodsList: [], // 当前在购物车的商品
  goodsCount: 0, // 购物车数量
  goodsTotalPrice: 0 // 购物车总价格
});
export default (state = defaultState, action) => {
  const {type, payload} = action;
  switch (type) {
    case SET_GOODS_ITEM:
      return state.setIn(["goodsList", payload.index], payload.item);
    case SET_GOODS_COUNT:
      return state.set("goodsCount", payload);
    case SET_GOODS_TOTAL_PRICE:
      return state.set("goodsTotalPrice", payload);
    case DELETE_GOODS_ITEM:
      return state.set("goodsList", state.get("goodsList").delete(payload));
    case CLEAR_ALL_GOODS:
      return state.set("goodsList", fromJS([]));
    default:
      return state;
  }
};
