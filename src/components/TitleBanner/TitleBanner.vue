<template>
  <div class="title-banner" :class="[getLanguage, chainName]" >
    <!-- 回购销毁banner -->
    <div class="banner-con" :style="{backgroundImage: `url(${getImg('buyback')})`}" v-if="['/buyback', '/pastrecord'].includes(routerPath)"></div>
    <!-- 流动性的banner -->
    <div class="banner-bar text" v-show="routerPath == '/liquidity'">
      <div class="pc">
        <h1 class="home__banner-title">
          {{ $t("CurrentTransacObtainCurrencytionVolume") }}
        </h1>
        <div class="ban-center">
          <p class="liquidity-mdx ban-center">
            {{ $t("MDXtotal") }}
            <CountUp :endVal="liquidity_mdex || 0" />
            USDT
          </p>
          <p class="liquidity-mdx dig" @click="jumpHandle">
            <span>{{ $t("VoteDig") }}</span>
            <img :src="chainName=='Heco' ? hecoArrow : bscArrow" alt="" />
          </p>
        </div>
      </div>
      <!-- -->
      <div class="h5 li-h5title ban-start text Heavy">
        <div class="act-title">
          <p>{{ $t("LiquidityMining") }}</p>
          <p></p>
        </div>
        <router-link class="li-title" to="/trading" tag="div" exact>
          <span class="text Heavy">
            {{ $t("TradePool") }}
          </span>
        </router-link>
      </div>
      <div class="h5 li-banner-total">
        <div class="banner-tit">{{ $t("TotalLockIn") }} <span class="numbers" v-if="false">(USDT)</span> </div>
        <div class="banner-sum numbers">
          <CountUp :endVal="liquidity_mdex || 0" />
        </div>
      </div>
    </div>
    <!-- 交易挖矿banner -->
    <div class="banner-bar text" v-show="routerPath == '/trading'">
      <div class="pc">
        <h1 class="home__banner-title">
          {{ $t("tradeTitle") }}
        </h1>
        <div class="new-banner-totals">
          <div class="new-banner-total-white">
            <!-- 当前池子总奖励 -->
            <div class="list-white">
              <span class="list-white-one">
                {{ $t("TotalRewardOfCurrentPool") }}
              </span>
              <span class="list-white-own numbers">
                <CountUp :endVal="trading_totalReward" />
              </span>
              <span class="list-white-one">MDX</span>
            </div>
            <!-- 当前个人可提现奖金 -->
            <div class="list-white">
              <span class="list-white-one">
                {{ $t("CurrentIndividualWithdrawableBonus") }}
              </span>
              <span class="list-white-own numbers">
                <CountUp
                  :endVal="trading_userReward"
                  :options="trading_options"
                />
              </span>
              <span class="list-white-one">MDX</span>
            </div>
          </div>
          <button
            class="new-list-white-banner"
            :disabled="!trading_userReward"
            @click="onWithdrawal"
          >
            {{ $t("CashWithdrawalReward") }}
          </button>
        </div>
      </div>
      <!-- -->
      <div class="h5 li-h5title ban-start">
        <router-link class="li-title" to="/liquidity" tag="div" exact>
          <span>
            {{ $t("LiquidityMining") }}
          </span>
        </router-link>
        <div class="act-title act-mining text Heavy">
          <p>{{ $t("TradePool") }}</p>
          <p></p>
        </div>
      </div>
      <div class="h5 trading-banner">
        <div class="ban-start trading-ban-list">
          <div>
            <p>{{ $t("TotalRewardOfCurrentPool") }}</p>
            <p class="numbers">
              <CountUp :endVal="trading_totalReward" /><span class="h5-sum"
                >MDX</span
              >
            </p>
          </div>
          <div>
            <p>{{ $t("CurrentIndividualWithdrawableBonus") }}</p>
            <p class="numbers">
              <CountUp
                :endVal="trading_userReward"
                :options="trading_options"
              /><span class="h5-sum">MDX</span>
            </p>
          </div>
        </div>
        <div class="ban-center">
          <button
            class="new-banner-btn-dra text Bold"
            :disabled="!trading_userReward"
            @click="onWithdrawal"
          >
            {{ $t("CashWithdrawalReward") }}
          </button>
        </div>
      </div>
    </div>
    <!-- 董事会 boardroom -->
    <div class="banner-bar text" v-show="routerPath == '/boardroom'">
      <div class="pc">
        <h1 class="home__banner-title">
          {{ $t("text9") }}
        </h1>
        <h2 class="home__banner-describe">
          {{ $t("text8") }}
        </h2>
      </div>
      <div class="h5 boardroom-banner__title">
        {{ $t("Directors") }}
      </div>
    </div>
    <!-- 跨链的banner -->
    <div class="banner-bar text" v-show="routerPath == '/bridge'">
      <div class="pc">
        <h1 class="home__banner-title">
          {{
            chainId == 128
              ? $t("MDEForEcoEurrencyTrading1")
              : chainId == 56
              ? $t("MDEForEcoEurrencyTrading2")
              : $t("MDEForEcoEurrencyTrading3")
          }}
        </h1>
        <h2 class="home__banner-describe">
          {{ $t("lightText") }}
        </h2>
      </div>
      <div class="h5 boardroom-banner__title">
        {{ $t("crossChainBridge") }}
      </div>
    </div>
    <!-- 挖矿 -->
    <div class="banner-bar text" v-show="['BoardroomPool', 'Lockup'].includes($route.name)">
      <div class="pc">
        <h1 class="home__banner-title">
          {{ $t("poolTitle") }}
        </h1>
        <h2 class="home__banner-describe">
          {{
            chainId == 128
              ? $t("poolDescribe1")
              : chainId == 56
              ? $t("poolDescribe2")
              : $t("poolDescribe3")
          }}
        </h2>
      </div>
      <div class="h5 boardroom-banner__title">
        {{ $t("transaction") }}
      </div>
    </div>
    <!--介绍页面的banner -->
    <div class="banner-bar text" v-show="routerPath === '/introduce'">
      <div class="pc">
        <h1 class="home__banner-title">
          {{ $t("introduce") }}
        </h1>
        <h2 class="introduceDsc">
          {{ $t("introduceDsc") }}
        </h2>
      </div>
      <div v-if="!isPC && $store.state.language !== 'en'">
        <h1 class="introduce_banner">
          {{ $t("introduce") }}
        </h1>
        <h2 class="introduceDsc">
          {{ $t("introduceDsc") }}
        </h2>
      </div>
      <!-- 英文 -->
      <div v-if="!isPC && $store.state.language === 'en'">
        <p class="text-info">{{ $t("introduceComplete") }}</p>
      </div>
    </div>
    <!-- 奖金计划banner -->
    <div class="banner-bar text" v-show="routerPath === '/priceplan'">
        <h1 class="home__banner-title">
         MDEX {{ $t("sjrd") }}
        </h1>
         <h2 class="introduceDsc">
          {{ $t("sjplantitle") }}
        </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeBanner",
  data() {
    return {
      hecoArrow: require('@/assets/heco_right-arrow.svg'),
      bscArrow: require('@/assets/bsc_right-arrow.svg'),
    }
  },
  props: {
    liquidity_mdex: {
      type: String | Number,
      default: 0,
    },
    trading_userReward: {
      type: String | Number | Boolean,
      default: 0,
    },
    trading_options: {
      type: Object | Array,
      default: () => {},
    },
    trading_totalReward: {
      type: String | Number | Boolean,
      default: 0,
    },
  },
  computed: {
    routerPath(){
      return this.$route.path
    }
  },
  mounted() {},
  $computed: {
    bnp: "bnp",
  },
  methods: {
    // 拼接图片key
    stitchingPic () {
      let con = ''
      if (this.isPC){con += 'pc_'} else {con += 'h5_'}
      if (this.getLanguage === 'zh-CN'){con += 'zh-CN_'} else {con += 'en_'}
      con += this.chainName 
      return con
    },
    // 获取图片
    getImg(name) {
      const imgList = {
        'buyback': {
          'pc_zh-CN_Heco': 'buyback_pc_zh-CN_Heco' ,
          'pc_zh-CN_Bsc': 'buyback_pc_zh-CN_Bsc' ,
          'pc_en_Heco': 'buyback_pc_en_Heco' ,
          'pc_en_Bsc': 'buyback_pc_en_Bsc' ,
          'h5_zh-CN_Heco': 'buyback_h5_zh-CN_Heco' ,
          'h5_zh-CN_Bsc': 'buyback_h5_zh-CN_Bsc' ,
          'h5_en_Heco': 'buyback_h5_en_Heco' ,
          'h5_en_Bsc': 'buyback_h5_en_Bsc' ,
        }
      }
      return require(`@/assets/banner/${name}/${imgList[name][this.stitchingPic()]}.png`)
    },
    onWithdrawal() {
      this.$emit("on-withdrawal");
    },
    jumpHandle() {
      window.open(this.getUrlList['VoteDig'])
    }
  },
}
</script>
<style lang="less" scoped>
@import "./TitleBanner.less";
</style>
