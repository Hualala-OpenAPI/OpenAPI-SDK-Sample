import {API_SET_CONTAINER, API_SET_ITEM} from "../Constants";

const setApiContainer = data => {
  return {
    type: API_SET_CONTAINER,
    payload: data
  };
};

export const setApiItem = (path, items) => {
  return {
    type: API_SET_ITEM,
    payload: {
      path,
      items
    }
  };
};
export const pushApiContainer = path => {
  return (dispatch, state) => {
    const apiList = state().api.get("apiList");
    // todo 如果path已经存在就不继续set了
    if (apiList.includes(path)) return false;
    dispatch(setApiContainer(path));
  };
};
