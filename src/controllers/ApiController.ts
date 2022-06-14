import { AxiosResponse } from 'axios'
import store from '../store'
import { setApiItem } from '../store/actions/Api'
import { parseJson } from '../Utils'
import { IResponse } from '../types/http'
import { IApiItem } from '../types/store/api'

export default class ApiController {
  // todo 以下是不进行展示的api
  static excludeAPI() {
    return ['/']
  }

  static detect(response: AxiosResponse<IResponse>) {
    const url = response?.config?.url || ''
    const { pathname } = location
    if (this.excludeAPI().includes(url)) return false
    const curSubApiList = store.getState().api.getIn(['apiList', pathname])
    // todo 以下判断是在同一页面重复请求的URL就不进行记录了
    //  if (curSubApiList.some(listItem => listItem.url === url)) return false;
    store.dispatch(setApiItem(pathname, curSubApiList.merge(this.setApiInfo(response))))
  }

  static setApiInfo(res: AxiosResponse<IResponse>): IApiItem {
    const { config, data: result } = res
    const { url, data } = config
    return {
      url: url?.startsWith('/api') ? url?.replace('/api', '') : url,
      params: parseJson(data),
      result
    }
  }
}
