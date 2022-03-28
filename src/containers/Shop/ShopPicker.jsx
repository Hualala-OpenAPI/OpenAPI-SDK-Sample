import React, {useRef, useState} from "react";
import {Button} from "antd-mobile";
import {connect} from "react-redux";
import {List} from "immutable";
import ShopUnitItem from "./components/ShopUnitItem";
import {addGoodsItem} from "../../store/actions/Shop";
import ShopController from "../../controllers/ShopController";
import ShopPickerHeader from "./components/ShopPickerHeader";
import ShopCombo from "./components/ShopCombo";
import ShopSideDish from "./ShopSideDish";
import ShopPickerController from "../../controllers/ShopPickerController";
import ShopTaste from "./components/ShopTaste";
import "./css/ShopPicker.less";
import {showToast} from "../../Utils";

const ShopPicker = props => {
  const {item} = props;
  const controller = useRef(new ShopPickerController(item));
  const {units = [], batchingFoodJson, name, minOrderCount, tasteGroupList, makingMethodGroupList, setFoodDetailJson} = item;
  const [curUnit, updateCurUnit] = useState(controller.current.findFirstUnit());
  const [sideDish, updateSideDish] = useState([]);
  const [curCombo, updateCurCombo] = useState(null);
  const [count, updateCount] = useState(minOrderCount);
  const [tasteInfo, updateTasteInfo] = useState([]);
  const [makingMethod, updateMakingMethod] = useState([]);

  const handleOnOk = () => {
    if (!controller.current.verifyAdd(sideDish, curCombo, tasteInfo, makingMethod)) {
      return false;
    }
    props.addGoodsItem(
      ShopController.filterGoodsItem(item, {
        unit: curUnit,
        sideDish,
        combo: curCombo,
        taste: tasteInfo,
        make: makingMethod,
        count
      })
    );
    props.onFinished();
  };

  const subtract = () => {
    if (count <= minOrderCount) return false;
    updateCount(count - minOrderCount);
  };

  // todo 配菜选择完成
  const sideDishSelectedFinished = sideDishItem => {
    updateSideDish(prevSideDish => {
      return InfoSelectedFinished(prevSideDish, sideDishItem, "batchingFoodTagID");
    });
  };

  const handleAdd = () => {
    if (count + minOrderCount > curUnit?.total) {
      showToast({content: "数量不足", icon: "fail"});
      return false;
    }
    updateCount(count + minOrderCount);
  };

  const tasteSelectedFinished = (type, tasteItem) => {
    if (type === "taste") {
      updateTasteInfo(prevTasteInfo => {
        return InfoSelectedFinished(prevTasteInfo, tasteItem, "groupName");
      });
    }
    if (type === "make") {
      updateMakingMethod(prevTasteInfo => {
        return InfoSelectedFinished(prevTasteInfo, tasteItem, "groupName");
      });
    }
  };

  const InfoSelectedFinished = (info, infoItem, subKey) => {
    let newInfo = List(info);
    const index = newInfo.findIndex(oldSideDishItem => oldSideDishItem[subKey] === infoItem[subKey]);
    if (index >= 0) {
      return newInfo.set(index, infoItem).toJS();
    }
    return newInfo.push(infoItem).toJS();
  };

  return (
    <div className="shop-picker">
      <ShopPickerHeader
        name={name}
        price={ShopController.getTotalPrice(curUnit, sideDish, curCombo, makingMethod)}
        count={count}
        subtract={subtract}
        add={handleAdd}
      />
      <div className="content-container">
        {setFoodDetailJson ? <ShopCombo setFoodDetailJson={setFoodDetailJson} onChange={updateCurCombo} /> : null}

        {units.length > 1 ? (
          <>
            <div className="sub-title">规格</div>
            <div className="tag-container">
              {units.map(unitItem => {
                return <ShopUnitItem item={unitItem} curId={curUnit?.id} key={unitItem.id} onSelected={updateCurUnit} />;
              })}
            </div>
          </>
        ) : null}

        {batchingFoodJson?.length
          ? batchingFoodJson.map(batchItem => {
              return <ShopSideDish key={batchItem.batchingFoodTagID} item={batchItem} onChange={sideDishSelectedFinished} />;
            })
          : null}

        {tasteGroupList && tasteGroupList.length
          ? tasteGroupList.map((tasteItem, tasteIndex) => {
              return <ShopTaste key={tasteIndex} item={tasteItem} onSelected={tasteItem => tasteSelectedFinished("taste", tasteItem)} />;
            })
          : null}

        {makingMethodGroupList && makingMethodGroupList.length
          ? makingMethodGroupList.map((tasteItem, tasteIndex) => {
              return <ShopTaste key={tasteIndex} item={tasteItem} onSelected={makeItem => tasteSelectedFinished("make", makeItem)} />;
            })
          : null}
      </div>
      <Button className="btn" type="primary" onClick={handleOnOk}>
        加入购物车
      </Button>
    </div>
  );
};
const mapDispatchToProps = {
  addGoodsItem
};
export default React.memo(connect(null, mapDispatchToProps)(ShopPicker));
