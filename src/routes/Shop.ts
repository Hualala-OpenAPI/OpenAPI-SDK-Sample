import { lazy } from 'react'
import { ROUTERS } from '../CONSTANT'

const Shop = [
  {
    path: ROUTERS.SHOP,
    component: lazy(() => import('../views/shop'))
  },
  {
    path: ROUTERS.SHOP_DETAIL,
    component: lazy(() => import('../views/shop/detail'))
  }
]

export default Shop
