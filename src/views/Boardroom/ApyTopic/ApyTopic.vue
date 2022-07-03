<template>
  <div class="topic_bar text">
    <template v-if="kind=='lockup'">
       <!-- 董事会列表锁仓APR -->
      <div v-if="type === '3'">
        <div v-for="(item, i) in rateList" :key="`rateList_${i}`">
          <div class="title" ><span>{{ i }}</span></div>
          <div class="explain" :class="y==0 ? 'explain_h' : 'explain_m'" v-for="(childItem, y) in item" :key="`${i}${y}`">
            <div><i></i><span>{{ childItem['text'] }}</span></div>
            <strong class="numbers">{{ childItem['val'] }}%</strong>
          </div>
        </div>
        <p>{{ $t("LockApyRemark") }}</p>
      </div>
      <!-- 董事会列表TVL-->
      <div v-if="type === '4'">
        <div class="title" v-for="(item, i) in tvlList" :key="`tvlList_${i}`"><span>{{ item.text }}:</span><strong class="numbers">${{item.val}}</strong></div>
      </div>
    </template>
    <!-- 流动性挖矿APR -->
    <template v-else-if="kind=='liquidity'">
      <div class="title"><span>{{ $t("LiquidityAPR") }}:</span><strong class="numbers">{{ getLiqApr() }}%</strong></div>
      <div>
        <div class="explain explain_h"><div><i></i><span>{{ $t("LpDig") }}</span></div><strong class="numbers">{{ (Number(item.pool_apy)*365).toFixed(2) }}%</strong></div>
        <div class="explain explain_m"><div><i></i><span>{{ $t("LpFee") }}</span></div><strong class="numbers">{{ (Number(item.swap_apy)*365).toFixed(2) }}%</strong></div>
      </div>
      <div class="title"><span>{{ $t("LiquidityAPY") }}:</span><strong class="numbers">{{ getApy(getLiqApr()) }}%</strong></div>
      <p>{{ $t("LpFeaDes") }}</p>
    </template> 
    <!-- 董事会列表单/双挖APR -->
    <template v-else>
      <div class="title"><span>{{ $t("ApyTopic.apr") }}:</span><strong class="numbers">{{ Number(this.apy).toFixed(2) }}%</strong></div>
      <div v-if="isDoubleBenefit">
        <div class="explain explain_h"><div><i></i><span>{{ getplatformName(0) }}</span></div><strong class="numbers">{{ getApr('earn') }}%</strong></div>
        <div class="explain explain_m"><div><i></i><span>{{ getplatformName(1) }}</span></div><strong class="numbers">{{ getApr('mdx') }}%</strong></div>
      </div>
      <div class="title"><span>{{ $t("ApyTopic.apy") }}:</span><strong>{{ getApy(apy) }}%</strong></div>
      <p v-if='isDoubleBenefit'>{{ $t("ApyTopic.IsDoubleReinvest") }}</p>
      <div v-else> 
        <p>{{ $t("ApyTopic.reinvest") }}</p>
        <p>{{ $t("ApyTopic.interest") }}</p>
      </div>
    </template>
  </div>
</template>

<script>
import { platformList, weightList } from '@/utils/comStatic'
import { _numComma } from '@/utils/comMethod'
import BigNumber from 'bignumber.js'
export default {
  name: "ApyTopic",
  props: {
    // 年利率
    apy: {
      type: [String, Number],
      require: true,
      default: 0,
    },
    // 数据对象
    item: {
      type: Object,
      default: () => {},
    },
    // 判断是否为董事会（只有董事会有双挖）
    kind: {
      type: String,
      default: 'none',
    },
    // 董事会列表3:APR, 4:TVL 
    type: {
      type: String,
      default: '3',
    }
  },
  data() {
    return {
      test: 0
    }
  },
  mounted() {},
  computed: {
    // 获取双挖币种集合
    getNameArr() {
      return this.item.earnedToken.split('&')
    },
    // 判断是否为双挖
    isDoubleBenefit() {
      return this.kind === 'Reward' && this.item.earnedToken.includes('&')
    },
    // 年利率列表（锁仓）
    rateList() {
      const weights = this.item['weights']
      let textList = []
      for(let i of Object.keys(weights)) {
        if(i == 0) {
          textList.push(`${this.$t('Current')}`)
        } else {
          textList.push(`${this.$t('XDayLockup', {day: weightList[i]['time']})}`)
        }
      }
      // let aprList = []
      let apyList = []
      for(let i of Object.keys(weights)) {
        // aprList.push({text: `${textList[i]}APR`, val: this.getLockApr(weights[i])})
        apyList.push({text: `${textList[i]}`, val: this.getLockApy(weights[i])})
      }
      // return { APR: aprList, APY: apyList }
      return { APY: apyList }
    },
    // tvl列表(锁仓)
    tvlList() {
      let arr = []
      for(let i of Object.keys(this.item.weights)) {
        if(i == 0) {
          arr.push({text: `${this.$t('Current')}`, val:_numComma(this.item.lock_tvl[i], 2)})
        } else {
          arr.push({text: `${this.$t('XDayLockup', {day: weightList[i]['time']})}`, val: _numComma(this.item.lock_tvl[i], 2)})
        }
      }
      return arr
    }
  },
  methods: {
    // 董事会(单利)-双挖
    getApr(val) {
      return Number(this.item[`pool_${this.getNameArr[val === 'earn' ? 0 : 1]}_apy`]).toFixed(2)
    },
    // 董事会(复利)-单双挖  /  流动性挖矿(复利)
    getApy(val) {
      return Number(Math.pow(1 + val/365/100, 365)*100 - 100).toFixed(2)
    },
    // 董事会(单利)-锁仓
    getLockApr(multiple) {
      let ml = multiple ? +multiple : 1
      return (Number(this.item['pool_apy'])*ml).toFixed(2)
    },
    // 董事会(复利)-锁仓
    getLockApy(multiple) {
      let ml = multiple ? +multiple : 1
      return Number(Math.pow(1 + this.item['pool_apy']*ml/365/100, 365)*100 - 100).toFixed(2)
    },
    // 流动性挖矿(单利)
    getLiqApr() {
      return new BigNumber((this.item.pool_apy*365).toFixed(2)).plus((this.item.swap_apy*365).toFixed(2))
    },
    // 获取平台名称
    getplatformName(val) {
      const name = platformList[this.getNameArr[val]]
      return name ? name : 'MDEX(F)'
    }
  },
}
</script>

<style lang="less" scoped>
@import "./ApyTopic.less";
</style>