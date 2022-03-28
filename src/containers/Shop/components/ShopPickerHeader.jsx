import React from "react";

const ShopPickerHeader = props => {
  const {name, price, count, subtract, add} = props;

  return (
    <>
      <div className="row">
        <div className="name">{name}</div>
        <span className="price">￥{price}</span>
      </div>
      <div className="row">
        <div className="sub-title">数量</div>
        <div className="operation">
          <div onClick={subtract}>-</div>
          <div className="count">{count}</div>
          <div onClick={add}>+</div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ShopPickerHeader);
