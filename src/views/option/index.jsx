import React, {useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import {Button} from "antd-mobile";
import {connect} from "react-redux";
import CommonHeader from "../../containers/Main/components/MainHeader";
import RadioGroup from "../../containers/Main/components/RadioGroup";
import EnumController from "../../controllers/EnumController";
import {setModuleConfig} from "../../store/actions/Common";
import "./index.less";

const OptionPage = props => {
  const options = [
    {
      type: "radio",
      title: "用餐人数",
      name: "peopleNum",
      items: [
        {label: "1人", value: 1},
        {label: "2人", value: 2}
      ],
      defaultValue: 1
    },
    {
      type: "radio",
      title: "支付类型",
      name: "paymentType",
      items: [
        {label: "先付", value: EnumController.PAYMENT_TYPE().NOW},
        {label: "后付", value: EnumController.PAYMENT_TYPE().AFTER}
      ],
      defaultValue: EnumController.PAYMENT_TYPE().AFTER
    }
  ];
  const [selectedOptions, updateSelectedOptions] = useState({});
  // 初始化记录配置项默认值
  useEffect(() => {
    let tempOptions = {};
    options.map(optionItem => {
      tempOptions[optionItem.name] = optionItem.defaultValue;
    });
    updateSelectedOptions({...selectedOptions, ...tempOptions});
  }, []);

  const listenRadioChange = (name, value) => {
    updateSelectedOptions({...selectedOptions, [name]: value});
  };
  const handleSubmit = () => {
    props.setModuleConfig(selectedOptions);
    props.history.push({pathname: EnumController.ROUTERS().SHOP});
  };
  return (
    <div className="option-page">
      <CommonHeader title="请选择堂食配置项" />
      {options.map((item, index) => {
        return (
          <div className="option-item" key={index}>
            <div className="title">
              {index + 1}.{item.title}
            </div>
            {item.type === "radio" ? <RadioGroup item={item} onChange={listenRadioChange} /> : null}
          </div>
        );
      })}
      <div className="fix-btn">
        <Button type="primary" className="button" onClick={handleSubmit}>
          下一步
        </Button>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  setModuleConfig
};
export default React.memo(connect(null, mapDispatchToProps)(withRouter(OptionPage)));
