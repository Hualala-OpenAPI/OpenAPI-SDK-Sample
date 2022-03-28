import React, {Suspense, useEffect} from "react";
import {Redirect, Route, Switch, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import NoData from "../../components/general/NoData";
import Routes from "../../routes";
import {pushApiContainer} from "../../store/actions/Api";
import "./css/Main.less";

const Main = props => {
  const {history} = props;
  const excludeApiContainer = ["/", "/option"];

  useEffect(() => {
    const {pathname} = history.location;
    if (!excludeApiContainer.includes(pathname)) {
      props.pushApiContainer(pathname);
    }
  }, [history?.location?.pathname]);

  return (
    <div className="main" id="mainContainer">
      <Suspense fallback={<NoData>加载中...</NoData>}>
        <Switch>
          {Routes.map(item => {
            const {path, component} = item;
            return <Route exact key={path} path={path} component={component} />;
          })}
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </div>
  );
};
const mapDispatchToProps = {
  pushApiContainer
};
export default withRouter(connect(null, mapDispatchToProps)(Main));
