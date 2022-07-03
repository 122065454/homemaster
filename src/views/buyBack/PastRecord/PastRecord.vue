<template>
  <div>
    <title-banner> </title-banner>
    <section class="content text" :class="[chainName,getLanguage]">
      <div class="icon">
        <img
          src="@/views/buyBack/img/back-pc.png"
          alt=""
          @click="$router.push('buyback')"
        />
        <!-- 选择框 -->
        <Select></Select>
      </div>
      <!-- 获奖名单 重构 pc-->
      <div class="list-price text"  v-if="isPC">
         <div class="list-top" :class="lang">
             <div class="frist-price">
                <div class="top text Bold">
                   <span>{{$t('JupiterAward')}} &nbsp; <b>{{$t('WinningNumber1')}}:</b></span>
                    <div class="number numbers">
                       {{ glod[0] }}
                    </div>
                </div>
                <div class="bottom">
                    <span class="left">{{$t('TotalMDX')}}:</span>
                    <!-- <span class="nums">{{totalnum.toFixed(0)}}MDX</span> -->
                     <span class="nums numbers"><CountUp  :endVal="totalnum || 0" :decimalPlaces='0' />MDX</span>
                </div>
             </div>
              
             <div class="two-price">
                 <div class="top text Bold">
                   <span>{{$t('SatumAward')}} &nbsp;<b>{{$t('WinningNumber1')}}：</b></span>
                   <div class="secend numbers" v-for="(item, index) in glodHenxin" :key="index">
                  <div >{{ item }}</div>
                </div>
                </div>
                <div class="bottom">
                   <span class="left">{{$t('Quantitydestroyed')}}:</span>
                   <!-- <span class="nums">{{Number(totalnum*0.9).toFixed(0)}}MDX</span> -->
                    <span class="nums numbers"><CountUp  :endVal="totalnum*0.9|| 0" />MDX</span>
                </div>
             </div>
               <div class="caojuxin">
                  <span>{{ $t("caojuxinci") }}:</span>
                <el-tooltip
                class="item"
                trigger="click"
                effect="dark"
                placement="bottom"
                popper-class="tipCase"
              >
                <div slot="content" v-html="global.$t('caojuxinciTips2')"></div>
                <i></i>
              </el-tooltip>
                  <!-- <span class="nums">{{superprice.toFixed(0)}}MDX</span> -->
                   <span class="nums numbers"><CountUp  :endVal="superprice|| 0" />MDX</span>
               </div>
                 
         </div>
         <div class="line"></div>
        <!-- 具体名单 -->
        <newRecode></newRecode>
      </div>



      <!-- 获奖名单 重构 h5-->
      <div class="list-price text" v-if="!isPC">
        <div class="left">
          <!-- 本期未结束就不显示 -->
         <div >
          <priceNumber :isShow="false" class="priceNumber" bg='none'></priceNumber>
          <div class="header">
            <span>{{$t('Prizelevels')}}</span>
            <span>{{$t('hjrc')}}</span>
            <span>{{$t('TotalMDX')}}</span>
            <span>{{$t('Sharerewards')}}</span>
          </div>
          <div class="frist-price">
            <img src="@/views/buyBack/img/pc-one.png" alt="" />
            <div class="img-right">
              <span class="price-detail2 text Bold">{{$t('JupiterAward')}}</span>
              <span class="price-nums2 numbers Medium">{{getInfo.gold.repurch_user}}</span>
              <span class="putall2 numbers Medium">{{Number(getInfo.gold.repurch_amount).toFixed(0)}}</span>
              <span class="mdx2 numbers Medium">{{getnumNew.toFixed(0)}}MDX</span>
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
            </div>
          </div>
          <div class="frist-price">
            <img src="@/views/buyBack/img/pc-two.png" alt="" />
            <div class="img-right">
              <span class="price-detail text Bold">{{$t('SatumAward')}}</span>
              <span class="price-nums numbers Medium">{{getInfo.silver.repurch_user}}</span>
              <span class="putall numbers Medium">{{Number(getInfo.silver.repurch_amount).toFixed(0)}}</span>
              <span class="mdx numbers Medium">{{splitFormat(getInfo.silver.reward_amount).toFixed(0)}}USDT</span>
            </div>
          </div>
          <div class="frist-price">
            <img src="@/views/buyBack/img/pc-three.png" alt="" />
            <div class="img-right">
              <span class="price-detail text Bold">{{$t('PlutoAward')}}</span>
              <span class="price-nums numbers Medium">{{getInfo.bronze.repurch_user}}</span>
              <span class="putall numbers Medium">{{Number(getInfo.bronze.repurch_amount).toFixed(0)}}</span>
              <span class="mdx numbers Medium">{{splitFormat(getInfo.bronze.reward_amount).toFixed(0)}}USDT</span>
            </div>
          </div>
          <div class="line-bottom" v-if="isPC"></div>
          <!-- 总投入数 -->
          <div class="card-bottom">
            <span class="text Bold">{{$t('TotalMDX')}}：</span>
            <span class="numbers Medium">{{totalnum.toFixed(0)}}MDX </span>
          </div>
          <div class="card-bottom" :class="lang">
            <div>
                <span class="text Bold">{{$t('caojuxinci')}}:</span>
               <el-tooltip
                class="item"
                trigger="click"
                effect="dark"
                placement="bottom" 
                popper-class="tipCase"
              >
                <div slot="content" v-html="global.$t('caojuxinciTips2')"></div>
                <i></i>
              </el-tooltip>
            </div>
            
            <span class="numbers Medium">{{superprice.toFixed(0)}}MDX </span>
          </div>
         </div>
        </div>
        <div class="right">
          <pricelist :isShowFrist='true'></pricelist>
        </div>
      </div>
      
    </section>
    <!-- 详细记录 -->
    <detail></detail>
  </div>
</template>

<script>
import Select from "@/views/buyBack/common/select.vue";
import priceNumber from "../common/priceNumber";
import TitleBanner from "@/components/TitleBanner/TitleBanner";
import pricelist from "../common/priceList";
import detail from "../components/detailRcored/detailRcored";
import newRecode from "../components/newRecord/newRecord";
import { splitFormat } from "@/utils";
export default {
  name: "award",
  components: {
    TitleBanner,
    priceNumber,
    pricelist,
    Select,
    Option,
    detail,
    newRecode
  },
  data() {
    return {
      // getData: this.$store.state.buyBack.assetBuyData,
      splitFormat: splitFormat,
      // totalnum: "",
      global:window.$v
    };
  },
  watch:{
  //  监听phase 的变化
    phase(val){
     this.$store.dispatch("buyBack/getInfoList",{phase:val})
    },
    chainId(){
     
       this.$store.dispatch("buyBack/getInfoList");
      
    }
    
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
    glod() {
      return this.$store.state.buyBack.assetBuyData.reward_gold;
    },
    glodHenxin() {
      return this.$store.state.buyBack.assetBuyData.reward_silver;
    },
    lang() {
      return this.$store.state.language === "en" ? "en" : "zn";
    },
    chainId() {
      return this.$store.getters.chainId;
    },
    getData() {
      return this.$store.state.buyBack.assetBuyData;
    },
    phase(){
    return this.$store.state.buyBack.phase;
    },
    isPC() {
      return this.$store.getters.isPC;
    },
    // 总投入数量
    totalnum() {
      return splitFormat(this.$store.state.buyBack.assetBuyData.total_repurch_mdx) 
      
    },
    // 瓜分数量
    getBlance(){
      return   Number(this.getData.balance)+Number(this.getData.total_repurch_mdx*this.getData.reward_gold_rate)
               
    },
    // 销毁数量
    destorynum() {
      return (
        splitFormat(this.$store.state.buyBack.assetBuyData.total_repurch_mdx) *
        (1 - this.$store.state.buyBack.assetBuyData.reward_gold_rate)
      );
    },
    // 超巨星池
     superprice(){
      return  Number(this.totalnum*0.1)+Number(this.getData.balance)
     },
    // 瓜分数量
     getnumNew(){
      return this.superprice*0.6
     },
    getInfo() {
      return this.$store.state.buyBack.assetBuyData.repurch_reward_info;
    },
    getnum() {
      return splitFormat(
        this.$store.state.buyBack.assetBuyData.repurch_reward_info.gold
          .reward_amount
      );
    },
  }

};
</script>
 <style lang="less" scoped>
 @import './PastRecord.less';
</style>