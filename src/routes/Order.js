import {lazy} from "react";
import EnumController from "../controllers/EnumController";

const Order = [
  {
    path: EnumController.ROUTERS().ORDER_CREATE,
    component: lazy(() => import("../views/order/create"))
  },
  {
    path: EnumController.ROUTERS().ORDER_DETAIL,
    component: lazy(() => import("../views/order/detail"))
  }
];

export default Order;
