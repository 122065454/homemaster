<template>
  <div class="nowPeriod text" :class="lang">
    <div class="head">  
     <div class="card__item-value new-item-value numbers SemiBold">
            <span>{{ formatSecondsToDate.h }}</span
            >:<span>{{ formatSecondsToDate.m }}</span
            >:<span>{{ formatSecondsToDate.s }}</span>
             
    </div>
     <span class="head-right text Bold">{{$t('belucky')}}</span>
    </div>
  
    <div class="column">
      <div class="logo">
        <img src="@/views/buyBack/img/price.png" alt="" />
      </div>
      <h2 class="h2 numbers SemiBold">${{getPrice}}</h2>
    </div>
    <div class="add">
      <img src="@/views/buyBack/img/add.png" alt="" />
    </div>
    <div class="column">
      <div class="logo">
        <img src="@/views/buyBack/img/mdx.png" alt="" />
      </div>
      <h2 class="h2 text Heavy">{{$t('burningPen.text',{msg:percentage})}}</h2>
    </div>
    <!-- 游戏倒计时 -->
    <div class="game">
      <div class="game_left">
        <h1>{{$t('fristgame1')}}</h1>
        <h2>{{$t('startssoon')}}</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { formatSecondsToDateDay ,splitFormat} from "@/utils";

let interval = null;
export default {
  name: "start",
  data() {
    return {
      // getData:this.$store.state.buyBack.assetBuyData,

      time:''
      
    };
  },
  created(){
    const currentTime=Math.round(new Date() / 1000)
    const timeNow=this.getData.start_time-currentTime
    timeNow<0?this.time=0:this.time=timeNow
      // 初始化时间
    //  parseInt(new Date(this.getData.end_time).getTime() - new Date().getTime()) / 1000 <0?this.time=0:this.time= parseInt(new Date(this.getData.end_time).getTime() - new Date().getTime()) / 1000
  },
   mounted() {
    this.startCountdown();
    console.log('12',splitFormat('0.001'));
  },
  computed: {
    getData(){
    return this.$store.state.buyBack.assetBuyData
    },
    lang() {
      return this.$store.state.language === "en" ? "en" : "zn";
    },
    // 格式化时间
    formatSecondsToDate() {
      return formatSecondsToDateDay(this.time);
    },
     // 瓜分奖励
    getPrice() {
      return (
        Number(this.getData.amount)
      );
    },
    // 瓜分百分比
    percentage(){
      return this.getData.reward_gold_rate*100
    }
  },
 
  methods: {
    // 开始倒计时定时器
    startCountdown() {
      interval = setInterval(() => {
        
        if (this.time <= 0) {
          this.$emit("pageChange");
          clearInterval(interval);
          return
        }
        this.time -= 1;
      }, 1000);
    },
  },
  watch: {
    time() {
      clearInterval(interval);
      this.startCountdown();
    },
  },
  destroyed() {
    clearInterval(interval);
  },
};
</script>
 <style lang="less" scoped>
 @import './nowPeriodStart.less';
</style>