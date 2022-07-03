<template>
  <transition name="modal">
    <div class="model" v-if="modelShow">
      <div class="model-wrap">
        <img
          class="close-icon"
          src="../../assets/close-icon.png"
          @click="hideModel"
        />
        <h2>{{ $t("text1") }}：</h2>
        <h3 v-if="isdes"> {{ chainName=='Heco'?$t("text2_heco"):$t("text2_bsc") }}：</h3>
        <p v-if="isdes">{{ chainName=='Heco'?$t("text3_heco"):$t("text3_bsc") }}</p>
        <h3 v-if="isairdrop"> {{ chainName=='Heco'?$t("text4_heco"):$t("text4_bsc") }}：</h3>
        <!--  // text5_heco text5_bsc   <img v-show="chainName=='Heco'" src="@/assets/Github1.png" alt="" />
                 <img v-show="chainName=='Bsc'" src="@/assets/Github2.png" alt="" /> -->
        <p v-if="isairdrop">{{ chainName=='Heco'?$t("text5_heco"):$t("text5_bsc") }}</p>
        <hr />
        <p>{{ $t("text6") }}{{ $t("text7") }}</p>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "Rule",
  data() {
    return {
      modelShow: false,
      isairdrop: false,
      isdes: true,
    };
  },
  methods: {
    showModel(isairdrop, isdes) {
      this.isairdrop = isairdrop;
      this.isdes = isdes;
      this.modelShow = true;
    },
    hideModel() {
      this.isairdrop = false;
      this.isdes = false;
      this.modelShow = false;
    },
  },
};
</script>
<style lang="less" scoped>
.close-icon {
  position: absolute;
  width: 18px;
  height: 18px;
  padding: 14px;
  right: 0;
  top: 0;
  box-sizing: content-box;
  cursor: pointer;
}

//pc
@media screen and (min-width: 450px) {
  .model-wrap {
    width: 1200px;
  }
}

//h5
@media screen and (max-width: 450px) {
  .model-wrap {
    width: 92%;
  }
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.model {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  transition: opacity 0.3s ease;
  z-index: 9;
}

.model-wrap {
  /* height: 450px; */
  max-height: 500px;
  min-height: 410px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  font-size: 14px;
  padding-top: 40px;

  h2,
  h3 {
    color: #1b235a;
  }

  h2 {
    font-size: 16px;
  }

  h3 {
    margin-top: 14px;
  }

  p {
    color: #9194a8;
    margin-top: 10px;
    line-height: 1.5;
  }

  hr {
    border: none;
    border-top: 1px dashed #dbddee;
    margin-top: 16px;
  }
}
</style>
