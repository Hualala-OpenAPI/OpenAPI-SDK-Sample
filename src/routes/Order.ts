import { lazy } from 'react'
import { ROUTERS } from '../CONSTANT'

const Order = [
  {
    path: ROUTERS.ORDER_CREATE,
    component: lazy(() => import('../views/order/create'))
  },
  {
    path: ROUTERS.ORDER_DETAIL,
    component: lazy(() => import('../views/order/detail'))
  }
]

export default Order
