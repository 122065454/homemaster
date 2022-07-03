<template>
<transition name='modelToggel'>
  <div class="models text" v-show="show" :class="lang">
    <div class="modal-mask">
      <div class="content">
        <div class="title">
          <span>{{ $t("noteImport") }}</span>
          <span v-if="showtime">{{ num }}s</span>
        </div>
        <!-- 内容 -->
        <div class="bottom">
          <!-- <p>{{ $t("noteImport0") }}</p> -->
          <ul>
            <li>{{ $t("noteImport0") }}{{ $t("noteImport1") }}</li>
            <li>{{ $t("noteImport2") }}</li>
            <li>{{ $t("noteImport3") }}</li>
          </ul>
          <!-- <h2>
            *如参与人数过多，奖励可能低于您投入的MDX价值，由此会给您带来损失，请您知悉。
          </h2> -->
        </div>
        <button
          :disabled="showtime"
          :class="[showtime ? '' : 'show']"
          @click="liclick"
        >
          {{ $t("noteImport4") }}
        </button>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      num: 5,
      tiemid: null,
      showtime: true,
    };
  },
  methods: {
    liclick() {
      this.show = false;
      localStorage.setItem("know", 1);
    },
    timeout() {
      //   clearInterval(this.timer)
      this.tiemid = setInterval(() => {
        this.num--;
        if (this.num === 0) {
          this.showtime = false;
          clearInterval(this.tiemid);
        }
      }, 1000);
    },
  },
   computed: {
    isPC() {
      return this.$store.getters.isPC;
    },
    lang() {
      return this.$store.state.language === "en" ? "en" : "zn";
    },
  },
  created() {
    this.timeout();
  },
};
</script>
 <style lang="less" scoped>
.Bsc {
  .models {
    button {
      background: #080808;
      color: #ffc900;
    }
  }
}
.models {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: block;
  z-index: 88;
  .modal-mask {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50px;
  }
  .content {
    position: absolute;
    top: 29%;
    left: 45%;
    width: 320px;
    height: 330px;
    border-radius: 24px;
    background: #ffffff;
    padding: 32px 16px;
    overflow: scroll;
    overflow: hidden;

    li {
      font-size: 12px;
      color: #000000;
      line-height: 27px;
    }
  }
  // .content::-webkit-scrollbar {
  //   display: none;
  // }
  p {
    margin-bottom: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    margin-bottom: 13px;
    img {
      width: 12px;
      height: 12px;
    }
  }
  h2 {
    font-size: 12px;
    color: #f6454f;
    line-height: 20px;
  }
  button {
    width: 199px;
    height: 50px;
    background: #e8e8e8;
    border-radius: 30px;
    font-size: 14px;
    color: rgba(60, 60, 67, 0.6);
    margin: 20px 0px 0px 40px;
  }
  .show {
    background: #009a7f;
    color: #ffffff;
  }
}
.en{
  p {
    font-size: 12px;
  }
  .content{
    li{
      line-height: 18px;
    }
  }
}
.modelToggel-enter-active {
  animation: modalToggle 0.5s;
}
.modelToggel-leave-active {
  animation: modalToggle 0.5s reverse;
}
@keyframes modalToggle {
  0% {
    transform: scale(1.1);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
@media screen and (max-width: 450px) {
  .models{
     .content{
   left: 8%;
 }
  }

}
</style>
