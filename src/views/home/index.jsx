import React from "react";
import {withRouter} from "react-router-dom";
import {Button} from "antd-mobile";
import "./index.less";

const Home = props => {
  const {history} = props;

  const pushToPage = () => {
    history.push({pathname: "/option"});
  };

  return (
    <div className="home">
      <Button style={{width: "80%"}} type="primary" onClick={pushToPage}>
        进入堂食
      </Button>
    </div>
  );
};

export default React.memo(withRouter(Home));
