<template>
  <!--  空投 -->
  <div class="boardroom__container">
    <div class="container" v-if="isPC">
      <!-- PC列表-分类及查询 -->
      <selete-table ref="operation" :autoTap="true" @change-list="onList" @change-list-item="onListItem" @change-input="searchValue = $event" @switch-change-list="switchStatus = $event"
        :list="chainName=='Heco' ? listNameHeco : listNameBsc" @onchenck="onActionChenck" :inputText="isPC?$t('search') : $t('searchText')" kind="Reward">
      </selete-table>
      <!-- PC列表-内容 -->
      <div class="boardroom__content text">
        <template v-for="(item, index) in currentBoardroomData">
          <div class="boardroom__content-item" :key="index+'i'"
            v-show="listShowStatus(item)">
            <!-- 列表-头部-右侧 -->
            <div class="airdrop">
              <!-- 列表-头部-左侧 -->
              <img :src="getDigPic(item.pool_type)" alt="" />
              <!-- 已奖励金额/当日奖励金额/当月预计奖励金额 -->
              <div class="wait-airdrop" v-for="(obj, key) in getListHeaderInfo(item)" :key="`getListHeaderInfo${key}`">
                <div class="wait-title">{{ $t(obj.text) }}{{obj.text !== 'EndBlock' ? ($) : ''}}</div>
                <div class="wait-info numbers">
                  <span v-show="key !== 0 && obj.text != 'EndBlock'">≈</span>
                  <CountUp :endVal="obj.num" v-if="obj.text !== 'EndBlock'"/>
                  <span class="cp" v-else @click="_toBlock(obj.num, chainName)">{{obj.num}}</span>
                </div>
              </div>
            </div>
            <div class="icon-container">
              <div class="icon-wrap">
                <div class="img-wrap"><img :src="getLpImgUrl(item)" alt="" /></div>
                <div class="info"><p class="ht-price textEn">{{ item.name }}</p></div>
              </div>
              <div class="icon-wrap w200">
                <div v-if="isDoubleBenefit(item.earnedToken)" class="icon-wrap">
                  <div class="centered-bar">
                    <div class="centered"><img :src="getImgUrl(item.earned_token)" alt="" />{{ item.earned_token }}</div>
                    <div class="centered"><img :src="getImgUrl(item.pool_name)" alt="" />{{ item.pool_name }}</div>
                  </div>
                  <div class="info">
                    <p class="ht-price textEn"><span>Earned</span></p>
                  </div>
                </div>
                <div v-else class="icon-wrap">
                  <div class="img-wrap">
                    <img :src="getImgUrl(item.earnedToken)" alt="" />
                  </div>
                  <div class="info">
                    <p class="ht-price textEn">
                      {{ item.earnedToken }} <span>Earned</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="value-warp">
                <div class="key">APY</div>
                <div class="value numbers">
                  <CountUp :endVal="Number(item.pool_apy > 0? getApy(item) : 0)" />%
                  <div class="topic_content" v-if="hoverIndex==index"><ApyTopic :apy="Number(item.pool_apy || 0)" :item="item" :kind="item.pool_type == 3 ? 'lockup' : 'Reward'"/></div>
                  <div class="topic" v-if="item.pool_apy > 0"><img @mouseover="hoverIndex=index" @mouseleave="hoverIndex=-1" :src="chainName=='Heco' ? hecoTopic : bscTopic" alt=""/></div>
                </div>
              </div>
              <div class="value-warp w250">
                <div class="key">TVL</div>
                <div class="value value2 numbers">
                  <CountUp :endVal="Number(item.pool_tvl || 0)" /><span class="pr5"></span>
                  <template v-if="item.pool_type == 3">
                    <div class="topic_content" v-if="hoverIndex==index+999"><ApyTopic :apy="Number(item.pool_apy || 0)" :item="item" kind="lockup" type="4"/></div>
                    <div class="topic" v-if="item.pool_apy > 0"><img @mouseover="hoverIndex=index+999" @mouseleave="hoverIndex=-1" :src="chainName=='Heco' ? hecoTopic : bscTopic" alt=""/></div>
                  </template>
                </div>
              </div>
              <div class="value-warp w250">
                <div class="key">{{ switchStatus ? $t("Reward") : $t("PersonalPledge") }}</div>
                <div class="value" v-if="switchStatus"> 
                  <div v-if="isDoubleBenefit(item.earnedToken)">
                    <div class="numbers">
                      <div>
                        <span class="numbers" v-if="item.__reward['earn']"><CountUp :options="options" :endVal="item.__reward['earn']" /></span>
                        <span class="numbers" v-else>0.0000</span>
                        {{ item.earned_token }}
                      </div>
                      <div>
                        <span class="numbers" v-if="item.__reward['mdx']"><CountUp :options="options" :endVal="item.__reward['mdx']" /></span>
                        <span class="numbers" v-else>0.0000</span>
                        {{ item.pool_name }}
                      </div>
                    </div>
                  </div>
                  <div v-else><span class="numbers"><CountUp :options="options" :endVal="Number(item.__reward)" /></span><span class="textEn">{{ item.earnedToken }}</span></div>
                </div>
                <div class="value" v-else><span class="numbers"><CountUp :options="options" :endVal="Number(item.__pledge)" /></span><span class="textEn">{{ item.earnedToken }}</span></div>
              </div>
              <div class="boardroom__content-button-warp">
                <div class="boardroom__content-button">
                  <span @click="toPool(item)" class="span">{{ $t("Stakeds") }}</span>
                  <span>|</span>
                  <span class="span" @click="openLink">{{ $t("transactions") }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="empty" v-if="!currentBoardroomData.length">
          <img src="@/assets/empty.png" />
          <p>{{ $t("empptyData") }}</p>
        </div>
      </div>
    </div>
    <div class="container" v-if="isMobile">
      <!-- H5列表-分类及查询 -->
      <selete-table ref="operation" @change-list="onList" @change-list-item="onListItem" @change-input="searchValue = $event" @switch-change-list="switchStatus = $event"
        :list="chainName=='Heco' ? listNameHeco : listNameBsc" @onchenck="onh5Chenck" :inputText="isPC?$t('search') : $t('searchText')" kind="Reward">
      </selete-table>
      <!-- H5列表-表头 -->
      <h5-table-title @sort="onh5Sort" :name="tabValue == 2 ? $t('TradesLP') : $t('Trades')" transaction="TVL" kind="Reward"
        :PersonalIncome="$t('Reward')" :reward="$t('DailyReward')" APY="APY" :sortType="sortType" :sortSide="sortSide">
      </h5-table-title>
      <!-- H5列表-表内容-日奖励 -->
      <h5-table v-for="(da, i) in currentBoardroomData" :name="da.name" :transaction="da.pool_tvl" :reward="da.amount"
        :APY="da.pool_apy" :key="i+'t'" :PersonalIncome="da.__reward" @ontable="toPool(da)" :show="boolChenck" :index="i"
        :item="da" :needApy="true" kind='Reward'>
      </h5-table>
      <p v-if="currentBoardroomData.length == 0" class="emptyData">{{ $t("empptyData") }}</p>
    </div>
  </div>
</template>

<script>
import LockupTopic from "../Lockup/LockupTopic/LockupTopic"
import ApyTopic from "@/views/Boardroom/ApyTopic/ApyTopic"
import h5TableTitle from "@/components/h5TableTitle.vue"
import SeleteTable from "@/components/SeleteTable.vue"
import { _toTrade, _toBlock } from "@/utils/urlMethod"
import { mdxTradeAdrList } from "@/utils/comStatic"
import coinConfig from "@/utils/address.config.js"
import h5Table from "@/components/h5Table.vue"
import { divide, splitFormat } from "@/utils"

export default {
  name: "Boardroom",
  data() {
    return {
      hoverIndex: -1, // 鼠标悬停
      bscTopic: require('@/assets/bsc_topic.png'),
      hecoTopic: require('@/assets/heco_topic.png'),
      PersonalIncome: 0, // 暂时用这个代替个人抵押
      // 我参与的：true  非我参与的: false
      actionChenck: false,
      boolChenck: false,
      sortType: "3", // 1每日产量 2每月产量 3apy 4质押资产
      sortSide: "1", // 1正序 0倒叙
      // 分类信息  1: LP  2:单币种
      tabValue: 1,  
      options: {
        decimalPlaces: 4,
      },
      // 币种分类值
      currencyTabValue: "all",
      // 搜索
      searchValue: "",
      // 排序 0: 未排序 2:升序 1:降序
      tableSortType: 1,
      // 排序字段
      tableSortKey: "apy",
      // 进行中:true  已结束:false
      switchStatus: true
    };
  },
  components: {
    SeleteTable,
    "h5-table-title": h5TableTitle,
    "h5-table": h5Table,
    ApyTopic,
    LockupTopic
    // FlipCountdown
  },
  computed: {
    listNameHeco(){
       return [
        {
          name: this.$t("all"),
          show: true,
          child: [
            { name: this.$t("all"), show: true },
            { name: "WHT", show: false },
            { name: "MDX", show: false },
          ],
        },
      ]
    },
    listNameBsc(){
       return   [
         {
          name: this.$t("all"),
          show: true,
          child: [
            { name: this.$t("all"), show: true },
            { name: "HMDX", show: false },
            { name: "MDX", show: false },
          ],
        },
      ]
    },
    mobileCountUpOptions() {
      return {
        formattingFn: (number) => {
          return splitFormat(divide(number, 10000), 1) + this.$t("unit");
        },
      };
    },
    coinConfig() {
      return coinConfig[this.chainId];
    },
    currentAddress() {
      return this.$store.getters.currentAddress;
    },
    earn() {
      return this.$store.state.boardRoom.earn;
    },
    // 分类数据
    boardroomData() {
      if (this.tabValue === 1) return this.boardRoomDataAll
      if (this.tabValue === 2) return this.boardRoomDataLP
      if (this.tabValue === 3) return this.boardRoomDataSingle
    },
    // 获取用户池子收益数量
    poolReward() {
      return this.$store.state.boardRoom.poolReward;
    },
    // 获取用户池子质押数量
    poolPledge() {
      return this.$store.state.boardRoom.poolPledge;
    },
    // 币种分类,筛选,排序数据
    currentBoardroomData() {
      let data = []
      const getReward = (item) => {
        const val = this.poolReward[item.pool_type == 3 ? 'lock' : item.earned_token.toLocaleLowerCase()]
        return val ? val[item.pid] : 0
      }
      
      const getPledge = (item) => {
        const val = this.poolPledge[item.pool_type == 3 ? 'lock' : item.earned_token.toLocaleLowerCase()]
        return val ? val[item.pid] : 0
      }
      this.boardroomData.forEach((item) => {
        let eObj = {
          ...item,
          __reward: getReward(item),
          __pledge: getPledge(item)
        };
        data.push(eObj)
      });


      // 币种分类
      if (this.currencyTabValue !== "all") {
        data = data.filter(
          (item) => item.earnedToken.toUpperCase() === this.currencyTabValue.toUpperCase()
        );
      }
      // 搜索
      if (this.searchValue) {
        let reg = new RegExp(this.searchValue, "gi");
        data = data.filter((item) => {
          return reg.test(item.earnedToken) || reg.test(item.name);
        });
      }
      
      // 排序
      if (this.tableSortType && this.tableSortKey) {
        // 降序
        if (this.tableSortType === 1) {
          data.sort((a, b) => {
            return b[this.tableSortKey] - a[this.tableSortKey];
          });
        }
        // 升序
        if (this.tableSortType === 2) {
          data.sort((a, b) => {
            return a[this.tableSortKey] - b[this.tableSortKey];
          });
        }
      }
      
      // switch切换(非参与)
      // if (!this.actionChenck && !this.boolChenck) {
        // 进行中
        if (this.switchStatus) {
          data = data.filter((item) => {
            return Number(item.amount || 0) > 0
          })
        } 
        // 已结束
        else {
          data = data.filter((item) => {
            return Number(item.amount || 0) == 0
          })
        }
      // }
      return data
    },
    // lp 分类
    boardRoomDataLP() {
      return this.$store.getters["boardRoom/currentChainBoardRoomDataLP"];
    },
    // 单币种
    boardRoomDataSingle() {
      return this.$store.getters["boardRoom/currentChainBoardRoomDataSingle"];
    },
    // 
    boardRoomDataAll() {
      return this.$store.getters["boardRoom/currentChainBoardRoomDataAll"];
    }
  },
  methods: {
    // 列表展示状态
    listShowStatus(item) {
      if (item.pool_type == 2 ) {
        return this.actionChenck ? (item.__reward['earn'] == 0 || item.__reward['mdx'] == 0) && item.__pledge == 0 ? false : true : true
      } else {
        return this.actionChenck ? item.__reward == 0 && item.__pledge == 0 ? false : true : true
      }
    },
    // 计算apy
    getApy(item) {
      if(item.pool_type == 3) {
        const weights = item['weights']
        let size = Object.keys(weights).length
        return Math.pow(1 + item.pool_apy * weights[size - 1]/365/100, 365)*100 - 100
      } else {
        return Math.pow(1 + item.pool_apy/365/100, 365)*100 - 100
      }
    },
    // 挖矿类型
    getDigPic(type) {
      const list = { 
        1: require('@/assets/boardRoom/pc_single_dig.png'), 
        2: require('@/assets/boardRoom/pc_double_dig.png'), 
        3: require('@/assets/boardRoom/pc_lock.png') 
      }
      return list[type]
    },
    // 获取列表头部信息（PC）
    getListHeaderInfo(item) {
      const list = [
        {text: 'TotalAirdropRewards', num: Number(item.total_amount || 0)},
        {text: 'CurrentAirdropRewards', num: Number(item.amount || 0)},
        {text: 'MounthAirdropRewards', num: Number(item.amount * 30 || 0)}
      ]
      if(item.end_block && item.end_block > 0) list.push({text: 'EndBlock', num: item.end_block})
      return list
    },
    // 重构 重构 重构
    // 流动性和董事会的接受参数和处理的排序区别过大-需要特别处理
    onh5Sort(v, i, tableSortType) {
      if (!v) return;
      this.sortType = v;
      // 排序 0: 未排序 2:升序 1:降序    tableSortType: 0,
      if (v == 3) {
        this.tableSortKey = "pool_apy";
      } else if (v == 1) {
        this.tableSortKey = "amount";
      } else if (v == 4) {
        this.tableSortKey = "pool_tvl";
      } else if (v == 5) {
        this.tableSortKey = "__reward";
      } else {
        this.tableSortKey = "__reward";
      }
      this.sortSide = tableSortType == 1 ? "1" : "0";
      this.tableSortType = tableSortType;
    },
    onList({ index }) {
      this.changeTabValue(index + 1);
    },
    onListItem({ item, index }) {
      const name = index === 0 ? "all" : item.name;
      this.changeCurrencyTabValue(name);
    },
    //
    onActionChenck() {
      this.actionChenck = !this.actionChenck;
    },
    onh5Chenck(bool) {
      this.boolChenck = bool;
    },
    // 去子页面
    toPool(item) {
      //  path: "/pool/:type/:earn/:id", // type为池子的类型, 分为boardroom和liquidity, earn为赚取的币，分为mdx和ht, id为池子ID
      if(this.chainId != 1) {
        const earnCoin = item.earned_token.toLowerCase()
        const routerAddress = item.pool_type == 3 ? `/pool/lockup/${earnCoin}` : `/pool/boardroom/${earnCoin}/${item.pid}`
        this.$router.push({ path: routerAddress })
      }
    },
    // 重置 table
    resetTable() {
      this.currencyTabValue = "all";
      this.tableSortType = 0;
      this.tableSortKey = "";
      this.$refs.operation.resetTable()
    },
    // 修改分类
    changeTabValue(tab) {
      this.tabValue = tab;
      this.resetTable();
    },
    // 切换币种分类
    changeCurrencyTabValue(tab) {
      this.currencyTabValue = tab;
    },
    // 排序
    sortTable(key) {
      if (key === this.tableSortKey) {
        this.tableSortType = this.tableSortType === 1 ? 2 : 1;
      } else {
        this.tableSortType = 1;
      }
      this.tableSortKey = key;
    },
    getImgUrl(earnedToken) {
     return this.coinConfig ? this.globalGetImgUrl(this.coinConfig[earnedToken.toLowerCase()]) : ''
    },
    getLpImgUrl(item) {
      return this.globalGetImgUrl(item.lpAddress); 
    },
    // 判断是否为双挖
    isDoubleBenefit (val) {
      return val.includes('&')
    },
    openLink() {
      if (Object.keys(mdxTradeAdrList).includes(this.chainName)) {
        _toTrade(mdxTradeAdrList[this.chainName], this.getLanguage, this.isMobile)
      }
    },
    _toBlock
  }
};
</script>

<style lang="less" scoped>
@import "./Reward.less";
</style>
