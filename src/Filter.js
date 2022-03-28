export function filterAPIName(url) {
  switch (url) {
    case "/order/senderQueryMsg":
      return "查询桌台信息触发回调(订单)";
    case "/order/queryTableMsg":
      return "桌台回调失败主动查询(订单)";
    case "/doc/getOpenFood":
      return "查询店铺菜品列表(基本档)";
    case "/order/createOrder":
      return "新订单加菜(订单)";
    case "/order/payout":
      return "订单支付(订单)";
    case "/doc/getPaySubject":
      return "查询店铺科目列表(基本档)";
    case "/order/query":
      return "查询订单详情(订单)";
    case "/inventory/getAvailableFoodRemainQtyByShopID":
      return "查询店铺可用菜品库存数量(基本档)";
    default:
      return "";
  }
}

export function filterOrderStatus(status) {
  switch (Number(status)) {
    case 15:
      return "提交订单(未支付)";
    case 20:
      return "已付款";
    case 40:
      return "商家接单";
    case 41:
      return "商家已下单";
    case 46:
      return "确认送出";
    case 50:
      return "确认送达";
    case 60:
      return "订单完成";
    case 65:
      return "退款完成";
    case 2:
      return "拒绝退款";
    case 6:
      return "同意部分退款";
    case 5:
      return "拒绝部分退款";
  }
}
