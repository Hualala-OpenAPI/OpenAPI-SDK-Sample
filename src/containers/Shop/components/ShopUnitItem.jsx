import React from "react";
import "../css/ShopTagItem.less";

const ShopUnitItem = props => {
  const {item, curId, onSelected} = props;
  const {id, name, price, total} = item;
  const renderRemainTotal = () => {
    if (total <= 0) {
      return <span> (售罄)</span>;
    }
    if (total <= 10) {
      return <span> (剩余{total})</span>;
    }
    return null;
  };
  const handleOnClick = () => {
    if (total <= 0) return false;
    onSelected(item);
  };
  return (
    <div className={`tag-item ${curId === id ? "tag-item-active" : ""} ${total <= 0 ? "tag-item-disabled" : ""}`} onClick={handleOnClick}>
      {name}
      {price ? <>￥{price}</> : null}
      {renderRemainTotal()}
    </div>
  );
};

export default React.memo(ShopUnitItem);
