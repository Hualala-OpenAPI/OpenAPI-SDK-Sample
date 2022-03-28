import React from "react";
import {NavBar} from "antd-mobile";
import homeIcon from "../../../assets/images/home.png";
import "../css/MainHeader.less";

const MainHeader = props => {
  const {title, listenHeaderHeight} = props;
  const backToIndex = () => {
    window.location.href = "/";
  };
  return (
    <div ref={listenHeaderHeight} className="main-header">
      <NavBar mode="dark" icon={<img className="home-icon" src={homeIcon} alt="home-icon" onClick={backToIndex} />}>
        {title}
      </NavBar>
    </div>
  );
};

export default React.memo(MainHeader);
