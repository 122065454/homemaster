<template>
  <div class="main text">
    <pricenumber class="top" :width=735 v-if="isPC"></pricenumber>
    <div class="bottom">
      <div class="left">
        <div class="left-top" :class="lang">
          <div class="frist">
            <img src="@/views/buyBack/img/henxin-pc.png" alt="" />
            <div class="frist-top">
               <p class="title text Heavy">{{$t('SatumAward')}}</p>
               <p class="num">{{getInfo.silver.repurch_user}}个</p>
            </div>
            <div class="btn numbers SemiBold">{{$t('share')}} ${{splitFormat(getInfo.silver.reward_amount)}}</div>
          </div>
          <div class="two" :class="lang">
            <img src="@/views/buyBack/img/cjx-pc.png" alt="" />
            <div class="two-top">
              <p class="title text Heavy">{{$t('JupiterAward')}}</p>
              <p class="num">{{getInfo.gold.repurch_user}}个</p>
            </div>
  
            <div class="btn numbers SemiBold">{{$t('share')}} {{getBlance.toFixed(2)}}MDX</div>
          </div>
          <div class="three">
            <img src="@/views/buyBack/img/xingxin-pc.png" alt="" />
            <div class="three-top">
              <p class="title text Heavy">{{$t('PlutoAward')}}</p>
            <p class="num">{{getInfo.bronze.repurch_user}}个</p>
            </div>
            <div class="btn numbers SemiBold">{{$t('share')}} ${{splitFormat(getInfo.bronze.reward_amount)}}</div>
          </div>
        </div>
        <!--总投入数量 -->
        <div class="left-buttom">
          <div class="put_num">
            <span class="text Bold">{{$t('TotalMDX')}}</span>
            <span class="numbers Medium"><CountUp :endVal="totalnum || 0" />MDX</span>
            <!-- <span>{{totalnum}} MDX</span> -->
          </div>
          <span v-if="isPC" class="middle_line">|</span>
          <div class="destroy">
            <span class="text Bold">{{$t('MDXburned')}}：</span>
            <span class="numbers Medium"><CountUp :endVal="destorynum || 0" />MDX</span>
            <!-- <span>{{destorynum.toFixed(2)}} MDX</span> -->
          </div>
        </div>
      </div>
      <!-- h5号码 -->
      <pricenumber class="top" v-if="!isPC" :isShow='false'></pricenumber>
      <!-- <div class="right">
        <pricelist></pricelist>
      </div> -->
    </div>
  </div>
</template>

<script>
import pricenumber from "../../common/priceNumber";
import pricelist from "../../common/priceList";
import { splitFormat } from "@/utils";

export default {
  name: "result",
  components: {
    pricenumber,
    pricelist,
  },
  data() {
    return{
      // getData:this.$store.state.buyBack.assetBuyData,
      splitFormat:splitFormat
    }
  },
  watch:{
    chainId(){  
       this.$store.dispatch("buyBack/getInfoList");
    }
  },
  computed: {
    getData(){
     return this.$store.state.buyBack.assetBuyData
    },
    lang() {
      return this.$store.state.language === "en" ? "en" : "zn";
    },
    chainId() {
      return this.$store.state.chainId;
    },
    isPC() {
      return this.$store.getters.isPC;
    },
    // 总投入数量
    totalnum(){
      return splitFormat(this.getData.total_repurch_mdx)
    },
    // 销毁数量
    destorynum(){
     return splitFormat(this.getData.total_repurch_mdx)*(1-this.getData.reward_gold_rate)
    },
    // 奖励
    getInfo(){
      return  this.getData.repurch_reward_info
    },
    getnum(){
      return  splitFormat(this.getData.repurch_reward_info.gold.reward_amount)
    },
    //瓜分数量
    getBlance(){
      return   (Number(this.getData.balance)+Number(this.getData.total_repurch_mdx*this.getData.reward_gold_rate))*0.6
    }
    
  }
 
};
</script>
 <style lang="less" scoped>
 @import './nowPeriodResult.less';
</style>