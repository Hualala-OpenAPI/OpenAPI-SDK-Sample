import {fromJS} from "immutable";
import {parseJson} from "../Utils";
import store from "../store";

export default class OriginShopController {
  // todo 过滤基础商品数据
  static filterItem(item) {
    const units = item.units.map(unitItem => this.filterUnit(unitItem));
    return {
      foodId: item.foodID,
      foodID: item.foodID,
      id: item.foodID,
      name: item.foodName,
      catalogId: item.foodCategoryID,
      catalogName: item.foodCategoryName,
      isBatching: 0, // 普通菜
      isActive: item.isActive === "true", // 是否启动
      isOpen: item.isOpen === "true", // 是否上架
      batchingFoodJson: parseJson(item.batchingFoodJson), // 配菜信息json
      isDiscount: item.isDiscount === "true" ? 1 : 0, // 是否打折
      takeoutPackagingFee: item.takeoutPackagingFee, // 打包费
      isSetFood: item.isSetFood === "true" ? 1 : 0, // 是否是套餐
      setFoodDetailJson: this.filterCombo(item.setFoodDetailJson), // 套餐明细
      tasteGroupList: parseJson(item.tasteGroupList),
      makingMethodGroupList: parseJson(item.makingMethodGroupList),
      units, // 规格数组
      minOrderCount: Number(item.minOrderCount) || 1, // 起售份数
      batchingFoodTagID: Number(item.batchingFoodTagID) // 配料标签ID
    };
  }

  // 过滤单位
  static filterUnit(item) {
    return {
      id: item.unitKey,
      name: item.unit,
      price: Number(item.price),
      count: 0,
      originPrice: Number(item.originalPrice)
    };
  }

  // 过滤分类
  static filterCatalog(item) {
    return {
      id: item.foodCategoryID,
      name: item.foodCategoryName
    };
  }

  // 过滤初始的套餐
  static filterCombo(json) {
    const newJson = parseJson(json);
    if (newJson) {
      const combo = fromJS(newJson).toJS();
      combo.foodLst = combo.foodLst.map(item => {
        return {
          ...item,
          items: item.items.map(subItem => this.filterSubComboItem(subItem))
        };
      });
      return combo;
    }
    return null;
  }

  static filterSubComboItem(item) {
    return fromJS({
      ...item,
      isBatching: 0,
      isSetFood: 1,
      isSFDetail: 1,
      isSelected: item.selected === "1",
      sideDish: [],
      taste: [],
      make: []
    }).toJS();
  }

  // todo 根据batchingFoodTagID获取相应的配菜列表
  static getSideDishByFoodTagId(foodTagId) {
    const originGoodsList = store.getState().common.get("originGoodsList").toJS();
    const foodTags = store.getState().common.get("foodTags").toJS();
    const tagItem = foodTags.find(tagItem => tagItem.itemID === foodTagId && tagItem.isActive === "true");
    const subGoodsArr = tagItem?.foodIDs.split(",") || [];
    let sideDishList = [];
    subGoodsArr.map(subGoodsItem => {
      const tempSubGoodsItem = originGoodsList.find(goodsItem => goodsItem.id === subGoodsItem);
      if (tempSubGoodsItem) sideDishList.push(tempSubGoodsItem);
    });
    return sideDishList;
  }

  // todo 根据itemId获取源数据item
  static getItemById(itemId) {
    const originGoodsList = store.getState().common.get("originGoodsList").toJS();
    return originGoodsList.find(item => item.id === itemId);
  }
}
