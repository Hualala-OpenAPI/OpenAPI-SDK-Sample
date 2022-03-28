import React, {PureComponent} from "react";
import Main from "../../containers/Main/Main";
import Logger from "../../containers/Logger/Logger";
import FrameworkHeader from "../../components/layout/FrameworkHeader";
import "./index.less";

class Framework extends PureComponent {
  render() {
    return (
      <div className="framework">
        <FrameworkHeader />
        <div className="container">
          <Main />
          <Logger />
        </div>
      </div>
    );
  }
}

export default Framework;
