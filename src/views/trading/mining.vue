<template>
  <section class="wind—mining" :class="[chainName, getLanguage]">
    <!-- banner -->
    <title-banner :trading_userReward="userReward" :trading_options="options" @on-withdrawal="Withdrawal"
      :trading_totalReward="totalReward">
    </title-banner>
    <div class="wind-mining__content text">
      <div class="wind-mining__content-header-bg"></div>
      <div class="wind-mining__content-header">
        <selete-table v-show="chainName=='Bsc'" :showCheck="false" @change-list="onList" 
        @change-input="searchValue = $event" :list="listNameBsc"
          :inputText="isPC?$t('search') : $t('searchText')">
        </selete-table>
         <selete-table v-show="chainName=='Heco'" :showCheck="false" @change-list="onList" 
         @change-input="searchValue = $event" :list="listNameHeco"
          :inputText="isPC?$t('search') : $t('searchText')">
        </selete-table>
        <trading-h5-table-title v-if="!isPC" :sortType="sortType" :sortSide="sortSide" @sort="onh5Sort">
        </trading-h5-table-title>
      </div>
      <div v-if="!isPC">
        <trading-h5-table v-for="(item, i) in dataList" :key="i" @click="openLink(item)" :item="item"
          @onclick="openLink(item)">
        </trading-h5-table>
        <p v-if="dataList.length == 0" class="emptyData">{{ $t("empptyData") }}</p>
      </div>
      <el-table v-if="isPC" :data="dataList" style="width: 100%" class="el-table-class numbers" row-key="pid" @sort-change="sortChange" @row-click="openLink">
        <el-table-column align="center">
          <template slot="header" slot-scope="scope">
            <span class="da-span"> {{$t("Trades") }} </span>
          </template>
          <template slot-scope="scope">
            <div class="item-title">
              <div class="Trades-one">
                <img :src="getImg(scope.row)" class="img1" />
              </div>
              <div class="min-btn">
                <p><span class="new-text-span numbers SemiBold">{{ scope.row.base_name ?  scope.row.base_name : scope.row.pair_name}}</span></p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <span class="da-span">
              <h5sort :name="$t('CurrentTotalAwards')" :sortType="sortType" :sortSide="sortSide" num="2"
                @sort="onh5Sort">
              </h5sort>
            </span>
          </template>
          <template slot-scope="scope">
            <span class="td-span">
              <CountUp :endVal="Number(scope.row.alloc_mdx_amt / 1e18)" /> MDX
            </span>
          </template>
        </el-table-column>
        <!-- 交易总额 -->
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <span class="da-span">
              <h5sort :name="$t('TotalTransactionAmount')" :sortType="sortType" :sortSide="sortSide" num="3"
                @sort="onh5Sort">
              </h5sort>
            </span>
          </template>
          <template slot-scope="scope">
            <span class="td-span">{{ mobileUnit }}
              <CountUp :endVal="_transferNum(Number(scope.row.total_quantity / 1e18), getLanguage)" />
              {{_transferUnit(Number(scope.row.total_quantity / 1e18), getLanguage, $t('unitB'), $t('unitM'))}}
            </span>
          </template>
        </el-table-column>
        <!-- 当前交易额 -->
        <el-table-column label="APY">
          <template slot="header" slot-scope="scope">
            <span class="da-span">
              <h5sort :name="$t('CurrentTransactionVolume')" :sortType="sortType" :sortSide="sortSide" num="4"
                @sort="onh5Sort"></h5sort>
            </span>
          </template>
          <template slot-scope="scope">
            <span class="td-span"> {{ mobileUnit }}
              <CountUp :endVal="_transferNum(Number(scope.row.pool_quantity / 1e18), getLanguage)" />
              {{_transferUnit(Number(scope.row.pool_quantity / 1e18), getLanguage, $t('unitB'), $t('unitM'))}}
            </span>
          </template>
        </el-table-column>
        <!-- 个人交易额 -->
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <span class="da-span">
              <h5sort :name="$t('PersonalTurnover')" :sortType="sortType" :sortSide="sortSide" num="5" @sort="onh5Sort">
              </h5sort>
            </span>
          </template>
          <template slot-scope="scope">
            <span class="td-span"> {{ mobileUnit}}
              <CountUp :endVal="rewardList[scope.row.pool_id] ? rewardList[scope.row.pool_id].userMint : 0" />
              {{ unit }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="">
          <template slot="header" slot-scope="scope">
            <span class="da-span">
              <h5sort :name="$t('PersonalReward')" :sortType="sortType" :sortSide="sortSide" num="6" @sort="onh5Sort">
              </h5sort>
            </span>
          </template>
          <template slot-scope="scope">
            <span class="td-span"> {{ mobileUnit}}
              <CountUp :endVal="Number(rewardList[scope.row.pool_id]? rewardList[scope.row.pool_id].userReward: 0)" />MDX
            </span>
          </template>
        </el-table-column>
          <div slot="empty" class="empty">
            <span>{{$t('NoData')}}</span>
          </div>
      </el-table>
    </div>
    <apply-tip></apply-tip>
  </section>
</template>
<script>
import tradingH5TableTitle from "@/components/tradingH5TableTitle.vue"
import { _transferNum, _transferUnit } from "@/utils/comMethod"
import TitleBanner from "@/components/TitleBanner/TitleBanner"
import tradingH5Table from "@/components/tradingH5Table.vue"
import SeleteTable from "@/components/SeleteTable.vue"
import coinConfig from "@/utils/address.config.js"
import ApplyTip from "@/components/applyTip.vue"
import { isMobile } from "mobile-device-detect"
import { _toTrade } from "@/utils/urlMethod"
import Button from "@/components/button.vue"
import h5sort from "@/components/h5sort.vue"
import { fnCheckSymble } from '@/api'

let actionTip = null
let intrvel = null

export default {
  name: "tradeReward",
  components: {
    TitleBanner,
    Button,
    SeleteTable,
    "trading-h5-table-title": tradingH5TableTitle,
    "trading-h5-table": tradingH5Table,
    h5sort,
    ApplyTip
  },
  data() {
    return {
      tab: 1,
      sortType: "1", // 1每日产量 2每月产量 3apy 4质押资产
      sortSide: "1", // 1正序 0倒叙
      tvlAmount: 0,
      select: "",
      mobileUnit: isMobile ? "" : "",
      unit: isMobile ? "" : "",
      liquidityApys: {},
      classifyArr: [], // 分类组
      classifyActive: "all", // 选中
      searchValue: "",
      userMessage: {},
      myContract: null,
      tokenJson: {},
      totalReward: 0,
      userReward: 0,
      options: {
        decimalPlaces: 4,
      },
    };
  },
  beforeCreate() {
    this.$store.dispatch("reward/getTradeList");
    intrvel = setInterval(() => {
      this.$store.dispatch("reward/getTradeList");
    }, 9000)
  },
  watch: {
    tradelist: {
      immediate: true,
      handler(v) {
        if (v) {
          // 分类
          if (this.classifyArr.length === 0) {
            let obj = {};
            const symbols = ["WHT", "MDX", "USDT", "HBTC", "HUSD", "ETH"];
            symbols.forEach((item) => {
              obj[item] = "";
            });
            let arr = Object.keys(obj);
            this.classifyArr = arr;
          }
          // 个人
          if (Object.keys(this.userMessage).length === 0 && v.length) {
            let obj = {};
            v.forEach((item) => {
              obj[item.pid] = {
                userReward: "0",
                userMint: "0",
              };
            });
            this.userMessage = obj;
            if (this.myContract) {
              this.getUserMessage();
            }
          }
        }
      },
    },
  },
  computed: {
    listNameHeco(){
      return [
        { name: this.$t("all"), show: true },
        { name: "WHT", show: false },
        { name: "MDX", show: false },
        { name: "USDT", show: false },
        { name: "HBTC", show: false },
        { name: "HUSD", show: false },
        { name: "ETH", show: false },
      ]
    },
    listNameBsc(){
      return  [
        { name: this.$t("all"), show: true },
        { name: "USDT", show: false },
        { name: "ETH", show: false },
        { name: "BNB", show: false },
        { name: "MDX", show: false },
      ]
    },
    chainName() {
        this.setClassifyActive('all');
      return this.$store.state.chainName;
    },
    isPC() {
      return this.$store.getters.isPC;
    },
    chainId() {
      return this.$store.state.chainId;
    },
    coinConfig() {
      return coinConfig[this.chainId];
    },

    tradelist() {
      return this.$store.state.reward.tradelist;
    },
    rewardList() {
      return this.$store.state.reward.rewardList;
    },
    miningContract() {
      return this.$store.state.reward.miningContract;
    },
    dataList() {
      let data = this.tradelist;
      let arr = [];
      let totalReward = 0;
      let userReward = 0;
      if (data.length == 0) {
        return [];
      }
      data.forEach((item) => {
        let liquidityApysEven = this.liquidityApys[item.pid];
        let eObj = {
          ...{},
          ...item,
          ...{
            // 权重
            poolList__alloc_point: liquidityApysEven
              ? liquidityApysEven.alloc_point
              : 0,
            // 总奖励
            poolList__alloc_mdx_amt: liquidityApysEven
              ? liquidityApysEven.alloc_mdx_amt / 1e18
              : 0,
            // 交易总额
            poolList__total_quantity: liquidityApysEven
              ? liquidityApysEven.total_quantity / 1e18
              : 0,
            // 交易额
            poolList__pool_quantity: liquidityApysEven
              ? liquidityApysEven.pool_quantity / 1e18
              : 0,
          },
        };
        arr.push(eObj);
      });
      let str = "pool_apy";

      switch (this.sortType) {
        case "1":
          str = "fee_refund";
          break;
        case "2":
          str = "alloc_mdx_amt";
          break;
        case "3":
          str = "total_quantity";
          break;
        case "4":
          str = "pool_quantity";
          break;
        case "5":
          str = "poolList__pool_quantity";
          break;
        case "6":
          str = "poolList__pool_quantity";
          break;
        default:
          str = "pool_apy";
      }
      let newArr = [];
      arr.forEach((item) => {
        totalReward += Number(item.alloc_mdx_amt / 1e18);
        if (this.tab === 1 && this.classifyActive !== "all") {
          if (!item.pair_name.includes(this.classifyActive)) return;
        }
        if (
          this.searchValue.length === 0 ||
          item.pair_name.includes(this.searchValue.toLocaleUpperCase())
        ) {
          newArr.push(item);
        }
      });
      for (const [key, value] of Object.entries(this.rewardList)) {
        userReward += value.userReward;
      }
      this.userReward = userReward;
      this.totalReward = totalReward;
      newArr.sort(this.compare(str));
      return newArr;
    },
  },
  methods: {
    // 是否质押
    onChenck(bool) {
      this.boolChenck = bool;
    },
    // 点击一行跳转
    onTable(item) {
      this.toPool(item);
    },
    // 一级切换安装原来传法
    onList({ item, index }) {
      const name = index === 0 ? "all" : item.name;
      this.setClassifyActive(name);
    },
    // h5排序
    onh5Sort(v) {
      this.setSort(v);
    },
    // PC排序
    sortChange({ prop }) {
      this.setSort(prop.toString());
    },
    getImg(item) {
      return this.globalGetImgUrl(item.pair); 
    },
    openLink(item) {
      fnCheckSymble(this.chainId, item.address).then(res => {
        if (res.data.code == 0) {
          _toTrade(item.pair, this.getLanguage, this.isMobile)
        } else {
          window.open(this.globalGetTokenConfig(item), '_self')
        }
      })
      // _toTrade(item.pair, this.getLanguage, this.isMobile)
      // window.open(
      //   `https://${this.chainId == 56 ? 'bsc': 'ht'}.${window.location.hostname.replace('www.', '')}/#/swap?inputCurrency=${item.token0}&outputCurrency=${item.token1}`,
      //   "_blank"
      // );
    },
    initWeb3() {},
    getUserMessage() {},
    Withdrawal() {
      const miningContract = this.miningContract;
      const withdrawalmsg = `Withdrawal ${this.userReward} MDX`;
      const overalltip = this.$overalltip({
        type: "loading",
        msg: withdrawalmsg,
      });
      const account = this.$store.state.boardRoom.account;
      miningContract.methods
      .takerWithdraw()
      .send({ from: account })
      .then(() => {
        overalltip.close();
        const msg = `${withdrawalmsg} Success`;
        actionTip = this.$overalltip({
          type: "success",
          msg,
        });
        this.$store.dispatch("reward/getTradeList");
      })
      .catch((err) => {
        overalltip.close();
        const msg = `${withdrawalmsg} Error`;
        actionTip = this.$overalltip({
          type: "error",
          msg,
        });
      });
    },
    setTab() {
      if (this.tab === v) return;
      this.tab = v;
      this.sortType = "1";
      this.sortSide = "1";
      this.searchValue = "";
      this.classifyActive = "all";
    },
    setClassifyActive(v) {
      console.log(v)
      this.classifyActive = v;
    },
    compare(property) {
      return (a, b) => {
        var value1 = a[property];
        var value2 = b[property];
        if (this.sortSide === "0") return value1 - value2;
        if (this.sortSide === "1") return value2 - value1;
      };
    },
    setSort(v, index) {
      if (this.sortType !== v) {
        this.sortType = v;
        this.sortSide = "1";
      } else {
        this.sortSide = this.sortSide === "1" ? "0" : "1";
      }
    },
    selectItem(i) {
      this.select = i;
    },
    _transferNum, 
    _transferUnit
  },
  beforeDestroy() {
    if (actionTip) {
      actionTip.close();
    }
    clearInterval(intrvel)
  },
};
</script>
<style lang="less" scoped>
@import './mining.less';
</style>
