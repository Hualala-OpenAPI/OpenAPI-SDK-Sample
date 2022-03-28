import React, {useEffect, useState} from "react";
import "../css/ShopCatalog.less";

const ShopCatalog = props => {
  const {data} = props;
  const [curCatalog, updateCurCatalog] = useState(data[0]?.id);

  useEffect(() => {
    if (curCatalog) props.onChange(curCatalog);
  }, [curCatalog]);

  return (
    <div className="shop-catalog">
      <div className="shop-catalog-container">
        {data.map(item => {
          return (
            <div
              className={`shop-catalog-item ${curCatalog === item.id ? "catalog-item-active" : ""}`}
              key={item.id}
              onClick={() => updateCurCatalog(item.id)}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(ShopCatalog);
