import { fromJS, List } from 'immutable'
import { API_SET_CONTAINER, API_SET_ITEM } from '../Constants'
import { IAction } from '../../types/store'

const defaultState:any = fromJS({
  apiList: {} // 每个页面展示的接口集合
})
export default (state = defaultState, action:IAction) => {
  const { type, payload } = action
  switch (type) {
    case API_SET_CONTAINER:
      return state.setIn(['apiList', payload], List([]))
    case API_SET_ITEM:
      return state.setIn(['apiList', payload.path], payload.items)
    default:
      return state
  }
}
