import axios from "axios";
import ApiController from "../controllers/ApiController";
import {showToast} from "../Utils";

const service = axios.create({
  // baseURL: Config.api.url,
  timeout: 100000,
  headers: {"content-type": "application/json"},
  withCredentials: true // 允许携带cookie
});

// request拦截器
service.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);
// response拦截器
service.interceptors.response.use(
  response => {
    const {data = {}} = response;
    const {code} = data;
    ApiController.detect(response);
    if (code !== "000" && code.startsWith("1")) {
      return Promise.reject(data);
    }
    return data;
  },
  (err = {}) => {
    const {response = {}} = err;
    const {status} = response;
    let errMessage;
    if (response) {
      switch (status) {
        case 400:
          errMessage = "请求错误(400)";
          break;
        case 401:
          errMessage = "未授权，请重新登录(401)";
          break;
        case 403:
          errMessage = "请重新登录";
          break;
        case 404:
          errMessage = "请求出错(404)";
          break;
        case 408:
          errMessage = "请求超时(408)";
          break;
        case 500:
          errMessage = "服务器错误(500)";
          break;
        case 501:
          errMessage = "服务未实现(501)";
          break;
        case 502:
          errMessage = "网络错误(502)";
          break;
        case 503:
          errMessage = "服务不可用(503)";
          break;
        case 504:
          errMessage = "网络超时(504)";
          break;
        case 505:
          errMessage = "HTTP版本不受支持(505)";
          break;
        default:
          errMessage = `连接出错(${status})!`;
      }
    } else {
      errMessage = "连接服务器失败!";
    }
    showToast({content: errMessage || err.message, icon: "fail"});
    return Promise.reject(err);
  }
);
export default service;
