import {applyMiddleware, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {persistReducer, persistStore} from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";
import immutableTransform from "redux-persist-transform-immutable";

import thunk from "redux-thunk";
import allReducers from "./reducers";

const persistConfig = {
  transforms: [immutableTransform()],
  key: "root",
  storage: sessionStorage,
  whitelist: ["common"]
};
const persistedReducer = persistReducer(persistConfig, allReducers);

const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));
export const persistor = persistStore(store);
export default store;
