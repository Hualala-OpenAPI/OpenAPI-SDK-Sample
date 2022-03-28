import React, {PureComponent} from "react";
import Config from "../../Config";
import logo from "../../assets/images/logo.png";
import "../css/FrameworkHeader.less";

class FrameworkHeader extends PureComponent {
  render() {
    return (
      <div className="framework-header">
        <img className="logo" src={logo} alt="logo" />
        {Config.app.name}
      </div>
    );
  }
}

export default FrameworkHeader;
