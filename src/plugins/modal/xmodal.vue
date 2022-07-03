<template>
  <div class="x-modal-root">
      <div class="modal-mask" ></div>
    <div class="modal-wrap" @click="maskClose">
        <div class="modal-main" :style="mainStyle">
          <div class="close" @click="$modalClose()"><img src="../../assets/modal-close.png" alt="x"></div>
          <div class="modal-header">
            <div class="title">{{ title }}</div>
            <div class="header-line"></div>
          </div>
          <div class="modal-body"><slot /></div>
          <div class="modal-footer" v-if="cancelText || acceptText" :class="{footercenter: !cancelText || !acceptText}">
            <button v-if="cancelText" class="cancel" @click="onCancel">{{cancelText}}</button>
            <button v-if="acceptText" class="accept" :class="{disabled: acceptDisabled}" :disabled=acceptDisabled @click="onAccept">{{acceptText}}</button>
            <div class="clearfix"></div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "XModal",
  props: {
    title: { type: String, default: "" },
    width: { type: [Number, String], default: 826 },
    acceptText: {
      default: "Confirm",
      type: String
    },
    cancelText: {
      default: 'Cancel',
      type: String
    },
    acceptDisabled: {
      default: false,
      type:Boolean,
    },
    cancel: {
      default: () => {},
      type: Function
    },
    accept: {
      default: () => {},
      type: Function
    },
  },
  computed: {
    mainStyle() {
      let width = this.width;
      if (typeof width === "number") {
        width += "px";
      }
      return { 
        maxWidth: width,
      };
    },
  },
  methods: {
    maskClose(e) {
      if (e.target === e.currentTarget) {
        this.$modalClose()
      }
    },
    onCancel(e) {
      this.cancel(e)
      this.$modalClose()
    },
    onAccept(e) {
      this.accept(e)
    },
  }
};
</script>
<style lang="less" scoped>
.clearfix {
  float: none;
  clear: both;
}
.modal-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  filter: alpha(opacity=50);
  // router transition

  // &.fade-in-enter{
  //   opacity: 0;
  // }
  // &.fade-in-leave-active{
  //   opacity: 1;
  // }
  // &.fade-out-enter {
  //   transform: translate(-50%, 0);
  // }
  // &.fade-out-leave-active{
  //   transform: translate(100%, 0);
  // }
}
.modal-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
  -webkit-overflow-scrolling: touch;
}
.modal-main {
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.65);
  // width: 90%;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: "tnum";
  position: relative;
  top: 60px;
  width: 95%;
  margin: 0 auto;
  // padding: 0 0 24px;
  background-color: #fff;
  background-clip: padding-box;
  border: 0;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  
  .close {
    position: absolute;
    cursor: pointer;
    top: 40px;
    right: 20px;
    display: block;
    width: 40px;
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    text-transform: none;
    text-rendering: auto;
    img {
      width: 23px;
      height: 23px;
      vertical-align: middle;
    }
  }
  
}
.modal-header {
  color: #000;
  font-size: 26px;
  padding: 40px 0 24px;
  text-align: center;
}
.modal-body {
  word-wrap: break-word;
  position: relative;
}
.modal-footer {
  padding: 50px 30px;
  background: transparent;
  border-radius: 0 0 4px 4px;
  &.footercenter {
    text-align: center;
    .accept {
      float: none;
    }
  }
  .accept, .cancel {
    background: #fafafa;
    color: #000;
    border-radius: 80px;
    height: 80px;
    line-height: 80px;
    max-width: 340px;
    width: 45%;
    border: none;
    outline: none;
    font-size: 24px;
    text-align: center;
    cursor: pointer;
    transition: opacity 100ms ease-out;
    &.disabled {
      opacity: 0.6;
    }
  }
  .accept {
    background-color:#04C19E;
    color: #fff;
    float: right;
  }
}
</style>