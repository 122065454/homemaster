import "purecss";
import "animate.css";
import Vue from "vue";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";
import VueTouch from 'vue-touch'
import VueI18n from "vue-i18n";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import overalltip from "./components/overalltip.js";
import toat from "./components/toat.js";
import { Table, TableColumn ,Button,Dialog,Form,Progress,FormItem,Tooltip,Message, InfiniteScroll,Loading,Pagination,Carousel, CarouselItem,  Collapse, CollapseItem, Switch} from "element-ui";
import "./plugins";
import "./assets/css/style.less";
import "./assets/css/standard.less";
import "./assets/css/font.less";
import {global} from './assets/js/global'
// import preventReClick from './utils/plungin'
import locale from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
Sentry.init({
  Vue,
  dsn: "https://5351d49355ce46e6a20074a2d569883d@o290666.ingest.sentry.io/5834995",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.2,
});
const hostname = window.location.hostname.replace('www.', '')
if(hostname !== 'mdex.bz') {
  Vue.use(VueTouch, {name: 'v-touch'})
  Vue.use(InfiniteScroll) 
  Vue.use(Loading.directive)
  Vue.use(Carousel)
  Vue.use(CarouselItem)
  Vue.component(Table.name, Table);
  Vue.component(TableColumn.name, TableColumn);
  Vue.component(Button.name, Button);
  Vue.component(FormItem.name, FormItem);
  Vue.component(Dialog.name, Dialog);
  Vue.component(Form.name, Form);
  Vue.component(Progress.name, Progress);
  Vue.component(Tooltip.name, Tooltip);
  Vue.component(Pagination.name, Pagination);
  Vue.component(Collapse.name, Collapse);
  Vue.component(CollapseItem.name, CollapseItem);
  Vue.component(Switch.name, Switch);
  Vue.use(VueI18n);
  Vue.mixin(global)

  Vue.config.errorHandler = function(err, vm, info) {
    console.log(`Error: ${err.toString()}\nInfo: ${info}, ${JSON.stringify(vm)}`);
  };
  Vue.config.productionTip = false;
  Vue.prototype.$overalltip = overalltip;
  Vue.prototype.$toatMsg = toat;
  Vue.prototype.axios=axios
  Vue.prototype.bus=new Vue()
  Vue.prototype.$message = Message

  const messages={
    "zh-CN":Object.assign(require("./components/language/zh"),zhLocale),
    "en":Object.assign(require("./components/language/en"),enLocale),
    "zh-HK": require("./components/language/hk"),
    "jp": require("./components/language/jp"),
    "tur": require("./components/language/tur"),
    "kr": require("./components/language/kr"),
    "ru": require("./components/language/ru"),
    "nl": require("./components/language/nl"),
    "th": require("./components/language/th"),
    "es": require("./components/language/es"),
    "vi": require("./components/language/vi"),
    "pt": require("./components/language/pt"),
    "tl": require("./components/language/tl"),
    "it": require("./components/language/it"),
    "ina": require("./components/language/ina"),
    "fa": require("./components/language/fa"),
  }                                                                                                                                                                                
  const i18n = new VueI18n({
    locale: store.language,
    messages
  })
  locale.i18n((key, value) => i18n.t(key, value))
  window.$s = store;
  setTimeout(() => {
    window.$v = new Vue({
      store,
      router,
      i18n, //把 i18n 挂载到 vue 根实例上
      render: (h) => h(App),
    }).$mount("#app");
  }, 500)
}
