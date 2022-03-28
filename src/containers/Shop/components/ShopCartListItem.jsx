import React, {Fragment} from "react";
import {Button} from "antd-mobile";
import "../css/ShopCartListItem.less";
import {nanoid} from "nanoid";
import {filterAmount, showToast} from "../../../Utils";

const ShopCartListItem = props => {
  const {item, add, subtract} = props;
  const renderCombo = data => {
    return (
      <>
        {data.items.map((comboItem, comboIndex) => {
          const {foodName, addPrice, number, unit, sideDish, taste, make, extraMake} = comboItem;
          return (
            <Fragment key={comboIndex}>
              {renderItem({
                name: foodName,
                price: addPrice,
                count: number,
                unit,
                isSub: true,
                taste,
                make,
                sideDish,
                extraMake
              })}
            </Fragment>
          );
        })}
      </>
    );
  };
  const renderSideDish = data => {
    return data?.map(sideDishItem => {
      return sideDishItem.items?.map((subSideDishItem, subSideDishIndex) => {
        const {name, price, count, unit} = subSideDishItem;
        return renderItem({name, price, count, unit: unit?.name, isSub: true}, subSideDishIndex);
      });
    });
  };
  // 口味
  const renderTaste = (text, tasteData) => {
    if (!tasteData.length) return null;
    if (!tasteData.some(tasteItem => tasteItem.items.length)) return null;
    return (
      <div>
        {text}:
        {tasteData.map(tasteItem => {
          if (!tasteItem.items.length) return null;
          return tasteItem.items.map((tasteSubItem, tasteSubIndex) => {
            return <span key={tasteSubIndex}>{tasteSubItem.notesName},</span>;
          });
        })}
      </div>
    );
  };
  const renderExtraMake = data => {
    return data?.map((extraMakeItem, extraMakeIndex) => {
      const {name, price, count, unit, addPriceType} = extraMakeItem;
      return renderItem(
        {
          name,
          price,
          count,
          unit,
          isSelfCount: addPriceType !== 2,
          isMake: true,
          isSub: true
        },
        extraMakeIndex
      );
    });
  };
  const handleAdd = () => {
    const {unit, count, minOrderCount} = item;
    if (unit.hasOwnProperty("total") && count + minOrderCount > unit.total) {
      showToast({content: "数量不足", icon: "fail"});
      return false;
    }
    add(item, 1, "cart");
  };

  const renderItem = (itemData, key = nanoid()) => {
    const {name, count, unit, price, isSub, taste, make, sideDish, extraMake, combo, isSelfCount = false, isMake = false} = itemData;
    const newCount = isSelfCount ? count : item.count;
    return (
      <div key={key} className={`item ${isSub ? "sub-item" : ""}`}>
        <div className="row">
          <div className="name">
            {isMake ? "[做法]" : ""}
            {name}
          </div>
          <div className="right-row">
            <div className="count">
              {newCount}/{unit}
            </div>
            <div className="price">{Number(price) ? `￥${filterAmount(newCount * price)}` : null}</div>
          </div>
        </div>
        <div className="remark">
          {taste ? renderTaste("口味", taste) : null}
          {make ? renderTaste("做法", make) : null}
        </div>
        {combo ? renderCombo(combo) : null}
        {sideDish ? renderSideDish(sideDish) : null}
        {extraMake ? renderExtraMake(extraMake) : null}
      </div>
    );
  };
  return (
    <div className="shop-card-list-item">
      <div className="left-container">
        {renderItem({
          name: item.name,
          count: item.count,
          unit: item.unit?.name,
          price: item.unit?.price,
          taste: item.taste,
          make: item.make,
          sideDish: item.sideDish,
          extraMake: item.extraMake,
          combo: item.combo
        })}
      </div>
      <div className="right-operation">
        <Button className="btn" type="warning" onClick={() => subtract(item)}>
          -
        </Button>
        <span className="count">{item.count}个</span>
        <Button className="btn" type="primary" onClick={handleAdd}>
          +
        </Button>
      </div>
    </div>
  );
};

export default React.memo(ShopCartListItem);
