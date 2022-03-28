import React from "react";
import {connect} from "react-redux";
import ApiList from "./components/ApiList";
import "./css/Logger.less";
import NoData from "../../components/general/NoData";

const Logger = props => {
  const {apiList} = props;
  return <div className="logger">{apiList?.length ? <ApiList items={apiList} /> : <NoData>暂无日志</NoData>}</div>;
};

const mapStateToProps = state => {
  const {pathname} = location;
  const apiList = state.api.getIn(["apiList", pathname])?.toJS();
  return {
    apiList: apiList || []
  };
};
export default React.memo(connect(mapStateToProps)(Logger));
