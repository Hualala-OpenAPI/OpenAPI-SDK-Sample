import {lazy} from "react";
import Shop from "./Shop";
import Order from "./Order";

export default [
  {
    path: "/",
    component: lazy(() => import("../views/home"))
  },
  {
    path: "/option",
    component: lazy(() => import("../views/option"))
  },
  ...Shop,
  ...Order
];
