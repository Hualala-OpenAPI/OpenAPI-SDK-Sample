import React, {useEffect, useState} from "react";
import ShopTagItem from "./components/ShopTagItem";
import ShopController from "../../controllers/ShopController";
import OriginShopController from "../../controllers/OriginShopController";

const ShopSideDish = props => {
  const {item, prefixTitle, onChange} = props;
  const {batchingFoodTagID, batchingFoodTagName = "配料"} = item;
  const [subGoodsList, updateSubGoodsList] = useState([]);
  const [selectedSubGoodsList, updateSelectedSubGoodsList] = useState([]);
  useEffect(() => {
    const defaultSelectedList = ShopController.findDefaultSideDish(item);
    if (defaultSelectedList.length) {
      updateSelectedSubGoodsList(defaultSelectedList);
    }
  }, []);
  // todo 拿到属于当前主菜的配菜
  useEffect(() => {
    if (batchingFoodTagID > 1) {
      updateSubGoodsList(OriginShopController.getSideDishByFoodTagId(batchingFoodTagID));
    }
  }, [batchingFoodTagID]);

  useEffect(() => {
    onChange({...item, items: selectedSubGoodsList});
  }, [selectedSubGoodsList]);

  const subGoodsSelected = (sideDishItem, unitItem) => {
    updateSelectedSubGoodsList(prevList => {
      const newItem = ShopController.filterGoodsItem(sideDishItem, {
        unit: unitItem
      });
      const curChildrenIndex = prevList.findIndex(cSubGoodsItem => cSubGoodsItem?.unit?.id === newItem.unit.id);

      const newItems = ShopController.subGoodsSelected({
        parentItem: item,
        childrenItems: prevList,
        curChildrenItem: newItem,
        curChildrenIndex,
        tipName: item.batchingFoodTagName,
        noRepeatableSelect: item.noRepeatableSelect
      });
      if (newItems) return newItems;
      return prevList;
    });
  };

  return (
    <div>
      <div className="sub-title">
        {prefixTitle || ""}
        {batchingFoodTagName}
        <span className="tips">{ShopController.renderSubtitleTips(item)}</span>
      </div>
      <div className="tag-container">
        {subGoodsList.map(subGoodsItem => {
          return subGoodsItem.units.map(subUnitItem => {
            return (
              <ShopTagItem
                name={subGoodsItem.name}
                unit={subUnitItem.name}
                price={subUnitItem.price}
                isActive={selectedSubGoodsList.some(selectItem => selectItem?.unit?.id === subUnitItem.id)}
                key={subUnitItem.id}
                onSelected={() => subGoodsSelected(subGoodsItem, subUnitItem)}
              />
            );
          });
        })}
      </div>
    </div>
  );
};

export default React.memo(ShopSideDish);
