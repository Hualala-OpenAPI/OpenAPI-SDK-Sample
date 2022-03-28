import {lazy} from "react";
import EnumController from "../controllers/EnumController";

const Shop = [
  {
    path: EnumController.ROUTERS().SHOP,
    component: lazy(() => import("../views/shop"))
  },
  {
    path: EnumController.ROUTERS().SHOP_DETAIL,
    component: lazy(() => import("../containers/Shop/ShopDetail"))
  }
];

export default Shop;
