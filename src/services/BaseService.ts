import { fromJS } from 'immutable'
import Http from './Http'
import { IRequest, IResponse } from '../types/http'

export default class BaseService {
  static request(options: IRequest) {
    const { url, method = 'POST', params, data } = options
    const httpOptions: IRequest = {
      url,
      method
    }
    if ('params' in options) {
      httpOptions.params = fromJS(params).toJS()
    }
    if ('data' in options) {
      httpOptions.data = fromJS(data).toJS()
    }

    return Http(httpOptions) as unknown as Promise<IResponse>
  }
}
