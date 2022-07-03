<template>
  <!--    -->
  <section class="dialog">
    <div class="dialog-main" @click.self="close">
      <div class="dialog-box">
        <p class="p-img">
          <img
            class="close-icon"
            @click.stop="close"
            src="@/assets/close-icon.png"
          />
        </p>
        <div class="dialog-body">
          <div class="show-icon">
            <img
              class="close-icon"
              @click="close"
              src="@/assets/PingFangs.png"
            />
          </div>
          <div class="div-p">
            <p>{{ title }}</p>

            <p>
              <a target="_blank" :href="'https://hecoinfo.com/tx/' + url+'?'+globalLanguage">{{
                info
              }}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "tipDialog",
  props: {
    title: { type: String, default: "" },
    info: { type: String, default: "View on Scan" },
    url: { type: String, default: "" },
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
    },
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
.dialog {
  z-index: 9999;

  background: rgba(0, 0, 0, 0);
  position: fixed;
  right: 0px;
  left: 0px;
  top: 0px;
  bottom: 0px;
  .dialog-mark {
  }
  .dialog-main {
    width: 100%;
    height: 100%;
    padding: 0 10px;
    position: relative;
  }
  .dialog-box {
    z-index: 99999;

    margin-top: 50px;
    min-height: 100px;

    background: #fff;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;
    .p-img {
      text-align: right;
    }
  }
  .dialog-body {
    display: flex;
    justify-content: flex-start;
  }
  .show-icon {
    height: 50px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 40px;
      width: 40px;
    }
  }
  .div-p p {
    font-weight: 800;
    padding-left: 10px;
    a {
      height: 22px;
      font-size: 16px;
      color: #02c09f;
      line-height: 22px;
    }
  }
  .div-p p:first-child {
    height: 28px;
    font-size: 20px;
    color: #041843;
    line-height: 28px;
  }
  .div-p p:last-child {
    height: 22px;
    font-size: 16px;
    color: #02c09f;
    line-height: 22px;
  }
}

@media screen and (min-width: 700px) {
  .dialog-box {
    width: 470px;
    position: absolute;
    right: 20px;
    top: 50px;
  }
}

@media screen and (max-width: 700px) {
  .dialog-box {
    width: 100%;
  }
}
</style>
