import React, {useState} from "react";
import {Button} from "antd-mobile";
import {Popup} from "antd-mobile-v5";
import {connect} from "react-redux";
import {addGoodsItem} from "../../store/actions/Shop";
import ShopPicker from "./ShopPicker";
import ShopController from "../../controllers/ShopController";
import "./css/ShopDetailItem.less";

const ShopDetailItem = props => {
  const {item} = props;
  const firstUnit = item.units[0];
  const [pickerVisible, updatePickerVisible] = useState(false);

  const addClick = () => {
    props.addGoodsItem(ShopController.filterGoodsItem(item, {unit: firstUnit, count: item.minOrderCount}));
  };
  const getMinPrice = () => {
    let price = firstUnit.price;
    item.units.map(unitItem => {
      if (unitItem.price < price) price = unitItem.price;
    });
    // todo 可以选择额外商品时显示最低价格
    if (item.setFoodDetailJson || item.batchingFoodTagID > 0 || item.units.length > 1) {
      return `￥${price}起`;
    }
    return `￥${price}`;
  };

  const renderRemainTotal = () => {
    if (firstUnit.total <= 10) {
      return <span> (剩余{firstUnit.total})</span>;
    }
    return null;
  };

  const hasRemain = () => {
    return !item.units.every(unitItem => unitItem.hasOwnProperty("total") && unitItem.total <= item.minOrderCount);
  };
  return (
    <div className="shop-detail-item">
      <div className="name">{item.name}</div>

      <div className="row">
        <div className="price">{getMinPrice()}</div>

        {!hasRemain() ? (
          <Button className="btn" type="primary" size="small" disabled>
            已售罄
          </Button>
        ) : item.isSetFood && item.setFoodDetailJson ? (
          <Button className="btn" type="primary" size="small" onClick={() => updatePickerVisible(true)}>
            <>选择套餐{renderRemainTotal()}</>
          </Button>
        ) : item.batchingFoodTagID > 0 ? (
          <Button className="btn" type="primary" size="small" onClick={() => updatePickerVisible(true)}>
            <>选择配菜{renderRemainTotal()}</>
          </Button>
        ) : hasRemain() && item.units.length > 1 ? (
          <Button className="btn" type="primary" size="small" onClick={() => updatePickerVisible(true)}>
            选择规格
          </Button>
        ) : item.tasteGroupList?.length || item.makingMethodGroupList?.length ? (
          <Button className="btn" type="primary" size="small" onClick={() => updatePickerVisible(true)}>
            选择口味和做法
          </Button>
        ) : (
          <Button className="btn" type="primary" size="small" onClick={addClick}>
            <>
              {item.minOrderCount > 1 ? `${item.minOrderCount}${firstUnit.name}起售` : "+"}
              {renderRemainTotal()}
            </>
          </Button>
        )}
      </div>

      <Popup
        visible={pickerVisible}
        destroyOnClose
        getContainer={document.getElementById("mainContainer")}
        onMaskClick={() => updatePickerVisible(false)}
      >
        {pickerVisible ? <ShopPicker item={item} onFinished={() => updatePickerVisible(false)} /> : null}
      </Popup>
    </div>
  );
};
const mapDispatchToProps = {
  addGoodsItem
};
export default React.memo(connect(null, mapDispatchToProps)(ShopDetailItem));
