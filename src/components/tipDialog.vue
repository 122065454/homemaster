<template>
  <section class="dialog" :class="getLanguage">
    <div class="dialog-mark"></div>
    <div class="dialog-box text">
      <img class="close-icon" @click="close" src="@/assets/close-icon.png" />
      <div class="dialog-logos">
        <div class="loading" v-show="type === 'loading'"><div></div></div>
        <div class="img" v-show="type === 'success'">
          <img src="@/assets/dialogSuccess.png" alt="" />
        </div>
        <div class="img" v-show="type === 'error'">
          <img src="@/assets/dialogError.png" alt="" />
        </div>
      </div>
      <div v-if="type !== 'error'">
       <div class="dialog-name" v-if="type === 'loading'&& flag">{{global.$t('underConfirmation')}}</div>
       <div class="dialog-name" v-if="content">{{global.$t(`${content}`)}}</div>
      </div>
      <div
        :class="{
          'loading-msg': type === 'loading',
          'dialog-status ': type !== 'loading',
        }"
        v-show="title"
      >
        {{ title }}
      </div>
      <div
        class=""
        :style="{ color: warnColor }"
        :class="{
          'loading-text': type === 'loading',
          'dialog-warn ': type !== 'loading',
        }"
        v-show="msg"
        v-html="msg"
      >
        <!-- {{ msg }} -->
      </div>
      <div
        class="dialog-button"
        :style="{ background: warnColor }"
        v-show="type === 'success' || type === 'error'"
        @click="close"
      >
        {{ buttonText }}
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "tipDialog",
  props: {
    type: { type: String, default: "loading" }, // success / error / loading
    flag: { type: Boolean, default: true }, // 显示领取奖励的标志位
    title: { type: String, default: "" }, // success / error / loading
    msg: { type: String, default: "" },
    buttonText: { type: String, default: 'Close' },
    content:{type:String,default:""}
  },
  data(){
     return{
       global:window.$v
     }
  },

  computed: {
    warnColor() {
      let color = "";
      switch (this.type) {
        case "success":
          color = "#02C09F";
          break;
        case "error":
          color = "#FF6971";
          break;
        default:
          color = "";
      }
      return color;
    }
  },
  methods: {
    close() {
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
      this.$destroy();
    },
  },
};
</script>

<style scoped lang="less">
@keyframes rotate {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }

  50% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.dialog {
  z-index: 9999;
  .dialog-mark {
    z-index: 9999;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.3;
    left: 0;
    top: 0;
    position: fixed;
  }
  .dialog-box {
    z-index: 9999;
    min-height: 250px;
    background: #fff;
    left: 50%;
    position: fixed;
    transform: translate3d(-50%, -50%, 0);
    top: 50%;
    border-radius: 10px;
    padding: 24px;
    box-sizing: border-box;
  }
  .close-icon {
    position: absolute;
    right: 18px;
    top: 18px;
    width: 18px;
    cursor: pointer;
  }
  .dialog-logos {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    img {
      width: 80px;
    }
  }
  .dialog-status {
    margin-top: 10px;
    height: 28px;
    font-size: 20px;
    font-weight: 800;
    color: #041843;
    line-height: 28px;
    text-align: center;
  }
  .dialog-warn {
    margin-top: 10px;
    // height: 22px;
    font-weight: 800;
    line-height: 22px;
    text-align: center;
  }

  .loading {
    display: inline-block;
    margin-right: 5px;
    height: 30px;
    margin-bottom: 50px;
    > div {
      border-radius: 100%;
      margin: 2px;
      border: 6px solid #2c72f4;
      border-bottom-color: transparent;
      height: 90px;
      width: 90px;
      background: 0 0 !important;
      display: inline-block;
      -webkit-animation: rotate 0.75s 0s linear infinite;
      animation: rotate 0.75s 0s linear infinite;
    }
  }
}

.dialog-name {
  margin: 0 auto;
  text-align: center;
  margin-top: 50px;
  height: 22px;
  font-size: 16px;
  font-weight: 800;
  color: #041843;
  line-height: 22px;
}
.loading-msg {
  font-size: 12px;
  font-weight: 800;
  color: #041843;
  line-height: 37px;
  text-align: center;
}
.loading-text {
  font-size: 14px;
  font-weight: 800;
  color: #808eb5;
  line-height: 37px;
  text-align: center;
}

@media screen and (min-width: 700px) {
  .dialog-box {
    width: 400px;
  }
  .dialog-warn {
    font-size: 16px;
  }
  .dialog-button {
    margin-top: 20px;
    line-height: 46px;
    width: 354px;
    border-radius: 10px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    font-size: 18px;
    font-weight: 800;
    color: #ffffff;
  }
}

@media screen and (max-width: 700px) {
  .dialog-box {
    width: 300px;
  }
  .dialog-button {
    margin-top: 20px;
    line-height: 48px;
    width: 100%;
    border-radius: 10px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    font-size: 18px;
    font-weight: 800;
    color: #ffffff;
    background: #ff6971;
    box-shadow: 0px 10px 10px 0px rgba(255, 128, 146, 0.2);
  }
  .dialog-warn {
    font-size: 12px;
  }
}
</style>
