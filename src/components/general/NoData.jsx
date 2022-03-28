import React from "react";
import "../css/NoData.less";

const NoData = props => {
  const {children, customStyle = {}} = props;
  return (
    <div className="no-data" style={customStyle}>
      {children || "暂无内容"}
    </div>
  );
};

export default React.memo(NoData);
