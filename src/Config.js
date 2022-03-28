const {REACT_APP_GROUP_ID, REACT_APP_NAME, REACT_APP_SHOP_ID, REACT_APP_TABLE_NAME, REACT_APP_URL, REACT_APP_ENV, REACT_APP_API_URL} =
  process.env;
export default {
  env: REACT_APP_ENV,
  app: {
    name: REACT_APP_NAME,
    url: REACT_APP_URL
  },
  api: {
    url: REACT_APP_API_URL
  },
  info: {
    groupId: Number(REACT_APP_GROUP_ID),
    shopId: Number(REACT_APP_SHOP_ID),
    tableName: REACT_APP_TABLE_NAME
  }
};
