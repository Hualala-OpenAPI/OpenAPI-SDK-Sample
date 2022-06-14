import { combineReducers } from 'redux'
import Common from './Common'
import Api from './Api'
import Shop from './Shop'
import { IState } from '../../types/store'
const allReducers = combineReducers<IState>({
  common: Common,
  api: Api,
  shop: Shop
})
export default allReducers
