import {nanoid} from "nanoid";
import {fromJS, List} from "immutable";
import {filterAmount, showToast} from "../Utils";
import store from "../store";

export default class ShopController {
  // todo 过滤首次加入购物车的商品
  static filterGoodsItem(item, options = {}) {
    const {unit, sideDish, taste, make, combo, count} = options;
    const defaultItem = {
      ...item,
      id: nanoid(),
      count: count || item.minOrderCount || item.count || 1,
      price: 0
    };
    const SFMUnitCode = nanoid(12);
    if (unit) {
      defaultItem.unit = fromJS(unit).toJS();
      defaultItem.price = filterAmount(defaultItem.price + unit.price);
    }
    // todo 配菜  配菜不展示口味和做法 只有主菜展示
    if (sideDish && sideDish.length) {
      defaultItem.SFMUnitCode = SFMUnitCode;
      defaultItem.isBatching = 1;
      defaultItem.sideDish = sideDish.map(sideDishItem => {
        return this.returnNewItem(sideDishItem, {
          items: sideDishItem.items.map(subSideDishItem => {
            return this.returnNewItem(subSideDishItem, {
              isBatching: 2,
              SFMUnitCode
            });
          })
        });
      });
      defaultItem.price = filterAmount(defaultItem.price + this.getSideDishPrice(defaultItem.sideDish));
    }
    // todo 口味
    if (taste && taste.length) {
      defaultItem.taste = [].concat(taste);
    }
    // todo 做法 做法分为普通做法和特殊做法 普通做法免费在make里,特殊做法收费在extraMake里
    if (make && make.length) {
      defaultItem.make = this.filterMake(make);
      defaultItem.extraMake = this.filterExtraMake(make, defaultItem.unit?.name, {
        isBatching: 3,
        SFMUnitCode
      });
      defaultItem.price = filterAmount(defaultItem.price + this.getMakePrice(make, "filterGoods"));
    }

    // todo 套餐
    if (combo) {
      defaultItem.SFMUnitCode = SFMUnitCode;
      defaultItem.isSetFood = 1;
      defaultItem.isSFDetail = 0;
      // todo 筛选出套餐里被选择的套餐明细
      defaultItem.combo = fromJS(combo).toJS();
      defaultItem.combo.items = combo.items.filter(comboItem => comboItem.isSelected);
      defaultItem.combo.items = defaultItem.combo.items.map(comboItem => {
        defaultItem.price = filterAmount(defaultItem.price + Number(comboItem.addPrice));

        const comboItemOptions = {
          SFMUnitCode
        };
        if (comboItem?.sideDish?.length && this.hasSideDish(comboItem.sideDish)) {
          defaultItem.isBatching = 1;
          defaultItem.promoteTags = SFMUnitCode;
          defaultItem.childPromotionTags = SFMUnitCode;

          comboItemOptions.promoteTags = nanoid(12);
          comboItemOptions.childPromotionTags = defaultItem.promoteTags;
          comboItemOptions.sideDish = comboItem.sideDish.map(sideDishItem => {
            return this.returnNewItem(sideDishItem, {
              items: sideDishItem.items.map(subSideDishItem => {
                return this.returnNewItem(subSideDishItem, {
                  isBatching: 2,
                  isSFDetail: 0,
                  SFMUnitCode,
                  promoteTags: nanoid(12),
                  childPromotionTags: comboItemOptions.promoteTags
                });
              })
            });
          });
          defaultItem.price = filterAmount(defaultItem.price + this.getSideDishPrice(comboItem.sideDish));
        }
        if (comboItem?.make?.length) {
          comboItemOptions.extraMake = this.filterExtraMake(comboItem.make, comboItem.unit, {
            isBatching: 3,
            isSFDetail: 0,
            SFMUnitCode,
            promoteTags: nanoid(12),
            childPromotionTags: comboItemOptions.promoteTags
          });
          comboItemOptions.make = this.filterMake(comboItem.make);
          defaultItem.price = filterAmount(defaultItem.price + this.getMakePrice(comboItem.make, "filterGoods"));
        }
        return this.returnNewItem(comboItem, comboItemOptions);
      });
    }
    return defaultItem;
  }

  /**
   * @description 返回一个新的item
   * @param item 源item
   * @param options 额外的属性
   * @return 返回一个合并了item和options的newItem
   */
  static returnNewItem(item, options = {}) {
    return {
      ...item,
      ...options
    };
  }

  static filterMake(make) {
    return make.map(makeItem => {
      return {
        ...makeItem,
        items: makeItem.items.filter(subMakeItem => {
          return subMakeItem.addPriceType === 0;
        })
      };
    });
  }

  // todo 筛选出需要加价的做法
  static filterExtraMake(make, unitName, options = {}) {
    let arr = [];
    const peopleNum = store.getState().common.getIn(["moduleConfig", "peopleNum"]);
    make.map(makeItem => {
      makeItem.items.map(subMakeItem => {
        const type = Number(subMakeItem.addPriceType);
        const price = Number(subMakeItem.addPriceValue);
        if (type === 0) return false;
        arr.push({
          ...subMakeItem,
          name: subMakeItem.notesName,
          unit: this.getMakeUnit(subMakeItem, unitName, "pure"),
          count: type === 1 ? 1 : type === 3 ? peopleNum : 1,
          price,
          ...options
        });
      });
    });
    return arr;
  }

  /**
   * @description 查找item是否在购物车中 如果存在返回index
   * todo 判断维度:
   *  同一商品:foodId
   *  同一规格:unitId
   */
  static findGoodsIndex(item, data) {
    const verifyObject = {
      foodId: false,
      unitId: false
    };
    const {
      unit: {id: unitId},
      foodId
    } = item;
    if (item.hasOwnProperty("sideDish")) verifyObject.hasSideDish = false;
    if (item.hasOwnProperty("combo")) verifyObject.combo = false;
    if (item.hasOwnProperty("taste")) verifyObject.taste = false;
    if (item.hasOwnProperty("make")) verifyObject.make = false;
    return data.findIndex(dataItem => {
      const {
        unit: {id: oldUnitId},
        foodId: oldFoodId
      } = dataItem;
      verifyObject.foodId = foodId === oldFoodId;
      verifyObject.unitId = unitId === oldUnitId;
      return Object.values(verifyObject).every(verifyItem => verifyItem);
    });
  }

  static findGoodsIndexById(id, data) {
    return data.findIndex(item => item.id === id);
  }

  static verifySubGoodsInGoods(subGoods, oldSubGoods) {
    if (!subGoods || !oldSubGoods || subGoods.length !== oldSubGoods.length) return false;
    const findIds = function (items) {
      return items.map(item => {
        return item.unit.id;
      });
    };
    const subGoodsArr = findIds(subGoods);
    const oldSubGoodsArr = findIds(oldSubGoods);
    return subGoodsArr.length === oldSubGoodsArr.length && subGoodsArr.filter(item => !oldSubGoodsArr.includes(item)).length === 0;
  }

  static verifyComboInGoods(combo, oldCombo) {
    if (!combo || !oldCombo) return false;
    const {items: comboItems} = combo;
    const {items: oldComboItems} = oldCombo;
    const findIds = function (items) {
      let arr = [];
      items.map(item => {
        arr.push(item.foodID);
        if (item.subGoods) {
          item.subGoods.map(subGoodsItem => {
            arr.push(subGoodsItem.unit.id);
          });
        }
      });
      return arr;
    };
    const comboArr = findIds(comboItems);
    const oldComboArr = findIds(oldComboItems);
    // todo 两个comboItems长度相等 && 数组内的值相同,顺序无所谓
    return comboArr.length === oldComboArr.length && comboArr.filter(item => !oldComboArr.includes(item)).length === 0;
  }

  // todo 计算小分类需要额外显示的提示信息
  //    例如某个配菜需要提示必选1个菜品
  static renderSubtitleTips(item) {
    // limit notLimit 不限 mandatoryLimit 数量必选 rangeLimit 数量范围
    const {limit, maxNum, minNum} = item;

    switch (limit) {
      case "mandatoryLimit":
        return `(必选${maxNum})`;
      case "rangeLimit":
        return `(区间${minNum}-${maxNum})`;
      default:
        return "";
    }
  }

  // todo 查找默认加入的配菜
  static findDefaultSideDish(item) {
    const {joinFood = []} = item;
    const originGoodsList = store.getState().common.get("originGoodsList");
    let joinArr = [];
    joinFood.map(foodItem => {
      const index = originGoodsList.toJS().findIndex(goodsItem => goodsItem.foodID === foodItem.foodID);
      if (index <= 0) return false;
      const targetItem = originGoodsList.get(index).toJS();
      if (targetItem.units.length === 1) {
        joinArr.push(ShopController.filterGoodsItem(targetItem, {unit: targetItem.units[0]}));
      }
    });

    return joinArr;
  }

  // todo 配菜选择完成的回调
  static subGoodsSelected(options = {}) {
    const {parentItem, childrenItems, curChildrenItem, curChildrenIndex, noRepeatableSelect = false, tipName} = options;
    const {limit} = parentItem;
    const maxNum = Number(parentItem.maxNum);
    const minNum = Number(parentItem.minNum);
    let items = List(childrenItems);

    if (curChildrenIndex >= 0) {
      return items.delete(curChildrenIndex).toJS();
    }

    // 数量范围
    if (limit === "rangeLimit") {
      // 不允许选择重复配菜
      if (items.size < maxNum && noRepeatableSelect) {
        const isExist = items.some(oldItem => oldItem.foodID === curChildrenItem.foodID);
        if (isExist) {
          showToast({content: `${tipName}不允许选择重复菜品`, icon: "fail"});
          return false;
        }
      }
      if (items.size >= maxNum) {
        showToast({content: `${tipName}选择范围${minNum}-${maxNum}`, icon: "fail"});
        return false;
      }
    }

    items = items.push(curChildrenItem);
    // 数量必选
    if (limit === "mandatoryLimit" && items.size > maxNum) {
      items = items.shift();
    }
    return items.toJS();
  }

  /**
    @description 展示商品目前的最新价格
   @param unit 已选择的规格
   @param sideDish 已选择的配菜
   @param combo 已选择的套餐
   @param makingMethod 已选择的做法
	 */
  static getTotalPrice(unit, sideDish, combo, makingMethod) {
    let price = 0;
    // 规格
    if (unit) price = filterAmount(price + unit.price);
    // 配菜
    if (sideDish) {
      price = filterAmount(price + this.getSideDishPrice(sideDish));
    }
    // 套餐
    if (combo) {
      combo.items.map(comboItem => {
        if (!comboItem.isSelected) return false;
        price = filterAmount(price + Number(comboItem.addPrice));
        price = filterAmount(price + this.getSideDishPrice(comboItem.sideDish));
        price = filterAmount(price + this.getMakePrice(comboItem.make));
      });
    }
    // 做法
    if (makingMethod) {
      price = filterAmount(price + this.getMakePrice(makingMethod));
    }
    return price;
  }

  static getSideDishPrice(sideDish) {
    let price = 0;
    sideDish.map(sideDishItem => {
      sideDishItem.items.map(subSideDishItem => {
        price = filterAmount(price + subSideDishItem.price * subSideDishItem.count);
      });
    });
    return price;
  }

  /**
   * @description 获取做法的价格
   * @param make
   * @param index
   * @param addNumber
   * */
  static getExtraMakePrice(make, index, addNumber) {
    let price = 0;
    make?.map(makeItem => {
      const {addPriceType} = makeItem;
      // 按数量计算
      if (addPriceType === 2) {
        price = filterAmount(price + makeItem.price * addNumber);
      }
      // 1,3根据单个商品首次加购时计算 跟数量无关
      if (addPriceType !== 2 && index < 0) {
        if (addPriceType === 3) {
          const peopleNum = store.getState().common.getIn(["moduleConfig", "peopleNum"]);
          price = filterAmount(price + makeItem.price * peopleNum);
        } else {
          price = filterAmount(price + makeItem.price);
        }
      }
    });
    return price;
  }

  /**
   * @description 获取相应做法的价格
   * @param make
   * @param type 用来判断是否是加入购物车时获取的价格 如果加购时 只计算按数量加价的做法  其余的在add方法计算
   * */

  static getMakePrice(make, type) {
    const peopleNum = store.getState().common.getIn(["moduleConfig", "peopleNum"]);
    const setPrice = item => {
      const addPriceValue = Number(item.addPriceValue);
      const addPriceType = Number(item.addPriceType);
      // 1 固定价格 2 按数量加价 3 按人加价
      if (addPriceType === 1 && type !== "filterGoods") return addPriceValue;
      if (addPriceType === 2 && type !== "filterGoods") return addPriceValue;
      if (addPriceType === 3 && type !== "filterGoods") return peopleNum * addPriceValue;
      return 0;
    };
    let price = 0;
    make.map(item => {
      item.items.map(subItem => {
        price = filterAmount(price + setPrice(subItem));
      });
    });

    return price;
  }

  // todo 获取做法的单位
  //   根据type 返回不同样式的单位 默认带数量 type=pure返回纯净单位
  static getMakeUnit(item, comboItemUnit, type) {
    const peopleNum = store.getState().common.getIn(["moduleConfig", "peopleNum"]);
    const {addPriceType} = item;
    switch (addPriceType) {
      case 1: // 固定价格
        return type === "pure" ? "项" : "(1项)";
      case 2: // 按数量加价
        return type === "pure" ? comboItemUnit : `(1${comboItemUnit})`;
      case 3: // 按人加价
        return type === "pure" ? "位" : `(${peopleNum}位)`;
      default:
        return "";
    }
  }

  // todo 判断sideDish是否存在
  static hasSideDish(sideDish) {
    if (!sideDish || !sideDish.length) return false;
    return sideDish.every(sideDishItem => sideDishItem.items.length);
  }
}
