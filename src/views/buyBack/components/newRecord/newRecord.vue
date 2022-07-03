<template>
  <!-- 获奖名单 -->
  <div class="list-price text">
    <!-- 等级 -->
    <div class="left">
      <div>
        <div class="header">
          <span class="one-1">{{ $t("Prizelevels") }}</span>
          <span class="two-2">{{ $t("hjrc") }}</span>
          <span class="three-3">{{ $t("TotalMDX") }}</span>
          <span class="four-4">{{ $t("Sharerewards") }}</span>
        </div>
        <div class="frist-price">
          <img src="@/views/buyBack/img/pc-one.png" alt="" />
          <div class="img-right">
            <span class="one text Bold">{{ $t("JupiterAward") }}</span>
            <span class="two numbers Medium">{{ getInfo.gold.repurch_user }}</span>
            <span class="three numbers Medium">{{
              Number(getInfo.gold.repurch_amount).toFixed(0)
            }}</span>
            <span class="four">
              <span class="textEn">{{ getnumNew.toFixed(0) }}MDX</span>
              <el-tooltip
              class="item"
              trigger="click"
              effect="dark"
              placement="bottom"
              popper-class="tipCase"
            >
              <div slot="content" v-html="global.$t('caojuxinciTips')"></div>
              <i></i>
            </el-tooltip>
            </span>
         
          </div>
        </div>
        <div class="frist-price">
          <img src="@/views/buyBack/img/pc-two.png" alt="" />
          <div class="img-right">
            <span class="one text Bold">{{ $t("SatumAward") }}</span>
            <span class="two numbers Medium">{{ getInfo.silver.repurch_user }}</span>
            <span class="three numbers Medium">{{
              Number(getInfo.silver.repurch_amount).toFixed(0)
            }}</span>
            <span class="four textEn"
              >{{
                splitFormat(getInfo.silver.reward_amount).toFixed(0)
              }}USDT</span
            >
          </div>
        </div>
        <div class="frist-price">
          <img src="@/views/buyBack/img/pc-three.png" alt="" />
          <div class="img-right">
            <span class="one text Bold">{{ $t("PlutoAward") }}</span>
            <span class="two numbers Medium">{{ getInfo.bronze.repurch_user }}</span>
            <span class="three numbers Medium">{{
              Number(getInfo.bronze.repurch_amount).toFixed(0)
            }}</span>
            <span class="four textEn"
              >{{
                splitFormat(getInfo.bronze.reward_amount).toFixed(0)
              }}USDT</span
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧我的中奖数 pc -->
    <pricelist v-if="isPC"></pricelist>
     <!-- 右侧我的中奖数 h5 -->
    <pricelist v-if="!isPC" :isShowFrist=true></pricelist>
  </div>
</template>
<script>
// 该页面为改动的记录页面

import { splitFormat } from "@/utils";
import pricelist from "../../common/priceList";
export default {
  name: "newRecode",
  components:{
    pricelist,

  },
  data() {
    return {
      // getData: this.$store.state.buyBack.assetBuyData,
      splitFormat: splitFormat,
      // totalnum: "",
      global: window.$v,
    };
  },
  watch: {
    //  监听phase 的变化
    phase(val) {
      this.$store.dispatch("buyBack/getInfoList", { phase: val });
    },
    chainId() {
     
      this.$store.dispatch("buyBack/getInfoList");
    },
  },
  created() {
    // this.$store.commit(
    //   "buyBack/changePhase",
    //   Number(sessionStorage.getItem("phaseNow"))
    // );
    this.$store.dispatch("buyBack/getInfoList");
  },
  computed: {
    lang() {
      return this.$store.state.language === "en" ? "en" : "zn";
    },
    chainId() {
      return this.$store.getters.chainId;
    },
    getData() {
      return this.$store.state.buyBack.assetBuyData;
    },
    phase() {
      return this.$store.state.buyBack.phase;
    },
    isPC() {
      return this.$store.getters.isPC;
    },
    // 总投入数量
    totalnum() {
      return splitFormat(
        this.$store.state.buyBack.assetBuyData.total_repurch_mdx
      );
    },
    // 瓜分数量
    getBlance() {
      return (
        Number(this.getData.balance) +
        Number(this.getData.total_repurch_mdx * this.getData.reward_gold_rate)
      );
    },
    // 销毁数量
    destorynum() {
      return (
        splitFormat(this.$store.state.buyBack.assetBuyData.total_repurch_mdx) *
        (1 - this.$store.state.buyBack.assetBuyData.reward_gold_rate)
      );
    },
    // 超巨星池
    superprice() {
      return Number(this.totalnum * 0.1) + Number(this.getData.balance);
    },
    // 瓜分数量
    getnumNew() {
      return this.superprice * 0.6;
    },
    getInfo() {
      console.log('getInfo: ',this.$store.state.buyBack.assetBuyData.repurch_reward_info)
      return this.$store.state.buyBack.assetBuyData.repurch_reward_info;
    },
    getnum() {
      return splitFormat(
        this.$store.state.buyBack.assetBuyData.repurch_reward_info.gold
          .reward_amount
      );
    },
  },
};
</script>

<style lang='less' scoped>
@import './h5newRecord.less';
// pc
@media screen and (min-width: 450px) {
  .one-1{
    width: 93px
  }
   .two-2{
      width: 98px;
  }
    .three-3 {
    // width: 147px;
    width: 110px;
  }
  .icon {
    display: flex;
    img {
      width: 36px;
      height: 36px;
      margin-right: 20px;
    }
  }
  .four {
    width: 191px;
    // text-align: right;
  }
  .one {
    width: 103px;
  }
  .two {
    width: 109px;
  }
  .three {
    // width: 147px;
    width: 119px;
  }
  .list-price {
    display: flex;
    // justify-content: space-between;
  }
  .list-price{
    width: 1200px;
    height: 294px;
    background: #ffffff;
    border-radius: 24px;
    padding: 20px 69px 39px;
    margin: auto;
    // margin-bottom: 79px;
    .priceNumber {
      margin: -24px 0 0 -71px;
    }
    .header {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      font-size: 12px;
      color: rgba(60, 60, 67, 0.6);
      padding-left: 46px;
      margin-bottom: 18px;
      // span {
      //   display: inline-block;
      // }
    }
    .frist-price {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 38px;
      img {
        width: 30px;
        height: 30px;
        margin-right: 16px;
      }
      .img-right {
        font-size: 14px;
        width: 476px;
        display: flex;
        align-items: center;
        // justify-content: space-between;
        // span {
        //   display: block;
        // }

     
      }
    }
  }
   i {
          // position: absolute;
          // left: 421px;
          display: inline-block;
          background: url("~@/views/buyBack/img/qustion.svg");
          width: 14px;
          height: 14px;
          vertical-align: top;
        }
  .no_data {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    img {
      width: 80px;
      height: 80px;
    }
  }
  .en {
    i {
      left: 130px !important;
    }
  }
}
// h5
// h5

</style>
