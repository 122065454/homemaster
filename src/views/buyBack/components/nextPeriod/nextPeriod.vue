<template>
  <div class="nowPeriod text" :class="lang">
    <h1 class="h1 text Bold">{{ $t("belucky") }}</h1>
    <div class="column">
      <div class="logo">
        <img src="@/views/buyBack/img/price.png" alt="" />
      </div>
      <h2 class="h2 numbers SemiBold">${{ getPrice }}</h2>
    </div>
    <div class="add">
      <img src="@/views/buyBack/img/add.png" alt="" />
    </div>
    <div class="column">
      <div class="logo">
        <img src="@/views/buyBack/img/mdx.png" alt="" />
      </div>
      <h2 class="h2 text Heavy">{{ $t("burningPen.text", { msg: percentage }) }}</h2>
    </div>
    <!-- 游戏倒计时 -->
    <div class="game">
      <!-- <div class="game_time">
         <span class="game_times">06-05</span>
          <div class="card__item-value new-item-value">
            <span>21</span
            >:<span>00</span
            >:<span>00</span>
             
      </div>
      </div> -->
   
      <h1 class="text Heavy">{{ $t("fristgame1") }}</h1>
      <h2 class="">{{ $t("fristgame2") }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "nextperiod",
  components: {},
  computed: {
    lang() {
      return this.$store.state.language === "en" ? "en" : "zn";
    },
    getData() {
      return this.$store.state.buyBack.assetBuyData;
    },
    getPrice() {
      return Number(this.getData.amount);
    },
    // 瓜分百分比
    percentage() {
      return this.getData.reward_gold_rate * 100;
    },
    // 格式化日小时
    format() {
      return formatDate(
        this.$store.state.buyBack.assetBuyData.end_time * 1000
      ).ymdhms.slice(5);
    },
  },
};
</script>
 <style lang="less" scoped>
 
.flex() {
  display: flex;
  align-items: center;
  justify-content: center;
}
//  字体居中
.center(@height) {
  text-align: center;
  line-height: @height;
}
//  设高宽
.w(@width,@height) {
  width: @width;
  height: @height;
}
// 字体
.font(@size,@weight) {
  font-size: @size;
  font-weight: @weight;
}
// pc
 .game_time{
 display: flex;
 align-items: center;
 justify-content: center;
 .game_times{
   font-size: 22px;
   margin-right: 10px;
   
 }
 }
  .new-item-value {
    span {
      width: 32px;
      height: 32px;
      background: #242424;
      color: white;
      border-radius: 8px;
      /* padding: 0 2px; */
      font-size: 20px;
      display: inline-block;
      text-align: center;
      padding-right: 1px;
      line-height: 32px;
      font-weight: 600;
    }
  }
  .card__item-value {
    color: #48587b;
    font-size: 24px;
    font-weight: 500;
  }
.nowPeriod {
  .h1 {
    text-align: center;
    font-size: 30px;
    margin-bottom: 27px;
  }
  h3 {
    font-size: 16px;
    background: #242424;
    font-weight: 600;
    color: #ffffff;
    width: 187px;
    margin: auto
  }
  .column {
    .flex();
    width: 688px;
    height: 104px;
    background: linear-gradient(90deg, #b8cbfe 0%, #ddd6ff 100%);
    border-radius: 40px;
    margin: 0 auto;
    .logo {
      .w(60px,60px);
      img {
        width: 100%;
      }
    }
    .h2 {
      font-size: 50px;
      font-weight: 600;
      color: #000000;
      margin-left: 20px;
    }
  }
  .add {
    .w(28px,28px);
    margin: 0 auto;
    text-align: center;
    margin-top: 30px;
    margin-bottom: 29px;
    img {
      width: 100%;
    }
  }
  .game {
    margin-top: 30px;
    text-align: center;
    h1 {
      font-size: 30px;
      color: rgba(29, 29, 29, 0.6);
      margin-top: 15px;
      margin-bottom: 10px;
    }
    h2 {
      font-size: 20px;
      color: rgba(34, 34, 36, 0.45);
      display: inline;
      margin-top: 5px;
    }
  }
}
.en {
  .column {
    .h2 {
      font-size: 36px;
    }
  }
}
.Bsc {
  .nowPeriod {
    .column {
      background: linear-gradient(90deg, #fed9b8 0%, #ddd6ff 100%);
    }
  }
}
@import './h5nextPeriod.less';
</style>