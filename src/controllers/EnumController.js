export default class EnumController {
  static ORDER_STATUS() {
    return {
      NORMAL: 0, // 未下单
      CREATED: 1, // 已下单
      REFUND: 2 // 已退款
    };
  }

  static PAYMENT_TYPE() {
    return {
      NOW: 0, // 先付
      AFTER: 1 // 后付
    };
  }

  static PAYMENT_STATUS() {
    return {
      UNPAID: 0, // 待支付
      PAID: 1 // 已支付
    };
  }

  static ROUTERS() {
    return {
      SHOP: "/shop", // 堂食-桌台
      SHOP_DETAIL: "/shop/detail", // 堂食-点菜
      PAYMENT_DETAIL: "/payment/detail", // 支付
      ORDER: "/order", // 订单
      ORDER_CREATE: "/order/create", // 创建订单
      ORDER_DETAIL: "/order/:id" // 订单详情
    };
  }

  static TABLE_STATUS() {
    return {
      NORMAL: 0, // 未开台
      ACTIVE: 1 // 已开台
    };
  }
}
