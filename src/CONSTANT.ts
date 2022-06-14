export enum ORDER_STATUS {
  NORMAL, // 未下单
  CREATED, // 已下单
  REFUND // 已退款
}

export enum PAYMENT_STATUS {
  UNPAID, // 待支付
  PAID // 已支付
}

export enum ROUTERS {
  SHOP = '/shop', // 堂食-桌台
  SHOP_DETAIL = '/shop/:id', // 堂食-点菜
  ORDER_CREATE = '/order/create', // 创建订单
  ORDER_DETAIL = '/order/:id' // 订单详情
}
