import React, {useEffect, useState} from "react";
import ShopTagItem from "./ShopTagItem";
import ShopController from "../../../controllers/ShopController";

const ShopTaste = props => {
  const {item, prefixTitle, onSelected} = props;
  const {groupName, detailList} = item;
  const [selectedItems, updateSelectedItems] = useState([]);

  useEffect(() => {
    initSelected();
  }, []);

  useEffect(() => {
    onSelected({...item, items: selectedItems});
  }, [selectedItems]);

  const initSelected = () => {
    let arr = [];
    item.detailList.map(subItem => {
      if (subItem.isDefault === "1") arr.push(subItem);
    });
    updateSelectedItems(arr);
  };
  const handleOnSelected = detailItem => {
    updateSelectedItems(prevList => {
      const curChildrenIndex = prevList.findIndex(childrenItem => childrenItem?.notesName === detailItem?.notesName);

      const newList = ShopController.subGoodsSelected({
        parentItem: item,
        childrenItems: prevList,
        curChildrenItem: detailItem,
        curChildrenIndex,
        tipName: item.groupName
      });
      if (newList) return newList;
      return prevList;
    });
  };
  return (
    <>
      <div className="sub-title">
        {prefixTitle || ""}
        {groupName}
        <span className="tips">{ShopController.renderSubtitleTips(item)}</span>
      </div>
      <div className="tag-container">
        {detailList?.map((detailItem, detailIndex) => {
          return (
            <ShopTagItem
              key={detailIndex}
              name={detailItem.notesName}
              price={detailItem.addPriceValue}
              isActive={selectedItems.some(subSelectedItem => subSelectedItem?.notesName === detailItem.notesName)}
              desc={detailItem.isRecommend === "1" ? "(推荐)" : ""}
              onSelected={() => handleOnSelected(detailItem)}
            />
          );
        })}
      </div>
    </>
  );
};

export default React.memo(ShopTaste);
