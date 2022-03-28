import store from "../store";
import {setApiItem} from "../store/actions/Api";
import {parseJson} from "../Utils";

export default class ApiController {
  // todo 以下是不进行展示的api
  static excludeAPI() {
    return ["/"];
  }

  static detect(response) {
    const {url} = response.config;
    const {pathname} = location;
    if (this.excludeAPI().includes(url)) return false;
    const curSubApiList = store.getState().api.getIn(["apiList", pathname]);
    // todo 以下判断是在同一页面重复请求的URL就不进行记录了
    //  if (curSubApiList.some(listItem => listItem.url === url)) return false;
    store.dispatch(setApiItem(pathname, curSubApiList.merge(this.setApiInfo(response))));
  }

  static setApiInfo(res) {
    if (!res) return {};
    return {
      url: res?.config?.url,
      params: parseJson(res?.config?.data),
      result: parseJson(res?.request?.response)
    };
  }
}
