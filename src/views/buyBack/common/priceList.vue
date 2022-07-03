<template>
  <div class="main text" :class="lang">
    <span class="title text Heavy" v-if="!isPC">{{$t('receiving')}}</span>
    <header>
      <div class="header" v-if="isPC">
        <span class="header1">{{$t('Times')}}</span>
        <span class="header2">{{$t('Contribute')}}</span>
        <span class="header3">{{$t('Proportion')}}</span>
        <span class="header4">{{$t('Rewards')}}</span>
      </div>
      <!-- H5 header -->
      <div class="header" v-if="!isPC">
        <div class="header_left">
          <span>{{$t('Contribute')}}</span>
          <span>{{$t('Proportion')}}</span>
        </div>
        <div class="header_right">
          <span>{{$t('Rewards')}}</span>
          <!-- <span>{{$t('Times')}}</span> -->
        </div>
      </div>
    </header>
    <!-- 奖项 -->
    <div class="price-list">
      <img v-if="isShowFrist"  src="@/views/buyBack/img/pc-one.png" alt="" />
      <div v-if="isPC">
        <span class="one  text Bold" v-if="isShowFrist" >{{$t('JupiterAward')}}</span>
        <span class="two numbers Medium">{{ getlist.gold.user_count }}</span>
        <span class="three numbers Medium">{{ getlist.gold.user_repurch.toFixed(0) }}</span>
        <span class="four numbers Medium">{{ sliceData(getlist.gold.user_rate * 100,3) }}%</span>
        <span class="five numbers Medium">{{
          getData.status !== 3 ? $t('DJX'): getBlance.toFixed(2) + "MDX"
        }}</span>
      </div>
      <!-- h5 -->
      <div v-if="!isPC" class="price-list-h5">
        <span class="one text Bold">{{$t('JupiterAward')}}</span>
        <div class="middel">
          <div class="putin numbers Medium">
            <span class="two">{{ getlist.gold.user_repurch.toFixed(0)  }}</span>
            <span class="four"
              >{{ sliceData(getlist.gold.user_rate * 100,3) }}%</span
            >
          </div>
          <div class="price_num numbers Medium">
            <span class="five">{{
              getData.status !== 3 ? $t('DJX') :getBlance.toFixed(2) + "MDX"
            }}</span>
            <!-- <span class="three">{{  getlist.gold.user_count }}</span> -->
          </div>
        </div>
      </div>
      <div
        @click="openFrist"
        :class="[
          'btn',getData.status == 3 && getlist.gold.user_reward ? '' : 'no_cliclk',]" >
        {{$t('Collect')}}
      </div>
      <!-- 第2名 -->
    </div>
    <div class="price-list">
      <img v-if="isShowFrist"  src="@/views/buyBack/img/pc-two.png" alt="" />
      <div v-if="isPC">
        <span class="one text Bold" v-if="isShowFrist" >{{$t('SatumAward')}}</span>
        <span class="two numbers Medium">{{ getlist.silver.user_count }}</span>
        <span class="three numbers Medium">{{ getlist.silver.user_repurch.toFixed(0) }}</span>
        <span class="four numbers Medium"
          >{{ sliceData(getlist.silver.user_rate * 100,3) }}%</span
        >
        <span class="five numbers Medium">{{
          getData.status !== 3
            ? $t('DJX')
            : sliceData(getlist.silver.user_reward) + "USDT"
        }}</span>
      </div>
      <div v-if="!isPC" class="price-list-h5">
        <span class="one text Bold" >{{$t('SatumAward')}}</span>
        <div class="middel numbers Medium">
          <div class="putin">
            <span class="two">{{  getlist.silver.user_repurch.toFixed(0) }}</span>
            <span class="four"
              >{{ sliceData(getlist.silver.user_rate * 100,3) }}%</span
            >
          </div>
          <div class="price_num">
            <span class="five">{{
              getData.status !== 3
                ? $t('DJX')
                : sliceData(getlist.silver.user_reward) + "USDT"
            }}</span>
            <!-- <span class="three">{{ getlist.silver.user_count }}</span> -->
          </div>
        </div>
      </div>
      <el-button :class="['btn', state(secondReward,secondIsClaimed) == 3 ? '' : 'no_cliclk']"  
                :loading="loading2" @click="getSecondReward">
                {{ state(secondReward,secondIsClaimed) == 2 ?$t('Collected') : $t('Collect') }}
     </el-button>
    </div>
    <div class="price-list">
      <img v-if="isShowFrist"  src="@/views/buyBack/img/pc-three.png" alt="" />
      <div v-if="isPC">
        <span class="one text Bold" v-if="isShowFrist" >{{$t('PlutoAward')}}</span>
        <span class="two numbers Medium">{{ getlist.bronze.user_count }}</span>
        <span class="three numbers Medium">{{ getlist.bronze.user_repurch.toFixed(0) }}</span>
        <span class="four numbers Medium"
          >{{ sliceData(getlist.bronze.user_rate * 100,3) }}%</span
        >
        <span class="five numbers Medium">{{
          getData.status !== 3
            ? $t('DJX')
            : sliceData(getlist.bronze.user_reward) + "USDT"
        }}</span>
      </div>
      <div v-if="!isPC" class="price-list-h5">
        <span class="one text Bold">{{$t('PlutoAward')}}</span>
        <div class="middel numbers Medium">
          <div class="putin">
            <span class="two">{{ getlist.bronze.user_repurch.toFixed(0) }}</span>
            <span class="four">{{ sliceData(getlist.bronze.user_rate * 100,3) }}%</span
            >
          </div>
          <div class="price_num">
            <span class="five">{{
              getData.status !== 3
                ? $t('DJX')
                : sliceData(getlist.bronze.user_reward) + "USDT"
            }}</span>
            <!-- <span class="three">{{  getlist.bronze.user_count}}</span> -->
          </div>
        </div>
      </div>
      <el-button :class="['btn', state(thirdReward,thirdIsClaimed) == 3 ? '' : 'no_cliclk']"  
                 :loading="loading" @click="getThirdReward">
                 {{ state(thirdReward,thirdIsClaimed) == 2 ?$t('Collected') : $t('Collect') }}
              
      </el-button>
    </div>
  </div>
</template>

<script>
import { destroyUtils } from "@/utils/publicErc20";
import { _splitFormat, _sliceData } from "@/utils/index";

// 0 -> 没结束
// 1 -> amount0
// 2 -> 结束 && amount > 0 && true
// 3 -> 结束 && amount > 0 && false

let actionTip = null;
export default {
  name: "awardlist",
  components: {},
  props:{
   isShowFrist:{
     type: Boolean,
      default: false,
   }
  },
  data() {
    return {
      secondReward: 0,
      secondIsClaimed: false,
      thirdReward: 0,
      thirdIsClaimed: false,
      btnName2: "",
      btnName3: "",
      sliceData: _sliceData,
      global:window.$v,
      loading:false,
      loading2:false,
    };
  },
  created() {
   
  },
  watch:{
   getData(){
      
      this.getInfo() 
   },
   chianId(){
      this.getInfo() 
   }
   
  },
  computed: {
    chianId(){
      return this.$store.getters.chainId;
    },
    lang() {
      return this.$store.state.language === "en" ? "en" : "zn";
    },
    getData() {
      return this.$store.state.buyBack.assetBuyData;
    },
    state() {
      return (reward,clamed) => {
        if (this.getData.status == 3) {
          if (reward == 0) {
            return 1;
          } else {
            if (clamed) {
              return 2;
            } else {
              return 3;
            }
          }
        } else {
          return 0;
        }
      };
    },

    phase() {
      return this.$store.state.buyBack.phase;
    },
    isPC() {
      return this.$store.getters.isPC;
    },
    //  getData(){
    //   return this.$store.state.buyBack.assetBuyData;
    // },
    repurchFun() {
      const {contract, repurch_decimal, reward_decimal} = this.getData
      console.log({contract, repurch_decimal, reward_decimal})
      console.log('account', this.account)
      return destroyUtils(
        this.getData.contract,
        this.getData.repurch_decimal,
        this.getData.reward_decimal,
        this.account
      );
    },
    isShowData() {
      return this.secondReward == 0 && this.thirdReward == 0;
    },
    // 本期获得数组
    getlist() {
      return this.$store.state.buyBack.assetBuyData.repurch_reward_info;
    },

    getMyBlance(){
      return   Number(this.getData.balance)+Number(this.getData.total_repurch_mdx*this.getData.reward_gold_rate)
               
    },
    // 瓜分数量
    getBlance(){
      return this.getMyBlance*this.sliceData(this.getlist.gold.user_rate )
    }
  },
  mounted() {
    this.getInfo()
   
  },
  methods: {
  //  一等奖
  openFrist(){
      this.$message({
          message: `${this.global.$t('wonfristprice')}`,
          type: 'success',
          offset:'50'
        });
  },
   async getInfo(){
    console.log('secondReward',this.secondReward,'thirdReward',this.thirdReward,'secondIsClaimed',this.secondIsClaimed ,'thirdIsClaimed',this.thirdIsClaimed);
    const { getUserSecondPrize, getUserThirdPrize } = await this.repurchFun;
    const { secondAmount, secondStatus } = await getUserSecondPrize();
    const { thirdAmount, thirdStatus } = await getUserThirdPrize();
    this.secondReward = secondAmount;
    this.thirdReward = thirdAmount;
    this.secondIsClaimed = secondStatus;
    this.thirdIsClaimed = thirdStatus;
    },
    async getSecondReward() {
      this.loading2=true
      console.log("getSecondReward");
      const Approvemsg = `claim`;
      const { claimSecondPrize } = await this.repurchFun;
      claimSecondPrize()
        .then((res) => {
          const msg = `${Approvemsg} Success`;
          actionTip = this.$overalltip({
            type: "success",
            msg,
          });
          this.loading2=false
          // 按钮置灰,不可点击
          this.secondIsClaimed = true;
        })
        .catch((err) => {  
          this.loading2=false                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
          overalltip.close();
          const msg = `${Approvemsg} Error`;
          actionTip = this.$overalltip({
            type: "error",
            msg,
          });
        });
    },
    async getThirdReward() {
      this.loading=true
      console.log("getThirdReward");
      const Approvemsg = `claim`;
      const { claimThirdPrize } = await this.repurchFun;
      claimThirdPrize()
        .then((res) => {
          const msg = `${Approvemsg} Success`;
          actionTip = this.$overalltip({
            type: "success",
            msg,
          });
          this.loading=false
          this.thirdIsClaimed = true;
        })
        .catch((err) => {
          this.loading=false
          overalltip.close();
          const msg = `${Approvemsg} Error`;
          actionTip = this.$overalltip({
            type: "error",
            msg,
          });
        });
    },
  },
  destroyed() {
    if (actionTip) {
      actionTip.close();
    }
  },
};
</script>
 <style lang="less" scoped>
// 按钮变灰
.no_cliclk {
  background: rgba(60, 60, 67, 0.18) !important;
  pointer-events: none;
}
.Bsc {
   span{
    color: #e5a800;
  }
  .main {
    .price-list {
      .btn {
        background: #e5a800;
        color: #ffffff;
      }
    }
  }
}
 button:disabled {
      background: rgba(60, 60, 67, 0.18) !important;
      pointer-events: none !important;
      // color: #ffffff !important;
    }
// pc
@media screen and (min-width: 450px) {
  .en{
    header{
      .header4,.header3{
        text-align: right;
    } 
    .price-list {
      .two{
        padding-left: 10px;
      }
    }
  }
  }
  span{
    color: #009A7F;
  }
  .main {
    width: 522px;
    .title {
      font-size: 14px;
      color: #000000;
    }
    header {
      height: 48px;
      display: flex;
      // justify-content: space-around;
      align-items: center;
      span {
        font-size: 12px;
        //  margin-right: 34px;
        display: inline-block;
        color: rgba(60, 60, 67, 0.6);
      }
      .header1{
        width: 95px;
        // margin-right: 34px;
        // text-align: right;
      }
      .header2{
        // margin-right: 34px;
        width: 116px;
      }
      .header3{
        width: 105px;
      
      }
       .header4{
        width: 105px;
      
      }
    }
    .price-list {
      position: relative;
      display: flex;
      align-items: center;
      height: 68px;
      font-size: 14px;
      span {
        display: inline-block;
      }
      .one {
        // margin-right: 20px;
        width: 78px;
      }
      .two {
        // margin-right: 32px;
        width: 100px;
      }
      .three {
        width: 117px;
      }
      .four {
        width: 99px;
      }
      .five{
        width: 145px;
      }

      img {
        width: 30px;
        height: 30px;
        margin-right: 16px;
      }
      .btn {
        position: absolute;
        right: -12px;
        height: 37px;
        width: 71px;
        background: #009a7f;
        border-radius: 19px;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        line-height: 37px;
      }
    }
  }
  .en{
    .header .header2{
      width: 68px;
    }
  }
}
// h5
@media screen and (max-width: 450px) {
  .main {
    width: 100%;
    padding: 16px 10px;
    background: #FFFFFF;
    border-radius: 24px;
   
    transform: translateY(-21px);
    .title {
      font-size: 14px;
      color: #000000;
    }

    header {
      height: 68px;
      display: flex;
      width: 100%;
      align-items: center;
      border-bottom: 1px solid rgba(60, 60, 67, 0.1);
      .header {
        display: flex;
        align-items: center;
      }
      span {
        font-size: 12px;
        margin-bottom: 3px;
        color: rgba(60, 60, 67, 0.6);
      }
      .header_right,
      .header_left {
        display: flex;
        flex-direction: column;
      }
      .header_left {
        // padding-left: 108px;
        width: 154px;
        text-align: right;
      }
      .header_right {
        width: 83px;
        text-align: right;
      }
    }
    .price-list {
      position: relative;
      display: flex;
      align-items: center;
      height: 68px;
      font-size: 14px;
      &:last-child {
        margin-bottom: 15px;
      }
      span {
        display: inline-block;
      }
      .price-list-h5 {
        display: flex;
        align-items: center;
      }
      .middel {
        display: flex;
        // justify-content: space-between;
        width: 154px;
      }
      .putin,
      .price_num {
        display: flex;
        flex-direction: column;
      ;
      }
      .putin{
        margin-left: 22px
      }
      .price_num {
        text-align: right;
        width: 96px;
        justify-content: center 
      }
      .one {
        width: 56px;
      }
      .two {
        // margin-right: 32px;
      }
      .three,
      .four {
        color: rgba(60, 60, 67, 0.6);
      }

      img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
      .btn {
        position: absolute;
        right: 0;
        height: 37px;
        width: 71px;
        background: #009a7f;
        border-radius: 19px;
        font-size: 14px;
        color: #ffffff;
        text-align: center;
        line-height: 37px;
      }
    }
  }
}
</style>