<template>
  <div class="number text" :style="{ '--width': width + 'px','--bg':bg }" :class="chainName">
    <div class="tags" v-if="isShow"></div>

    <div class="content">
      <!-- 金牌 -->
      <div class="glod">
        <span class="text Heavy">{{$t('JupiterAward')}} </span>
        <span>{{$t('WinningNumber1')}}：</span>
      </div>
      <div class="silver">
        <div class="numbers Bold">{{ glod[0] }}</div>
      </div>
    </div>
    <div class="content">
      <!-- 金牌 -->
      <div class="glod">
        <span class="text Heavy">{{$t('SatumAward')}}</span>
        <span class="cd-number">{{$t('WinningNumber1')}}：</span>
      </div>
      <div class="silver numbers Bold" v-for="(item, index) in glodHenxin" :key="index">
        <div class="secend">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "pricenumber",
  props: {
    width: {
      
      default:'',
    },
    isShow: {
      type: Boolean,
      default: true,
    },
    bg:{
      default:'#ffffff'
    }
  },
 
  computed: {
    chianId(){
      return this.$store.getters.chainId;
    },
    glod() {
      return this.$store.state.buyBack.assetBuyData.reward_gold;
    },
    glodHenxin() {
      return this.$store.state.buyBack.assetBuyData.reward_silver;
    },
  },
};
</script>
 <style lang="less" scoped>
// pc
.flex() {
  display: flex;
  align-items: center;
  justify-content: center;
}
//  设高宽
.w(@width,@height) {
  width: @width;
  height: @height;
}
.number {
  position: relative;
  width: var(--width);
  height: 152px;
  background:var(--bg);
  // background: #ffffff;
  border-radius: 10px;
  padding: 24px 58px;

  .tags {
    position: absolute;
    top: 0;
    left: 0;
    width: 9px;
    height: 152px;
    background: linear-gradient(224deg, #caacff 0%, #81a1ff 54%, #4198ff 100%);
    border-radius: 10px 0px 0px 10px;
  }
  .content {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    .glod {
      display: flex;
      justify-content: space-between;
      width: 146px;
      span:first-child {
        font-size: 16px;
        color: #000000;
        font-weight: 700;
      }
      span:last-child {
        font-weight: normal;
        // margin-left: 10px;
      }
      .cd-number {
      }
    }
    .silver {
      .secend,
      .numbers {
        font-size: 28px;
        color: #ffffff;
        text-align: center;
        line-height: 40px;
      }
      .numbers {
        margin-left: 16px;
        // width: 60px;
        // height: 40px;
        // background: #009A7F;
        // border-radius: 20px;  
        color: #009A7F; 
        border-bottom: 2px solid #009A7F;
      }
      .secend {
         margin-left: 19px;
        // border-radius: 50%;
        // width: 40px;
        // height: 40px;
        color: #3a8cef;
        border-bottom: 2px solid #3a8cef;
      }
    }
  }
}
.Bsc {
  .number {
    .tags {
      background: linear-gradient(180deg, #ffe46c 0%, #ffb053 100%);
    }
  }
  .content{
      .silver {
      .secend
       {
       
        color: #FF8400;
         border-bottom: 2px solid #FF8400;
       
      }
      // .silver{
      //     color: #FF8400;
      // }
      .numbers {
       color: #FFC900;
      //  background: #080808;
       border-bottom: 2px solid #FFC900;
      }
    
    }
  }
}
@media screen and (min-width: 450px) {
}
// h5
@media screen and (max-width: 450px) {
  
  .number {
    width: 323px;
    height: 102px;
    padding: 18px 0 18px 15px;
    .tags {
      width: 9px;
      height: 102px;
    }
    .content {
      margin-bottom: 23px;
      .glod {
        width: 104px;
        span {
          font-size: 14px;
        }
        span:first-child {
          font-size: 14px;
        }
      }
      .silver {
        .secend,
        .numbers {
          // width: 30px;
          // height: 30px;
          margin-left: 10px;
          line-height: 20px;
          font-size: 16px;
        }
      }
    }
  }
  .en{
    .number .content{
       margin-bottom: 7px;
    }
  }
}
</style>