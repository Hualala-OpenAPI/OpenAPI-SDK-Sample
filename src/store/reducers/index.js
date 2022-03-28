import {combineReducers} from "redux";

import Shop from "./Shop";
import Common from "./Common";
import Api from "./Api";
import Table from "./Table";

const allReducers = combineReducers({
  shop: Shop,
  api: Api,
  common: Common,
  table: Table
});
export default allReducers;
