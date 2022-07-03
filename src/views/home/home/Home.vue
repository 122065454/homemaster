<template>
  <div class="home" :class="[chainName, getLanguage]" ref="scrollSign">
    <Carousel />
    <div class="home__assets">
      <div class="container container-color">
        <div class="new-container">
          <p class="home__assets-amount">
            <span class="amount-icon"></span>
            <span class="text">
              {{ $t("MDXtotals") }}
              <span class="textEn">{{ onresizeIsPC ? "" : "" }}</span> 
            </span>

            <CountUp class="amount-number numbers Medium" :endVal="(Number(homeData.heco_total_tvl) + Number(homeData.bsc_total_tvl)) || 0" />
            <!-- <span class="amount-unit" v-if="onresizeIsPC">
              USDT
            </span> -->
          </p>
        
          <div class="home-info-pc">
            <div class="h-info-item"> 
                <img src="@/assets/HECO.png" class="icon-img" />
                <span class="hi-name">  {{ $t("MDXtotal") }}</span>
                <span class="hi-num"><CountUp class="amount-number numbers Medium" :endVal="Number(homeData.heco_total_tvl) || 0" /></span>
                <!-- <span class="hi-name">USDT</span> -->
            </div>
            <div class="h-info-item"> 
                <img src="@/assets/Bsc-icon.png" class="icon-img" />
                <span class="hi-name"> {{ $t("MDXtotal") }}</span>
                <span class="hi-num"><CountUp class="amount-number numbers Medium" :endVal="Number(homeData.bsc_total_tvl) || 0" /></span>
                <!-- <span class="hi-name">USDT</span> -->
            </div>
          </div>
           <div class="home-info-h5">
            <div class="h-info-item text"> 
                <p class="hi-name"><img src="@/assets/HECO.png" class="icon-img" /><span>{{ $t("MDXtotal") }}</span></p>
                <p class="hi-num numbers"><CountUp  :endVal="Number(homeData.heco_total_tvl) || 0" /></p>
            </div>
            <p class="line"></p>
            <div class="h-info-item text"> 
                <p class="hi-name"><img src="@/assets/Bsc-icon.png" class="icon-img" /><span>{{ $t("MDXtotal") }}</span></p>
                <p class="hi-num numbers"><CountUp  :endVal="Number(homeData.bsc_total_tvl) || 0" /></p>
            </div>
          </div>
          <div class="home__assets-price-card text">
            <div class="price__card-item no-margin ">
              <!-- 当前价格 -->
              <div class="card__item-key">{{ $t("CurrentMDEXPrice") }}</div>
              <div class="card__item-value numbers">
                <!-- <CountUp :endVal="" /> -->
                {{ currentPrice }}
              </div>
            </div>
            <!--    MDX 余额  -->
            <div class="price__card-item no-margin">
              <div class="card__item-key">{{ $t("Yourbalance") }}</div>
              <div class="card__item-value numbers">
                <CountUp :endVal="balance || 0" />
              </div>
            </div>
            <div class="price__card-item">
              <!-- 待奖励金额 -->
              <div class="card__item-key">
                {{ $t("PendingAirdropRewards") }}
                <el-tooltip effect="dark" content="HECO&BSC" :placement="isPC ? 'right-end' : 'bottom'" popper-class="halving" >
                  <img class="tist" :src="tist" alt=""/>
                </el-tooltip>
              </div>
              <div class="card__item-value numbers">
                <CountUp :endVal="allChainData.reward_amount || 0" :options="options" />
              </div>
            </div>
            <div class="price__card-item">
              <!-- 待回购金额 -->
              <div class="card__item-key break">
                {{ $t("AmountToBeRepurchased") }}
                <el-tooltip effect="dark" :placement="isPC ? 'right-end' : 'bottom'" popper-class="halving" >
                  <div slot="content" v-html="$t('burnTip', {firstNum: _numComma(allChainData.repurch_amount, 2), secondNum: _numComma(allChainData.repurch_balance, 0)})"></div>
                  <img class="tist" :src="tist" alt=""/>
                </el-tooltip>
              </div>
              <div class="card__item-value numbers">
                <CountUp :endVal="repurchasedAmount  || 0" :options="options" />
              </div>
            </div>
            <div class="price__card-item">
              <!-- 总回购销毁数量 -->
              <div class="card__item-key">
                {{ $t("TotalRepurchaseAndDestructionQuantity") }}
                <el-tooltip effect="dark" content="HECO&BSC" :placement="isPC ? 'right-end' : 'bottom'" popper-class="halving" >
                  <img class="tist" :src="tist" alt=""/>
                </el-tooltip>
              </div>
              <div class="card__item-value numbers">
                <CountUp :endVal="allChainData.destroy_mdx + allChainData.lock_mdx || 0" />
              </div>
            </div>
            <div class="price__card-item time">
              <div class="card__item-key">
                {{ $t("Countdown") }}
                <el-tooltip effect="dark" :content="$t('halvingDescription')" :placement="isPC ? 'right-end' : 'bottom'" popper-class="halving" >
                  <img class="tist" :src="tist" alt=""/>
                </el-tooltip>
              </div>
              <div class="card__item-value new-item-value numbers">
                <strong>{{$t('approximately')}}</strong>
                <span>{{ formatCountdownDay.d }}</span>:<span>{{ formatCountdownDay.h }}</span>:<span>{{ formatCountdownDay.m }}</span>:<span>{{ formatCountdownDay.s }}</span>
              </div>
              <!-- <div class="block"><span>{{$t('halvingHeight')}}</span><strong>{{chainId == '128' ? 10517460 : 13130005}}</strong></div> -->
            </div>
          </div>
          <div class="home-input__wrap">
            <!--       boardroom 表格   -->
            <div class="input-wrap text">
              <header class="borad header-img ">
                <div class="name-icom">
                  <img src="@/assets/board-icon.png" class="icon-img" />
                  <span class="text Bold">{{ $t("Boardroom") }}</span>
                </div>
                <router-link to="/boardroom">
                  {{ $t("seeMore") }}
                  <img src="@/assets/more.png" class="more" />
                </router-link>
              </header>
              <table border="0" cellpadding="0" cellspacing="0">
                <thead>
                  <th class="al">{{ $t("Staked") }}</th>
                  <th class="jar">{{ $t("Earned") }}</th>
                  <th class="ar">{{ $t("ApyTopic.apy") }}</th>
                  <th class="operation">{{ $t("operation") }}</th>
                </thead>
                <tbody>
                  <tr v-for="(list, index) in boardRoomData" :key="list.earnedToken + list.pid + index">
                    <td class="al textEn">{{ list.pool_name }}</td>
                    <td class="textEn">{{ list.earnedToken }}</td>
                    <td class="art numbers">
                      <CountUp :endVal="list.pool_apy > 0 ? boardRoomApy(list) : 0" />%
                    </td>
                    <td class="operation-ar">
                      <div class="oper-div">
                        <router-link v-if="chainId != 1"
                          :to="list.pool_type == 3 ? `/pool/lockup/${list.earned_token.toLowerCase()}` : `/pool/boardroom/${list.earned_token.toLowerCase()}/${list.pid}`">{{ $t("Stakeds") }}
                        </router-link>
                        <span v-else>{{ $t("Stakeds") }}</span>
                        <span>|</span>
                        <a @click="() => openLink()">{{ $t("transactions") }}</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <p class="emptyData" v-if="boardRoomData && boardRoomData.length == 0">{{ $t("empptyData") }}</p>
              </table>
            </div>
            <!--      流动性表格    -->
            <div class="input-wrap text">
              <header class="liuq header-img">
                <div class="name-icom">
                  <img src="@/assets/liqui-icon.png" class="icon-img" />
                  <span class="text Bold">{{ $t("Pool") }}</span>
                </div>
                <router-link to="/liquidity">{{ $t("seeMore") }}
                  <img src="@/assets/more.png" class="more" />
                </router-link>
              </header>
              <table border="0" cellpadding="0" cellspacing="0">
                <thead>
                  <th class="al">{{ $t("Staked") }}</th>
                  <th class="jar">{{ $t("Earned") }}</th>
                  <th class="ar">{{ $t("ApyTopic.apr") }}</th>
                  <th class="operation">{{ $t("operation") }}</th>
                </thead>
                <tbody>
                  <tr v-for="list in airdropList" :key="list.pool_name">
                    <td class="al textEn">{{ list.base_name }}</td>
                    <td class="textEn">MDX</td>
                    <td class="art numbers">
                      <CountUp :endVal="list.pool_apy > 0 ? list.pool_apy*365 : 0" />%
                    </td>
                    <td class="operation-ar">
                      <div class="oper-div">
                        <router-link v-if="chainId != 1" :to="'pool/liquidity/mdx/' + list.pid">{{
                        $t("Stakeds")
                      }}</router-link>
                        <span v-else>{{ $t("Stakeds") }}</span>
                        <span>|</span>
                        <a @click="() => openLink(list)">{{ $t("transactions") }}</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <p class="emptyData" v-if="airdropList.length == 0">{{ $t("empptyData") }}</p>
              </table>
            </div>
          </div>
          <div class="home-input__current text">
            <div class="current">
              <p class="desc">{{ $t("CurrentLiquidity") }}<span class="textEn">(HECO&BSC)</span></p>
              <p class="amount numbers">
                <CountUp :endVal="allChainData.mining_supply || 0" />
              </p>
            </div>
            <!-- <div class="current2 current">
              <p class="desc">{{ $t("MarketCap") }}<span class="textEn">(HECO&BSC)</span></p>
              <p class="amount numbers">
                <CountUp :endVal="allChainData.mining_market || 0" />
              </p>
            </div> -->
          </div>
          <div class="home-count__wrap text" v-if="false">
            <!--  pc 布局-->
            <div class="home-count__warp" v-if="onresizeIsPC">
              <div class="count-wrap">
                <!-- 24H交易额 -->
                <div class="top count margin-right">
                  <span class="desc">
                    {{ $t("PlatformTransactionVolume") }} <span class="textEn">(HECO&BSC)</span>
                  </span>
                  <span class="amount numbers">
                    <CountUp :endVal="allChainData.volume_24hr || 0" />
                  </span>
                </div>
                <div class="top count margin-left">
                  <span class="desc">{{ $t("HandlingFee") }}<span class="textEn">(HECO&BSC)</span></span>
                  <span class="amount numbers">
                    <CountUp :endVal="allChainData.fee_24hr || 0" />
                  </span>
                </div>
              </div>
              <div class="count-wrap">
                <!-- 已奖励金额 -->
                <div class="down count margin-right">
                  <span class="desc">
                    {{ $t("TotalAirdropRewards") }}<span class="textEn">(HECO&BSC)</span>
                  </span>
                  <span class="amount numbers">
                    <CountUp :endVal="allChainData.boardroom_rewards || 0" />
                  </span>
                </div>
                <!-- 总回购金额 -->
                <div class="down count margin-left">
                  <span class="desc">{{ $t("RepurchaseAmount") }}<span class="textEn">(HECO&BSC)</span></span>
                  <span class="amount numbers">
                    <CountUp :endVal="allChainData.total_repurch || 0" />
                  </span>
                </div>
              </div>
            </div>
            <!--  h5 布局-->
            <div class="home-count__warp" v-if="isMobile">
              <div class="count">
                <span class="desc">
                    {{ $t("PlatformTransactionVolume") }}<el-tooltip effect="dark" content="HECO&BSC" :placement="isPC ? 'right-end' : 'bottom'" popper-class="halving" >
                  <img class="tist" :src="tist" alt=""/>
                </el-tooltip>
                  </span>
                <span class="amount numbers">
                  <CountUp :endVal="allChainData.volume_24hr || 0" />
                </span>
              </div>
              <div class="count">
                <span class="desc">{{ $t("RepurchaseAmount") }}<el-tooltip effect="dark" content="HECO&BSC" :placement="isPC ? 'right-end' : 'bottom'" popper-class="halving" >
                  <img class="tist" :src="tist" alt=""/>
                </el-tooltip></span>
                <span class="amount numbers">
                  <CountUp :endVal="allChainData.total_repurch || 0" />
                </span>
              </div>
              <div class="count">
                <span class="desc">
                  {{ $t("TotalAirdropRewards") }}<el-tooltip effect="dark" content="HECO&BSC" :placement="isPC ? 'right-end' : 'bottom'" popper-class="halving" >
                  <img class="tist" :src="tist" alt=""/>
                </el-tooltip>
                </span>
                <span class="amount numbers">
                  <!-- rewardeData.totalReward -->
                  <CountUp :endVal="allChainData.boardroom_rewards || 0" />
                </span>
              </div>
              <div class="count">
                <span class="desc">{{ $t("HandlingFee") }}<el-tooltip effect="dark" content="HECO&BSC" :placement="isPC ? 'right-end' : 'bottom'" popper-class="halving" >
                  <img class="tist" :src="tist" alt=""/>
                </el-tooltip></span>
                <span class="amount numbers">
                  <CountUp :endVal="allChainData.fee_24hr || 0" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 使用场景审计机构和合作伙伴 -->
    <sponsor></sponsor>
  

  </div>
</template>

<script>
import { formatSecondsToDate, formatSecondsToDateDay } from "@/utils"
import sponsor from "../components/sponsor/sponsor.vue"
import { _getApy, _numComma } from "@/utils/comMethod"
import Carousel from "@/components/Carousel/Carousel"
import { mdxTradeAdrList } from "@/utils/comStatic"
import { formatFloat } from "@/utils/formatBalance"
import { _toTrade } from "@/utils/urlMethod"
import { fnCheckSymble } from '@/api'
import BigNumber from 'bignumber.js'

let interval = null;
let reqIntrvel = null;

export default {
  name: "Home",
  components: { sponsor, Carousel },
  data() {
    return {
      tist: require('@/assets/tist.png'),
      options: {
        decimalPlaces: 0,
      },
      // 减半倒计时
      // 07 21, 2021 07:42:17 GMT+08:00
      countdown: parseInt(
        (new Date("2022/05/31 20:00:00 GMT+08:00").getTime() -
          new Date().getTime()) /
          1000
      ),
      liquidityApys: {},
      onresizeIsPC: !navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i),
    };
  },
  $computed: {
    bnp: "bnp",
  },
  methods: {
    // 开始减半倒计时定时器
    startCountdown() {
      interval = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    },
    menu() {
      const scroll = this.$refs.scrollSign.scrollTop
      if(this.navStatus != (scroll > 0 ? true : false)) this.$store.commit("setNavStatus", !this.navStatus)
    },
    boardRoomApy(item) {
      if(item.pool_type == 3) {
        const weights = item['weights']
        let size = Object.keys(weights).length
        return _getApy(item.pool_apy, weights[size - 1])
      } else {
        return _getApy(item.pool_apy)
    }
    },
    openLink(list) {
      if (list) {
        fnCheckSymble(this.chainId, list.address).then(res => {
          if (res.data.code == 0) {
            _toTrade(list.address, this.getLanguage, this.isMobile)
          } else {
            window.open(this.globalGetTokenConfig(list), '_self')
          }
        })
      } else {
        if (Object.keys(mdxTradeAdrList).includes(this.chainName)) {
          _toTrade(mdxTradeAdrList[this.chainName], this.getLanguage, this.isMobile)
        }
      }
    },
    _numComma
  },
  destroyed() {
    clearInterval(interval);
    clearInterval(reqIntrvel);
  },
  watch: {
    countdown() {
      clearInterval(interval);
      this.startCountdown();
    },
  },
  mounted() {
    if (this.isMobile) {
      this.menu()
      this.$refs.scrollSign.addEventListener('scroll', this.menu)
    }
    this.startCountdown();
    window.onresize = () => {
      this.onresizeIsPC = !navigator.userAgent.match(
        /(iPhone|iPod|Android|ios)/i
      );
    };
  },
  computed: {
    homeData() {
      return this.$store.state.homeData;
    },
    rewardeData() {
      return this.$store.state.boardRoom.rewardeData;
    },
    allChainData() {
      return this.$store.state.allChain
    },
    currentChainBoardRoomData() {
      return this.$store.getters["boardRoom/currentChainBoardRoomData"];
    },
    // 当前价格
    currentPrice() {
      return formatFloat(this.homeData.mdex_info?.price, 4, "round");
    },
    // 待回购金额
    repurchasedAmount() {
      const mdxAmount = new BigNumber(this.allChainData.repurch_balance).times(this.currentPrice)
      return new BigNumber(this.allChainData.repurch_amount).plus(mdxAmount).toString(10)
    },
    supply() {
      return this.homeData.mdex_info?.supply * 1 || 0;
    },
    market() {
      return this.homeData.mdex_info?.market * 1 || 0;
    },
    balance() {
      let balance = this.$store.state.balance;
      return balance != null ? balance : 0;
    },
    // 董事会数据
    boardRoomData() {
      if(this.currentChainBoardRoomData) {
        return [...this.currentChainBoardRoomData.allData].sort((a, b) => b.pool_apy - a.pool_apy)?.slice(0, 4) ?? [];
      }
    },
    // 格式化减半时间
    formatCountdown() {
      // console.log(formatSecondsToDate(this.countdown));
      return formatSecondsToDate(this.countdown);
    },
    // 格式化减半时间-加上天
    formatCountdownDay() {
      // console.log(formatSecondsToDateDay(this.countdown));
      return formatSecondsToDateDay(this.countdown);
    },
    // 流动性挖矿全部数据
    apylist() {
      return this.$store.state.liquidity.apylist;
    },
    airdropList() {
      const apylist = this.apylist;
      const airdropList = [];
      for (const pid in apylist) {
        airdropList.push(Object.assign({ pid }, apylist[pid]));
      }
      airdropList.sort((a, b) => b.pool_apy - a.pool_apy);
      return airdropList.splice(0, 4);
    },
    // 导航条状态
    navStatus() {
      return this.$store.state.navStatus
    }
  },
  created() {},
  beforeCreate() {
    reqIntrvel = setInterval(() => {
      this.$store.dispatch("getBalance");
    }, 9000);
  },
  destroyed() {
    window.removeEventListener("scroll", this.menu);
  }
};
</script>
<style lang="less" scoped>
@import './homeCommon.less';
// h5
@media screen and (max-width: 450px) {
  @import './h5home.less';
}
// pc
@media screen and (min-width: 450px) {
  // 语言
  .es {
    .input-wrap {
      table {
        .oper-div {
          a {
            font-size: 12px !important;
          }
        }
      }
    }
    .current {
      .desc {
        font-size: 14px !important;
      }
    }
  }
  .ru {
    .count {
      .desc {
        font-size: 12px !important;
      }
    }
    .current {
      .desc {
        font-size: 14px !important;
      }
    }
    .input-wrap {
      table {
        th {
          // font-size: 12px !important;
        }
      }
    }
  }
  .nl {
    .current {
      .desc {
        font-size: 14px !important;
      }
    }
    .new-item-value {
      font-size: 14px !important;
      strong {
        font-size: 12px !important;
      }
    }
    .home__assets-price-card {
      padding: 24px 8px !important;
    }
    .card__item-key {
      font-size: 14px !important;
    }
    .card__item-value {
      font-size: 16px !important;
    }
    .new-item-value {
      margin-bottom: 0;
    }
  }
  .en, .th {
    .card__item-key {
      font-size: 12px !important;
    }
    .new-item-value {
      margin-bottom: 0;
      position: relative;
      top: -3px;
    }
  }

  .ru {
    .card__item-key {
      font-size: 15px !important;
    }
    .card__item-value {
      margin-right: 10px;
      font-size: 18px !important;
    }
  }

  .ru, .vi, .pt, .tl {
    .new-item-value {
      margin-bottom: 0;
    }
  }
  
  .home-info-h5{
    display: none;
  }
  .home-info-pc{
    width: 100%;
    display:flex;
    justify-content: center;
    margin-top:25px;
    .h-info-item{
          margin:0 12px;
          height: 48px;
          background: #FFFDFA;
          border-radius: 24px;
          padding: 0 16px;
          display:flex;
          justify-content: center;
          align-items: center;
          img{
            height:30px;
            width: 30px;
          }
          span{
            margin:0 5px;
          }
          .hi-name{
              font-size: 16px;
              font-weight: 500;
              color: #7D7D7D;
          }
           .hi-num{
            font-size: 18px;
            font-weight: 500;
            color: #282623;
            line-height: 23px;
          }
          
    }
}

  .icon-img {
    width: 36px;
    height: 36px;
  }
  .Bsc {
    .header-img {
      background-image: url("~@/assets/bet-title-pc.png");
      background-size: cover;
    }
  }
  .emptyData {
  margin-top:70px;
  padding: 20px 0;
  left: 50%;
  position: relative;
  transform: translateX(100%);
  }

  .Heco {
    .new-container {
      background: linear-gradient(
        180deg,
        #4e60a7 0%,
        #9baece 14%,
        rgba(226, 242, 252, 0.73) 33%,
        rgba(231, 239, 252, 0.71) 100%
      );
      box-shadow: 1px 1px 1px 0px rgba(255, 255, 255, 0.3);
    }
    .container-color {
      box-shadow: -1px -1px 1px 0 rgba(255, 255, 255, 0.3);
      &:after {
        background: linear-gradient(
          180deg,
          #033fc8 0%,
          #5c76da 50%,
          #e3edfe 100%
        );
      }
    }
    .current {
      background: url("~@/assets/chart_bg.png") 100% 100% no-repeat;
    }
    .current2 {
      background: url("~@/assets/chart_bg2.png");
    }
  }
  .Bsc {
    .home__assets {
      background: linear-gradient(180deg, #f5f5f5 0%, #f1f7ff 100%);
    }
    .new-container {
      background: rgba(142, 142, 142, 0.1);
      border-radius: 20px;
      backdrop-filter: blur(14px);
    }
  }
  .ETH {
  }

  .home__assets {
    height: 840px;
    background: #f6f7fb;
    .new-container {
      box-shadow: 1px 1px 1px 0px rgba(255, 255, 255, 0.3);
      border-radius: 20px;
      padding: 50px;
    }
    .container {
      transform: translateY(-115px);
      border-radius: 20px;
      position: relative;
      overflow: hidden;
      box-shadow: -1px -1px 1px 0 rgba(255, 255, 255, 0.3);
      z-index: 998;
      &:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 246px;
        top: 0;
        left: 0;
        z-index: -1;
      }
    }

    .home__assets-amount {
      color: #fff;
      font-size: 32px;
      text-align: center;

      span {
        vertical-align: middle;
      }
    }

    .amount-unit-h5 {
      display: none;
    }

    .amount-icon {
      display: inline-block;
      width: 55px;
      height: 48px;

      background-size: contain;
    }

    .amount-number {
      height: 48px;
      font-weight: 600;
      display: inline-block;
      line-height: 48px;
    }

    .home__assets-price-card {
      height: 111px;
      padding: 24px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 10px 20px 0 rgba(10, 20, 111, 0.05),
        1px 1px 1px 0 rgba(255, 255, 255, 0.3);
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card__item-key {
      font-size: 16px;
      color: #808eb5;
      .tist {
        height: 12px;
        width: 12px;
      }
    }

    .price__card-item {
      .block {
        margin-top: 5px;
        font-size: 12px;
        color: rgba(16, 24, 56, 0.6);
      }
    }

    .card__item-value {
      color: #48587b;
      font-size: 24px;
      margin-top: 10px;
      font-weight: 500;
    }


    .home-input__wrap {
      display: flex;
      justify-content: space-between;
      margin-top: 27px;
    }

    .home-count__warp-h5 {
      display: none;
    }

    .input-wrap {
      width: 538px;
      background-color: white;
      border-radius: 8px;
      header {
        height: 60px;
        border-radius: 8px 8px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;

        &.liuq {
          color: #48587b;
          font-weight: 500;
        }

        span {
          font-size: 26px;
          color: #ffffff;
          font-weight: bold;
        }

        a {
          font-size: 18px;
          color: #ffffff;
          &:hover {
            cursor: pointer;
          }
        }

        .more {
          width: 8px;
          position: relative;
          top: 2px;
        }
      }

      table {
        width: 100%;
        padding: 0 24px;
        background-color: #fff;
        text-align: center;
        border-radius: 0 0 8px 8px;
        color: #7f8faf;

        .al {
          text-align: left;
          color: #48587b;
          font-weight: 500;
        }
        .art {
          /* text-align: right; */
          color: #03ad90;
          font-weight: 500;
        }
        .ar {
          /* text-align: right; */
          color: #48587b;
          font-weight: 500;
        }

        thead {
          th {
            border-bottom: 1px solid #dee0ed;
            // white-space:nowrap;
          }
        }

        thead th:nth-child(1) {
          width: 23%;
        }

        thead th:nth-child(2) {
          width: 23%;
        }

        thead th:nth-child(3) {
          width: 23%;
        }
        thead th:nth-child(4) {
          width: 31%;
        }
        th,
        td {
          height: 53px;
        }
        .operation-ar {
          display: flex;
          justify-content: space-around;
          align-items: center;
          color: #48587b;
          font-weight: 500;

          .oper-div {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 145px;
            height: 26px;
            border-radius: 4px;
            font-size: 15px;
          }

          a {
            line-height: 26px;
            min-width: 60px;
            text-align: center;
            display: inline-block;
            border-radius: 4px;
            font-size: 15px;
            font-weight: 500;
          }
        }

        tbody {
          tr:last-child {
            td {
              border-bottom: none;
            }
          }

          td {
            border-bottom: 1px dashed #dee0ed;
          }
        }
      }
    }

    .home-input__current {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
    }

    .current {
      width: 538px;
      height: 154px;
      box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.06);
      border-radius: 8px;
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      .desc {
        text-align: left;
        height: 28px;
        font-size: 17px;
        font-weight: 400;
        // color: #b8c9ff;
        line-height: 28px;
        padding-top: 7px;
      }

      .amount {
        text-align: left;
        font-size: 28px;
        font-weight: 600;
        color: #fff;
        line-height: 36px;
        margin-top: 16px;
      }
    }

    .home-count__wrap {
      background: #ffffff;
      /* box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.06); */
      border-radius: 8px;
      padding: 0 30px;
      margin-top: 42px;
      .desc {
        color: #7d7d7d;
      }
    }

    .count-wrap {
      height: 70px;
      display: flex;
      justify-content: space-between;
      line-height: 70px;
      border-bottom: 1px solid #dee0ed;

      &:last-child {
        border-bottom: none;
      }

      .count {
        display: flex;
        justify-content: space-between;
        position: relative;
        width: 538px;

        &.margin-right {
          margin-right: 30px;
        }

        &.margin-left {
          margin-left: 30px;
        }

        .desc { 
          font-weight: 400;
          font-size: 16px;
          //color: #7f8faf;
        }

        .amount {
          font-weight: 500;
          font-size: 20px;
          color: #48587b;
        }
      }
    }
  }

  .new-item-value {
    margin-bottom: 8px;
    span {
      background-color: #000;
      color: white;
      border-radius: 4px;
      /* padding: 0 2px; */
      font-size: 16px;
     
      display: inline-block;
      text-align: center;
      padding-right: 1px;
      width: 25px;
      height: 25px;
      line-height: 25px;
    }
    strong {
      padding-right: 5px;
      font-size: 14px;
      font-weight: 400;
    }
  }
  .home-mechanism__item-logo {
    width: 210px;
    height: 51px;
  }
}



</style>
