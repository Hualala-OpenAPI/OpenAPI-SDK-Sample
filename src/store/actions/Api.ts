import { API_SET_CONTAINER, API_SET_ITEM } from '../Constants'
import { IApiItem } from '../../types/store/api'

const setApiContainer = (path: string) => {
  return {
    type: API_SET_CONTAINER,
    payload: path
  }
}

export const setApiItem = (path: string, items: IApiItem[]) => {
  return {
    type: API_SET_ITEM,
    payload: {
      path,
      items
    }
  }
}
export const pushApiContainer = (path: string) => {
  return (dispatch: any, state: any) => {
    const apiList = state().api.get('apiList')
    // todo 如果path已经存在就不继续set了
    if (apiList.includes(path)) return false
    dispatch(setApiContainer(path))
  }
}
