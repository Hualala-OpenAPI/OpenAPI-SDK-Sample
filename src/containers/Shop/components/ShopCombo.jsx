import React, {useEffect, useState} from "react";
import {fromJS} from "immutable";
import ShopSideDish from "../ShopSideDish";
import ShopTagItem from "./ShopTagItem";
import ShopTaste from "./ShopTaste";
import OriginShopController from "../../../controllers/OriginShopController";
import "../css/ShopCombo.less";
import {showToast} from "../../../Utils";

const ShopCombo = props => {
  const {setFoodDetailJson, onChange} = props;
  const {foodLst: foodList} = setFoodDetailJson;
  const [combo, updateCombo] = useState(foodList[0]);
  const [batchList, updateBatchList] = useState([]);
  const [tasteList, updateTasteList] = useState([]);
  const [makeList, updateMakeList] = useState([]);

  useEffect(() => {
    if (combo) {
      initSubInfo();
      onChange(combo);
    }
  }, [combo]);

  const subItemSelected = subIndex => {
    // todo 0不允许自选
    if (combo.canSwitch === "0") return false;
    const tempCombo = fromJS(combo).toJS();
    const curItem = tempCombo.items[subIndex];
    const selectedCount = tempCombo.items.filter(subItem => subItem.isSelected).length;
    if (curItem.isSelected) {
      tempCombo.items[subIndex].isSelected = false;
      if (curItem.subGoods) {
        tempCombo.items[subIndex].sideDish = [];
      }
    } else {
      if (selectedCount >= combo.chooseCount) {
        showToast({content: `套餐明细最多选择${combo.chooseCount}个`, icon: "fail"});
        return false;
      }
      tempCombo.items[subIndex].isSelected = true;
    }

    updateCombo(tempCombo);
  };

  // todo 选择套餐头后,初始化对应的套餐明细需要展示的内容 例如:配菜,口味,做法
  const initSubInfo = () => {
    let sideDishArr = [];
    let tasteArr = [];
    let makeArr = [];
    combo.items.map((item, index) => {
      if (item.isSelected) {
        const originItem = OriginShopController.getItemById(item.foodID);
        if (originItem && originItem.batchingFoodJson) {
          sideDishArr.push({
            comboSubIndex: index,
            comboSubItemName: item.foodName,
            items: originItem.batchingFoodJson
          });
        }
        if (originItem && originItem.tasteGroupList) {
          tasteArr.push({
            comboSubIndex: index,
            comboSubItemName: item.foodName,
            items: originItem.tasteGroupList
          });
        }
        if (originItem && originItem.makingMethodGroupList) {
          makeArr.push({
            comboSubIndex: index,
            comboSubItemName: item.foodName,
            items: originItem.makingMethodGroupList
          });
        }
      }
    });
    updateBatchList(sideDishArr);
    updateTasteList(tasteArr);
    updateMakeList(makeArr);
  };

  const infoSelectedFinished = (subItemIndex, selectedItem, type, findKey) => {
    updateCombo(preCombo => {
      const tempCombo = fromJS(preCombo);
      const typeInfo = tempCombo.getIn(["items", subItemIndex, type]).toJS();
      const selectedIndex = typeInfo.findIndex(typeInfoItem => typeInfoItem[findKey] === selectedItem[findKey]);
      if (selectedIndex >= 0) {
        typeInfo[selectedIndex] = selectedItem;
      } else {
        typeInfo.push(selectedItem);
      }
      return tempCombo.setIn(["items", subItemIndex, type], typeInfo).toJS();
    });
  };
  return (
    <div className="shop-combo">
      <div className="sub-title">套餐</div>
      <div className="tag-container">
        {foodList.map((comboItem, comboIndex) => {
          return (
            <ShopTagItem
              key={comboIndex}
              name={comboItem.foodCategoryName}
              isActive={comboItem.key === combo?.key}
              onSelected={() => updateCombo(comboItem)}
            />
          );
        })}
      </div>
      <div className="sub-title">
        {combo?.canSwitch === "1"
          ? `套餐明细(任选${combo.chooseCount})`
          : combo?.canSwitch === "2"
          ? "套餐明细(任选)"
          : "套餐明细(固定选择)"}
      </div>
      <div className="tag-container">
        {combo?.items?.map((subItem, subIndex) => {
          return (
            <ShopTagItem
              key={subIndex}
              name={subItem.foodName}
              price={subItem.addPrice}
              isActive={subItem.isSelected}
              onSelected={() => subItemSelected(subIndex)}
            />
          );
        })}
      </div>
      {batchList?.map(batchItem => {
        return batchItem?.items.map(subBatchItem => {
          return (
            <ShopSideDish
              key={subBatchItem.batchingFoodTagID}
              prefixTitle={`${batchItem.comboSubItemName}-`}
              item={subBatchItem}
              onChange={selectedItem => infoSelectedFinished(batchItem.comboSubIndex, selectedItem, "sideDish", "batchingFoodTagID")}
            />
          );
        });
      })}

      {tasteList?.map(tasteItem => {
        return tasteItem?.items.map((subTasteItem, subTasteIndex) => {
          return (
            <ShopTaste
              key={subTasteIndex}
              prefixTitle={`${tasteItem.comboSubItemName}-`}
              item={subTasteItem}
              onSelected={selectedItem => infoSelectedFinished(tasteItem.comboSubIndex, selectedItem, "taste", "groupName")}
            />
          );
        });
      })}

      {makeList?.map(makeItem => {
        return makeItem?.items.map((subMakeItem, subMakeIndex) => {
          return (
            <ShopTaste
              key={subMakeIndex}
              prefixTitle={`${makeItem.comboSubItemName}-`}
              item={subMakeItem}
              onSelected={selectedItem => infoSelectedFinished(makeItem.comboSubIndex, selectedItem, "make", "groupName")}
            />
          );
        });
      })}
    </div>
  );
};

export default React.memo(ShopCombo);
