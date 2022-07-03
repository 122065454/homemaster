<template>
  <div class="boardroom" :class="[chainName, getLanguage]">
    <title-banner />
    <div class="boardroom__total text">
      <div class="container">
        <!-- tab切换 -->
        <div class="boardroom__tab">
          <div 
            v-for="(arr, i) in getTabList"
            class="boardroom-tab__item text Bold"
            :class="{ 'is-active': boardroomTab === (i+1) }"
            @click="changeBoardroomTab(i+1)"
            :key="`tabListRander${i}`">
            {{ $t(`${arr['name']}`) }}
          </div>
        </div>
        <!-- 奖励 ==》 待奖励金额, 已奖励金额, 当日总奖励, 当日总奖励 -->
        <div class="boardroom__total-warp numbers Medium" v-if="boardroomTab === 1">
          <div class="boardroom-total__item" v-for="(arr, i) in getTabList[0]['paramList']" :key="`tabParam1_${i}`">
            <div class="total__key">
              {{ arr['text'] }} <el-tooltip v-if="i==0" effect="dark" content="(HECO&BSC)" :placement="isPC ? 'right-end' : 'bottom'" popper-class="halving" >
                <img class="tist" :src="tist" alt=""/>
              </el-tooltip>
            </div>
            <div class="total__value ">
              <CountUp :endVal="arr['val']" />
            </div>
          </div>
        </div>
        <!-- 回购销毁 ==》 待回购金额, 回购价格, 总回购销毁数量, 总回购金额, 销毁xMDX数量 -->
        <div class="boardroom__total-warp" v-if="boardroomTab === 2">
          <div class="boardroom-total__item numbers Medium" v-for="(arr, i) in getTabList[1]['paramList']" :key="`tabParam2_${i}`">
            <div class="total__key">
              {{ arr['text'] }} <el-tooltip  effect="dark" :content="arr['custom'] ? '' : arr['tipText']" :placement="isPC ? 'right-end' : 'bottom'" popper-class="halving" >
                  <div slot="content" v-if="arr['custom']" v-html="$t('burnTip', {firstNum: _numComma(allChainData.repurch_amount, 2), secondNum: _numComma(allChainData.repurch_balance, 0)})"></div>
                  <img class="tist" :src="tist" alt=""/>
                </el-tooltip>
              <!-- <span class="total__key-icon" v-if="i === 2" /> -->
            </div>
            <div class="total__value ">
              <!-- <span v-show="i !== 2">$</span> -->
              <CountUp :endVal="arr['val']" v-if="i !== 1"/>
              <span v-else>{{arr['val']}}</span>
              <span v-if="i === 2">MDX</span>
            </div>
          </div>
        </div>
        <!-- 燃烧销毁 ==》 燃烧销毁总数量, 燃烧销毁总金额 -->
        <div class="boardroom__total-warp combustion-param" v-if="boardroomTab === 3">
          <div class="combustion-list numbers Medium">
            <div class="boardroom-total__item combustion-item" v-for="(arr, i) in getTabList[2]['paramList']" :key="`tabParam1_${i}`">
              <div class="total__key">
                {{ arr['text'] }} <el-tooltip v-if="i==0" effect="dark" content="(HECO&BSC)" :placement="isPC ? 'right-end' : 'bottom'" popper-class="halving" >
                <img class="tist" :src="tist" alt=""/>
              </el-tooltip>
              </div>
              <div class="total__value ">
                <!-- <span v-if="i === 1" >$</span> -->
                <CountUp :endVal="arr['val']" />
                <span v-if="i === 0"> MDX</span>
              </div>
            </div>
          </div>
          <!-- 跳转燃烧销毁按钮[3] -->
          <div class="combustion-btn text Bold" v-show="boardroomTab === 3" @click="()=>$router.push('/buyback')">
            {{ $t("GoCombustion") }}
            <img :src="chainName === 'Heco' ? hecoJump : bscJump" alt="" />
          </div>
        </div>
        <!-- 查看规则按钮[1,2] -->
        <div class="boardroom-total__rule-button" @click="showRule" v-show="[1,2].includes(boardroomTab)">
          {{ $t("seeRule") }}
          <span class="rule__button-icon"></span>
        </div>
      </div>
    </div>
    <!-- 空投奖励 -->
    <Reward v-if="boardroomTab === 1" />
    <!-- 回购销毁 -->
    <Repurchase v-if="boardroomTab === 2" />
    <!-- 燃烧销毁 -->
    <Combustion v-if="boardroomTab === 3" />
    <!-- 查看规则 -->
    <Rule ref="rule" />
  </div>
</template>

<script>
import TitleBanner from "@/components/TitleBanner/TitleBanner";
import Combustion from "./Combustion/Combustion";
import Repurchase from "./Repurchase/Repurchase";
import { _numComma } from "@/utils/comMethod";
import Rule from "@/components/modals/rule";
import Reward from "./Reward/Reward";
import BigNumber from 'bignumber.js'
export default {
  name: "Boardroom",
  components: {
    Rule,
    Reward,
    Repurchase,
    Combustion,
    TitleBanner
  },
  data() {
    return {
      // 当前页面的内容值  1: 空投奖励,2: 回购销毁, 3:燃烧销毁
      boardroomTab: 1,
      tist: require('@/assets/tist.png'),
      stakedOptions: { decimalPlaces: 4 },
      hecoJump: require('@/assets/heco_jump.png'),
      bscJump: require('@/assets/bsc_jump.png')
    };
  },
  computed: {
    // tab列表
    getTabList() {
      return [
        {
          name: 'airdropRewards', 
          paramList: [
            { text: `${this.$i18n.t("PendingAirdropRewards")}`, val: this.allChainData.reward_amount || 0 },
            // { text: `${this.$i18n.t("TotalAirdropRewards")}(HECO&BSC)`, val: this.allChainData.boardroom_rewards || 0 },
            { text: this.$i18n.t("TotalRewardAmountOfTheDay"), val: this.todayReward},
            // { text: this.$i18n.t("EstimatedTotalRewardAmountOfTheMonth"), val: this.todayReward * 30 }
          ]
        },
        {
          name: 'Repurchase',
          paramList: [
            { text: `${this.$i18n.t("AmountToBeRepurchased")}`, val: this.repurchasedAmount || 0, custom: true},
            { text: this.$i18n.t("RepurchasePrice"), val: Math.round(this.rewardeData.destoryPrice * 10000) / 10000, tipText: `${this.$i18n.t("AveragePrice")}` },
            { text: `${this.$i18n.t("TotalRepurchaseAndDestructionQuantity")}`, val: this.destroyTotal || 0, tipText: `(HECO&BSC)` },
            { text: `${this.$i18n.t("DestructionXMDXQuantity")}`, val: this.allChainData.destroy_xmdx || 0 , tipText: `${this.$i18n.t("ConvertInto")} ${_numComma(this.allChainData.lock_mdx || 0, 2)}`},
            // { text: `${this.$i18n.t("TotalRepurchaseAmount")}(HECO&BSC)`, val: this.allChainData.total_repurch  || 0 }
          ]
        },
        {
          name: 'Combustion',
          paramList: [
            { text: `${this.$i18n.t("CombustionNum")}`, val: +this.combustionData['total_destroy_mdx'] },
            // { text: `${this.$i18n.t("CombustionAmount")}(HECO&BSC)`, val: +this.combustionData['total_destroy_usdt']}
          ]
        },
      ]
    },
    allChainData() {
      return this.$store.state.allChain
    },
    rewardeData() {
      return this.$store.state.boardRoom.rewardeData;
    },
    combustionData() {
      return this.$store.state.buyBack.combustionData;
    },
    todayReward() {
      let todayReward = 0
      if(this.$store.getters["boardRoom/currentChainBoardRoomData"]) {
        let targetData = this.$store.getters["boardRoom/currentChainBoardRoomData"]["allData"]
        todayReward = targetData.reduce((accumulator, currentValue) => {
          return accumulator + Number(currentValue.amount)
        },0)
      }
      return todayReward
    },
    // mdx当前价格
    currentPrice() {
      return this.$store.state.homeData.mdex_info?.price
    },
    // 总回购销毁数量
    destroyTotal() {
      return new BigNumber(this.allChainData.destroy_mdx).plus(this.allChainData.lock_mdx).toString(10);
    },
    // 待回购金额
    repurchasedAmount() {
      const mdxAmount = new BigNumber(this.allChainData.repurch_balance).times(this.currentPrice)
      return new BigNumber(this.allChainData.repurch_amount).plus(mdxAmount).toString(10)
    }
  },
  methods: {
    // 切换tab
    changeBoardroomTab(tab) {
      this.boardroomTab = tab
    },
    // 查看规则切换展示
    showRule() {
      if (this.boardroomTab === 1) this.$refs.rule.showModel(true, false)
      if (this.boardroomTab === 2) this.$refs.rule.showModel(false, true)
    },
    _numComma
  },
};
</script>
<style lang="less" scoped>
@import "./Boardroom.less";
</style>
