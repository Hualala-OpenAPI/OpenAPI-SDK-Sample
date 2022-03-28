import React, {useEffect, useState} from "react";
import ApiItem from "./ApiItem";
import "../css/ApiList.less";

const ApiList = props => {
  const {items = []} = props;
  const [apiLength, updateApiLength] = useState(items.length);

  useEffect(() => {
    updateApiLength(items.length);
  }, [items]);

  return (
    <div className="api-list">
      <div className="title">当前页面已使用的接口({apiLength})如下:</div>
      {items?.map((item, index) => {
        return <ApiItem key={index} {...item} />;
      })}
    </div>
  );
};

export default React.memo(ApiList);
