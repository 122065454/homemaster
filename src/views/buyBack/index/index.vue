<template>
  <div class="main" :class="[chainName,getLanguage]">
    <title-banner> </title-banner>
    <section class="content " :class="[['start','nextperiod'].includes(currrentName)?'move':'']">
      <div class="nav text">
        <ul class="tab">
          <li
            v-for="(item, index) in tab"
            :key="index"
            @click="liclick(index, item)"
            :class="[index === i ? 'liclick' : '']"
          >
            {{ $t(`${item}`) }}
          </li>
        </ul>
      </div>
      <component
        :is="currrentName"
        @pageChange="pageChange"
        @pageresult="pageresult"
        @tipshow="tipshow"
      />

      <!-- 当前一期 -->
      <!-- <start></start> -->
      <!-- 下一期 -->
      <!-- <nextperiod></nextperiod> -->
      <!--进行中-->
      <!-- <pending></pending> -->
      <!-- 结果 -->
      <!-- <result></result> -->
      <!-- <start></start> -->
    </section>
     <newRecode v-if="['pending','result'].includes(currrentName)"></newRecode>
  
    <!-- 底部介绍 -->
    <joinRule></joinRule>
    <!-- 获奖提示 -->
    <priceDiagle ref="priceShow"></priceDiagle>
    <tipDialog ref="tips"></tipDialog>
    <!-- 温馨提示 -->
  </div>
</template>

<script>
import TitleBanner from "@/components/TitleBanner/TitleBanner";
import start from "../components/nowPeriodStart/nowPeriodStart";
import nextperiod from "../components/nextPeriod/nextPeriod";
import pending from "../components/nowPeriodPending/nowPeriodPending";
import joinRule from "../common/joinRule";
import result from "../components/nowPeriodResult/nowPeriodResult";
import priceDiagle from "../common/priceDialog";
import tipDialog from "../common/tips";
import newRecode from "../components/newRecord/newRecord";
export default {
  name: "buyback",
  components: {
    TitleBanner,
    start,
    nextperiod,
    pending,
    joinRule,
    result,
    priceDiagle,
    tipDialog,
    newRecode,
  },
  data() {
    return {
      tab: ["Lastround", "Currentround", "Nextround"],
      i: 1,
      global: window.$v,
      oneNums: 0,
      twoNums: 0,
    };
  },
  created() {
    this.$store.dispatch("buyBack/getInfoList");
  },
  watch: {
    chainId() {
      this.$store.dispatch("buyBack/getInfoList");
    },
  },
  computed: {
    chainId() {
      return this.$store.getters.chainId;
    },
    getData() {
      return this.$store.state.buyBack.assetBuyData;
    },
    getGlod() {
      return this.$store.state.buyBack.assetBuyData.reward_gold;
    },
    getSilver() {
      return this.$store.state.buyBack.assetBuyData.reward_silver;
    },
    // 当前状态
    currrentName() {
      return this.$store.state.buyBack.states;
    },
  },

  methods: {
    liclick(index) {
      const phaseNow = Number(sessionStorage.getItem("phaseNow"));
      let phase = phaseNow;

      //  判断是否为第一期 上一期不可点击 发请求期数加减1
      if (phase == 1 && index == 0) {
        return;
      }

      this.i = index;
      console.log("index", index);
      switch (index) {
        case 0:
          phase = phaseNow - 1;
          break;
        case 2:
          phase = phaseNow + 1;
          this.$store.commit("buyBack/changeState", "nextperiod");
          break;
      }
      this.$store.dispatch("buyBack/getInfoList", { phase });
    },
    // 改变状态
    pageChange() {
      this.$store.commit("buyBack/changeState", "pending");
      // 弹框弹出
      this.$refs.tips.show = true;
    },
    pageresult() {
      this.$store.commit("buyBack/changeState", "result");
    },
    tipshow(list) {
      this.oneNums=0
      this.twoNums=0
      list.forEach((item) => {
        this.tipsprice(item);
      });

      if (this.twoNums > 0 && this.oneNums > 0) {
        // 1.2 都有
        this.$refs.priceShow.show = true;
        const message = this.global.$t("henxinjuxin", {
          msg: this.oneNums,
          nums: this.twoNums,
        });
        // const message = this.global.$t('wontsucess.msgs')

        this.$message({
          message,
          type: "success",
          offset: "50",
        });
        //  this.$refs.priceShow.nameNum=1
      } else if (this.twoNums > 0 && this.oneNums == 0) {
        // 2
   
        this.$refs.priceShow.show = true;
        this.$refs.priceShow.nameNum = 2;
        this.$refs.priceShow.num = this.twoNums;
      } else if (this.twoNums == 0 && this.oneNums > 0) {
        // 1
      
        this.$refs.priceShow.show = true;
        this.$refs.priceShow.nameNum = 1;
        this.$refs.priceShow.num = this.oneNums;
      } else {
        const message = this.global.$t("putsuccess");
        // const message = this.global.$t('wontsucess.msgs')
       
        this.$message({
          message,
          type: "success",
          offset: "50",
        });
      }
    },
    // 奖励弹框
    tipsprice(val) {
      console.log("val", val);
      // 超巨星

      const str4 = val.substring(val.length - 4);
      const str2 = val.substring(val.length - 2);
      if (this.getGlod.includes(str4)) {
        // 超巨星
        this.oneNums += 1;
        // this.$refs.priceShow.show = true;
        // this.$refs.priceShow.num=str4
      } else if (this.getSilver.includes(str2)) {
        //  恒星
        // this.$refs.priceShow.show = true;
        this.twoNums += 1;
        // this.$refs.priceShow.num=str2
      } else {
        // 未中奖
      }
    },
  },
};
</script>


<style lang="less" scoped>
 @import './index.less';
</style>