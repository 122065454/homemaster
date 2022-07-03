<template>
  <section :class="chainName">
    <!-- <a :href="'https://forms.gle/pAEWKBjGkeqmHfRE8?' + globalLanguage" target="_blank"> -->
      <div class="tip-msg-h5 text">
        <div class="text-msg-h5">
          <p class="text-info text-info1">{{$t('JoinTheDecentralized')}}</p>
          <!-- <p class="text-info text-info2">{{$t('JoinTheDecentralized2')}}</p> -->
          <p class="p-text" @click="$router.push('/introduce')">
            <button>{{ $t("ApplyNow") }}</button>
          </p>
        </div>
      </div>
      <div class="tip-msg-pc">
        <div class="div-text">
          <p class="text-info">{{$t('JoinTheDecentralized')}}</p>
        </div>
        <p class="p-text text Bold" @click="$router.push('/introduce')">
          <button>{{ $t("ApplyToJoin") }}</button>
        </p>
      </div>
    <!-- </a> -->
  </section>
</template>


<script>
export default {
  name: "apply-tip",
  components: {},
  data() {
    return {};
  },
  //   beforeCreate() {
  //   },
  //   created() {},
  //   async mounted() {
  //   },
  //   beforeDestroy() {
  //   },
  methods: {},
};
</script>
<style lang="less" scoped>
.Heco {
  .tip-msg-h5 {
    button {
      color: #092574;
      background-color: white;
    }
  }
  .tip-msg-pc {
    button {
      // border: 1px solid #2c72f4;
      color: #092574;
      margin-right: 10px;
    }
  }
  .text-info {
    color: #ffffff;
  }
}
.Bsc {
  .tip-msg-h5 {
    button {
      background: #2e2e2e;
      color: #9F6A00;
    }
  }
  .tip-msg-pc {
    button {
      // border: 1px solid #171717;
      margin-right: 10px;
      color: #9F6A00;
    }
  }
  .text-info {
    color: #ffffff;
  }
}
.ETH {
}
@media screen and (max-width: 700px) {
  // tip-msg-h5
  .Heco {
    .tip-msg-h5 {
      background-image: url("~@/assets/foot/heco-apply-h5.png");
    }
  }
  .Bsc {
    .tip-msg-h5 {
      background-image: url("~@/assets/foot/bsc-apply-h5.png");
    }
  }
  .tip-msg-pc {
    display: none;
  }

  .tip-msg-h5 {
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    padding-bottom: 10px;
    padding: 0 15px;
    width: 92%;
    margin-left: 4%;
    margin-top: 10px;
    background: #ffffff;
    border-radius: 10px;
    min-height: 101px;
    background-position: center;
    background-size: cover;
    background-repeat:no-repeat;
    padding-bottom: 10px;
    .text-msg-h5 {
      padding-top: 15px;
      font-size: 12px;
      p:last-child{
        margin-top:9px;
      }
    }
    .text-info {
      line-height: 18px;
      text-align: center;
    }
    // .text-info1 {
    // }
    // .text-info2 {
    //   margin-top: 5px;
    // }

    .p-text {
      display: flex;
      justify-content: center;
      button {
        height: 28px;
        background: #ffffff;
        border-radius: 17px;
        font-size: 14px;
        padding: 0 10px;
        font-weight: bold;
      }
    }
  }
  // .tip-msg-h5 {
  //   p:first-child {
  //     font-size: 16px;
  //     font-weight: 600;
  //     color: #282623;
  //     line-height: 25px;
  //   }
  //   p:last-child {
  //     font-size: 12px;
  //     font-weight: 500;
  //     color: #9f9f9f;
  //   }
  //   button {
  //     // width: 80px;
  //     height: 32px;
  //     border-radius: 4px;
  //     font-size: 16px;
  //   }
  // }
}

@media screen and (min-width: 700px) {
  .tip-msg-h5 {
    display: none;
  }
  .Heco {
    .tip-msg-pc {
      background-image: url("~@/assets/foot/heco-apply-pc.png");
    }
  }
  .Bsc {
    .tip-msg-pc {
      background-image: url("~@/assets/foot/bsc-apply-pc.png");
    }
  }
  .tip-msg-pc {
    //  display: flex;
    //  justify-content:center;
    // align-items: center;
    height: 150px;
    border-radius: 10px;
    background-position: center;
    background-size: 100%;
    width: 1200px;

    border-radius: 10px;
    margin: 10px auto;

    .div-text {
      display: flex;
      justify-content: center;
      padding: 0 20px;
      p {
        margin-top: 39px;
        text-align: center;
      }
    }
    .p-text {
      display: flex;
      justify-content: center;
      button {
        margin-top: 20px;
        background: #ffffff;
        border-radius: 17px;
      }
    }
    .text-info {
      font-size: 20px;
      font-weight: bold;
    }
    a {
      width: 100%;
      height: 100%;
    }

    p {
      margin: 0px auto;
    }
    // .text-msg {
    //   display: flex;
    //   justify-content: flex-start;
    //   align-items: center;
    //   img {
    //     width: 53px;
    //     height: 30px;
    //     margin-left: 20px;
    //     margin-right: 10px;
    //   }
    //   .span-msg {
    //     font-size: 20px;
    //     font-weight: 500;
    //     color: #171717;
    //   }
    //   span:last-child {
    //     font-size: 18px;
    //     font-weight: 500;
    //     color: #9f9f9f;
    //   }
    // }
    button {
      // width: 110px;
      height: 32px;
      border-radius: 10px;
      margin-right: 10px;
      font-weight: bold;
      font-size: 16px;
      background-color: white;
      padding: 0 15px;
    }
  }
}
</style>
