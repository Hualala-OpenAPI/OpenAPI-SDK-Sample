import React, {useState} from "react";
import "../css/RadioGroup.less";

const RadioGroup = props => {
  const {item, onChange} = props;
  const {name, items, defaultValue} = item;
  const [currentValue, updateCurrentValue] = useState(defaultValue);

  const handleOnChange = value => {
    updateCurrentValue(value);
    onChange(name, value);
  };

  return (
    <div className="radio-group">
      {items.map((item, index) => {
        return (
          <div className="radio-item" key={index}>
            <label>
              {item.label}
              <input
                name={name}
                type="radio"
                value={item.value}
                defaultChecked={currentValue === item.value}
                onChange={() => handleOnChange(item.value)}
              />
            </label>
          </div>
        );
      })}
    </div>
  );
};
export default React.memo(RadioGroup);
