import {fromJS} from "immutable";

export default class TableController {
  constructor() {
    this.isInit = false;
    this.items = [];
    this._subComboList = [];
    this._sideDishList = [];
  }

  init(data) {
    if (this.isInit) return false;
    this.isInit = true;
    data.map(item => {
      // 非套餐
      if (item.isSetFood === 0 && item.isSFDetail === 0) {
        // 普通菜
        if (item.isBatching === 0) this.items.push(item);
        // 主菜
        if (item.isBatching === 1) this.items.push(item);
      }
      // 配菜
      if (item.isBatching === 2 || item.isBatching === 3) this._sideDishList.push(item);

      // 套餐头
      if (item.isSetFood === 1 && item.isSFDetail === 0) this.items.push(item);
      // 套餐明细
      if (item.isSetFood === 1 && item.isSFDetail === 1) this._subComboList.push(item);
    });
  }

  getItems() {
    return fromJS(this.items).toJS();
  }

  // todo 根据主菜找配菜
  findSideDish(item) {
    const {sFMUnitCode, promoteTags} = item;
    if (promoteTags) {
      // 套餐里的主配菜
      return this._sideDishList.filter(subItem => subItem.sFMUnitCode === sFMUnitCode && promoteTags === subItem.childPromotionTags);
    }
    // 非套餐的主配菜
    return this._sideDishList.filter(subItem => subItem.sFMUnitCode === sFMUnitCode);
  }

  // todo 根据套餐头查找相应的套餐明细
  findSubCombo(item) {
    const {sFMUnitCode, promoteTags} = item;
    return this._subComboList.filter(subItem => {
      return subItem.isSFDetail === 1 && subItem.sFMUnitCode === sFMUnitCode && subItem.childPromotionTags === promoteTags;
    });
  }
}
