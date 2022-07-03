import Vue from "vue";
import Toast from "@/components/tipDialog";
let ToastConstructor = Vue.extend(Toast);

ToastConstructor.prototype.closes = function () {
  if (this.$el && this.$el.parentNode) {
    this.$el.parentNode.removeChild(this.$el);
  }
  this.$destroy();
};
let myToast = (propsData) => {
  let toastDom = new ToastConstructor({
    el: document.createElement("div"),
    propsData,
  });
  document.body.appendChild(toastDom.$el);
  //  document.body.removeChild(el)
  return toastDom;
};

export default myToast;
