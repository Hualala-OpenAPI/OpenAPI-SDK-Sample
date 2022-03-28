import {fromJS} from "immutable";
import {
  COMMON_SET_FOOD_TAGS,
  COMMON_SET_GOODS_CATALOG,
  COMMON_SET_MODULE_CONFIG,
  COMMON_SET_ORDER_STATUS,
  COMMON_SET_ORIGIN_GOODS_LIST,
  COMMON_SET_PAYMENT_STATUS
} from "../Constants";
import Config from "../../Config";
import ShopService from "../../services/shop/ShopService";
import OriginShopController from "../../controllers/OriginShopController";

const setFoodTags = function (items) {
  return {
    type: COMMON_SET_FOOD_TAGS,
    payload: items
  };
};
const setGoodsCatalog = function (items) {
  return {
    type: COMMON_SET_GOODS_CATALOG,
    payload: items
  };
};
const setOriginGoodsList = function (items) {
  return {
    type: COMMON_SET_ORIGIN_GOODS_LIST,
    payload: items
  };
};

export function setModuleConfig(config) {
  return {
    type: COMMON_SET_MODULE_CONFIG,
    payload: config
  };
}

export function setPaymentStatus(status) {
  return {
    type: COMMON_SET_PAYMENT_STATUS,
    payload: status
  };
}

export const setOrderStatus = status => {
  return {
    type: COMMON_SET_ORDER_STATUS,
    payload: status
  };
};

function checkGoods(goodsList) {
  return new Promise(resolve => {
    const {groupId, shopId} = Config.info;
    ShopService.check({groupID: groupId, shopID: shopId}).then(res => {
      console.log("估清", res);
      const {code, data} = res;
      if (code !== "000") resolve(goodsList);
      if (!data.foodRemainInfo) resolve(goodsList);
      let list = fromJS(goodsList).toJS();
      data?.foodRemainInfo?.map(remainItem => {
        const goodsIndex = list.findIndex(goodsItem => goodsItem?.name === remainItem.foodName);
        let goodsItem = goodsIndex >= 0 ? fromJS(list[goodsIndex]).toJS() : {};
        goodsItem.units = goodsItem?.units?.map(unitItem => {
          if (unitItem.id === remainItem.unitkey) {
            return {
              ...unitItem,
              total: Number(remainItem.amount)
            };
          }
          return unitItem;
        });
        list[goodsIndex] = goodsItem;
      });
      resolve(list);
    });
  });
}

export function getGoodsList(params, cb) {
  return (dispatch, state) => {
    const originGoodsList = state().common.get("originGoodsList").toJS();
    if (originGoodsList.length) {
      //   // todo 如果商品列表已存在就只进行估清
      checkGoods(originGoodsList).then(goodsList => {
        dispatch(setOriginGoodsList(goodsList));
      });
      return false;
    }
    ShopService.index(params).then(res => {
      const {code, data} = res;
      console.log("菜品-", res);
      let catalogItems = [];
      if (code !== "000") return false;
      const footList = data.foodList.map(item => {
        if (!catalogItems.some(catalogItem => catalogItem.id === item.foodCategoryID)) {
          catalogItems.push(OriginShopController.filterCatalog(item));
        }
        return OriginShopController.filterItem(item);
      });
      checkGoods(footList).then(goodsList => {
        dispatch(setOriginGoodsList(goodsList));
        dispatch(setGoodsCatalog(catalogItems));
        dispatch(setFoodTags(data.foodTags));
        if (cb) cb(catalogItems);
      });
    });
  };
}
