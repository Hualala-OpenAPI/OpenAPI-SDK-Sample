import {Toast} from "antd-mobile-v5";

export function parseJson(data) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}

// todo 消除js价格计算精度的问题 保留两位小数
export function filterAmount(price) {
  return Math.round(price * 100) / 100;
}

export function showToast({content, icon = "loading", duration = 1500}) {
  Toast.show({
    content,
    icon,
    getContainer: document.getElementById("mainContainer"),
    duration
  });
}
