import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
import Home from "@/views/home/home/Home.vue"
import Boardroom from "@/views/Boardroom/Boardroom.vue"
import BoardroomPool from "@/views/Boardroom/BoardroomPool/BoardroomPool"
import Lockup from "@/views/Boardroom/Lockup/Lockup"
import Liquidity from "@/views/liquidity/liquidity.vue"
import Trading from "@/views/trading/mining.vue"
import Bridge from "@/views/CrossChain/CrossChain.vue"
import Introduce from "@/views/introduce/index.vue"
import Buyback from "@/views/buyBack/index/index.vue"
import PastRecord from "@/views/buyBack/PastRecord/PastRecord.vue"
import Priceplan from "@/views/home/pricePlan/pricePlan.vue"
const routes = [
  {
    path: "*",
    redirect: "/",
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/boardroom",
    name: "Boardroom",
    component: Boardroom,
  },
  {
    path: "/pool/:type/:earn/:id", // type为池子的类型, 分为boardroom和liquidity, earn为赚取的币，分为mdx和ht, id为池子ID
    name: "BoardroomPool",
    component: BoardroomPool,
    alias: "/boardroom",
  },
  {
    path: "/pool/lockup/:earn", // earn为赚取的币，分为mdx和ht
    name: "Lockup",
    component: Lockup,
    alias: "/lockup",
  },
  {
    path: "/liquidity",
    name: "Liquidity",
    component: Liquidity,
  },
  {
    path: "/trading",
    name: "Trading",
    component: Trading,
  },
  // CrossChain
  {
    path: "/bridge",
    name: "Bridge",
    component: Bridge,
  },
  // introduce
  {
    path: "/introduce",
    name: "Introduce",
    component: Introduce,
  },
  {
    path: "/buyback",
    name: "Buyback",
    component: Buyback,
  },
  {
    path: "/pastrecord",
    name: "PastRecord",
    component: PastRecord,
  },
  {
    path: "/priceplan",
    name: "Priceplan",
    component: Priceplan,
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
