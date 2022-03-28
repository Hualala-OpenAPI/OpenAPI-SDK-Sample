import React from "react";
import "../css/ShopTagItem.less";

const ShopTagItem = props => {
  const {name, unit, price, isActive, desc, onSelected} = props;

  return (
    <div className={`tag-item ${isActive ? "tag-item-active" : ""}`} onClick={onSelected}>
      {name}
      <div className="sub-info">
        {Number(price) ? <span>￥{price}</span> : null}
        {price && unit ? "/" : null}
        {unit ? <span>{unit}</span> : null}
        {desc || null}
      </div>
    </div>
  );
};

export default React.memo(ShopTagItem);
