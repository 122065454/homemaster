<template>
  <section class="wind—mining " :class="[chainName, getLanguage]">
    <title-banner :liquidity_mdex="homeData.mdex_tvl"> </title-banner>
    <!--  -->
    <div class="wind-mining__content text">
      <div class="wind-mining__content-header-bg"></div>
      <div class="wind-mining__content-header">
        <!-- 以下是重构的标签  @onchenck="" 是否已质押  -->
        <selete-table v-if="chainName=='Bsc'" @change-list="onList" @change-list-item="onListItem" @switch-change-list="switchStatus = $event"
          @change-input="searchValue = $event" :list="listNameBsc" @onchenck="onChenck" kind="Liquidity" ref="operation"
          :inputText="isPC?$t('search') : $t('searchText')">
        </selete-table>

        <selete-table v-if="chainName=='Heco'" @change-list="onList" @change-list-item="onListItem" @switch-change-list="switchStatus = $event"
          @change-input="searchValue = $event" :list="listNameHeco" @onchenck="onChenck" kind="Liquidity" ref="operation"
          :inputText="isPC?$t('search') : $t('searchText')">
        </selete-table>
        <!-- PC表格     @row-click="onTable" $t('searchText')  "$t('search') -->
        <el-table v-if="isPC" :data="dataList" style="width: 100%" class="el-table-class numbers" row-key="address" @sort-change="sortChange">
          <el-table-column width="220px" min-width="220" align="center">
            <template slot="header">
              <span class="da-span"> {{tab == 2 ? $t('TradesLP') : $t('Trades')}} </span>
            </template>
            <template slot-scope="scope">
              <div class="Trades-one">
                <img  :src="getImg(scope.row)"  />
                <span style="margin-left: 10px" class="td-span numbers SemiBold">
                  {{
                    apylist[scope.row.pid] ? (apylist[scope.row.pid].base_name ? apylist[scope.row.pid].base_name : apylist[scope.row.pid].pool_name)   : ""
                  }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 每日产量 -->
          <el-table-column width="180px" min-width="180">
            <template slot="header">
              <span class="da-span">
                <h5sort :name="$t('DailyProduction')" :sortType="sortType" :sortSide="sortSide" num="1"
                  @sort="onh5Sort"></h5sort>
              </span>
            </template>
            <template slot-scope="scope">
              <span class="td-span">
                <CountUp :endVal="apylist[scope.row.pid] ? apylist[scope.row.pid].pool_mdx : 0" /> MDX
              </span>
            </template>
          </el-table-column>
          <el-table-column width="200px" min-width="200">
            <template slot="header">
              <span class="da-span">
                <h5sort :name="$t('MonthlyOutput')" :sortType="sortType" :sortSide="sortSide" num="2" @sort="onh5Sort">
                </h5sort>
              </span>
            </template>
            <template slot-scope="scope">
              <span class="td-span">
                <CountUp :endVal="apylist[scope.row.pid] ? apylist[scope.row.pid].pool_mdx * 30 : 0 " /> MDX
              </span>
            </template>
          </el-table-column>
          <!-- 质押资金 -->
          <el-table-column :label="$t('PledgeFund')" width="160px">
            <template slot="header">
              <span class="da-span">
                <h5sort :name="$t('PledgeFund')" :sortType="sortType" :sortSide="sortSide" num="4" @sort="onh5Sort">
                </h5sort>
              </span>
            </template>
            <template slot-scope="scope">
              <span class="td-span"> {{ mobileUnit }}
                <CountUp :endVal="_transferNum(fukData(scope.row.pid), getLanguage)" />
                {{_transferUnit(fukData(scope.row.pid), getLanguage, $t('unitB'), $t('unitM'))}}
              </span>
              <!-- <span>{{ scope.row.date }}</span> -->
            </template>
          </el-table-column>
          <el-table-column label="APR" width="120px" min-width="120">
            <template slot="header">
              <span class="da-span">
                <h5sort name="APR" :sortType="sortType" :sortSide="sortSide" num="3" @sort="onh5Sort"></h5sort>
              </span>
            </template>
            <!-- hoverIndex==scope.$index -->
            <template slot-scope="scope">
              <div class="apy-class">
                <CountUp :endVal="getApy(scope.row.pid)" />%
                <div class="topic_content" v-if="hoverIndex==scope.$index"><ApyTopic :item="scope.row" kind="liquidity" /></div>
                <div class="topic" v-show="(scope.row.pid > 7 && chainId == 128) || (scope.row.pid > 27 && chainId == 56)"><img @mouseover="hoverIndex=scope.$index" @mouseleave="hoverIndex=-1" :src="chainName=='Heco' ? hecoTopic : bscTopic" alt=""/></div>
              </div>
            </template>
          </el-table-column>
          <!-- 个人质押 -->
          <el-table-column width="170px" align="right">
            <template slot="header">
              <div class="div-reward">
                <span class="da-span ">
                  <h5sort :name="$t('PersonalReward')" :sortType="sortType" :sortSide="sortSide" num="5"
                    @sort="onh5Sort"></h5sort>
                </span>
              </div>
            </template>
            <template slot-scope="scope">
              <span class="td-span">
                <CountUp :options="options" :endVal="poolReward[scope.row.pid] || 0" /> MDX
              </span>
            </template>
          </el-table-column>
          <el-table-column label="" width="140px">
            <template slot-scope="scope">
              <div class="btn-icon">
                <span @click="onTable(scope.row)" class="span">{{ $t("Stakeds") }}</span>
                <span>|</span>
                <!-- <a :href="globalGetTokenConfig(scope.row)" class="span" target="_blank">{{ $t("transactions") }}</a> -->
                <span @click="openLink(scope.row)" class="span">{{ $t("transactions") }}</span>
              </div>
            </template>
          </el-table-column>
          <div slot="empty" class="empty">
            <span>{{$t('NoData')}}</span>
          </div>
        </el-table>
      </div>
      <!-- h5 表格 -->
      <div v-if="!isPC">
        <h5-table-title @sort="onh5Sort" :name="tab == 2 ? $t('TradesLP') : $t('Trades')" transaction="TVL"
          :PersonalIncome="$t('Reward')" :reward="$t('DailyProduction')" APY="APR" :sortType="sortType"
          :sortSide="sortSide"></h5-table-title>
        <h5-table v-for="(da, i) in dataList" :name="apylist[da.pid].base_name ? apylist[da.pid].base_name : apylist[da.pid].pool_name" :transaction="fukData(da.pid)"
          :reward="apylist[da.pid] ? apylist[da.pid].pool_mdx : 0" :APY="getApy(da.pid)" :key="i" :index="i" :item="da"
          :PersonalIncome="poolReward[da.pid] || 0" @ontable="onTable(da)" :show="boolChenck" kind="liquidity"></h5-table>
        <p v-if="dataList.length == 0" class="emptyData">{{ $t("empptyData") }}</p>
        <!-- boolChenck -->
      </div>
    </div>
    <apply-tip></apply-tip>
    <!-- 风险提示 -->
    <RiskWarnPop ref="RiskWarnPop" />
  </section>
</template>

<script>
import { _transferNum, _transferUnit } from "@/utils/comMethod"
import TitleBanner from "@/components/TitleBanner/TitleBanner"
import ApyTopic from "@/views/Boardroom/ApyTopic/ApyTopic"
import h5TableTitle from "@/components/h5TableTitle.vue"
import RiskWarnPop from "./RiskWarnPop/RiskWarnPop.vue"
import SeleteTable from "@/components/SeleteTable.vue"
import ApplyTip from "@/components/applyTip.vue"
import { isMobile } from "mobile-device-detect"
import h5Table from "@/components/h5Table.vue"
import h5sort from "@/components/h5sort.vue"
import { _toTrade } from "@/utils/urlMethod"
import { fnCheckSymble } from '@/api'

let intrvel = null;
export default {
  name: "liquidity",
  components: {
    RiskWarnPop,
    SeleteTable,
    "h5-table-title": h5TableTitle,
    "h5-table": h5Table,
    h5sort,
    TitleBanner,
    ApplyTip,
    ApyTopic
  },
  data() {
    return {
      hoverIndex: -1, // 鼠标悬停
      bscTopic: require('@/assets/bsc_topic.png'),
      hecoTopic: require('@/assets/heco_topic.png'),
      saveDataList: [],
      boolChenck: false,
      inputText: "",
      options: {
        decimalPlaces: 4,
      },
      tab: 1,
      sortType: "3", // 1每日产量 2每月产量 3apy 4质押资产
      sortSide: "1", // 1正序 0倒叙
      select: "",
      mobileUnit: isMobile ? "$" : "",
      unit: isMobile ? "" : "",
      classifyArr: [], // 分类组
      classifyActive: "all", // 选中
      searchValue: "",
      // 进行中:true/已结束:false分类
      switchStatus: true,
      // 风险提示
      riskStatus: false
    };
  },
  beforeCreate() {
    intrvel = setInterval(() => {
      this.$store.dispatch("liquidity/getApyList");
    }, 9000);
  },
  $computed: {
    bnp: "bnp",
  },
  watch: {
    list: {
      immediate: true,
      handler(v) {
        if (v && v[1]) {
          let obj = {};
          const chainId = this.chainId;
          let symbols = [];
          switch (chainId) {
            case "128":
              symbols = ["USDT", "ETH", "MDX", "HT", "HUSD"];
              break;
            case "56":
              symbols = ["BUSDT", "ETH", "MDX", "BNB"];
              break;
          }
          symbols.forEach((item) => {
            // let str = item.pair_name.split("/")[1];
            obj[item] = "";
          });
          let arr = Object.keys(obj);
          this.classifyArr = arr;
          this.tab = 1;
          this.setClassifyActive("all");
        }
      },
    },
  },
  computed: {
    riskShowStatus() {
      return this.$store.state.liquidity.riskShow[this.chainName]
    },
    listNameHeco(){
     return  [
        {
          name: "LP",
          show: true,
          child: [
            { name: this.$t("all"), show: true },
            { name: "USDT", show: false },
            { name: "ETH", show: false },
            { name: "MDX", show: false },
            { name: "HT", show: false },
            { name: "HUSD", show: false },
          ],
        },
        { name: this.$t("Innovation"), show: false,
          child: [
            { name: this.$t("all"), show: true },
            { name: "USDT", show: false },
            { name: "ETH", show: false },
            { name: "MDX", show: false },
            { name: "HT", show: false },
            { name: "HUSD", show: false },
          ],
        },
        { name: this.$t("currency"), show: false },
      ]
    },
     listNameBsc(){
        return [
        {
          name: "LP",
          show: true,
          child: [
            { name: this.$t("all"), show: true },
            { name: "USDT", show: false }, 
            { name: "BUSD", show: false },
            { name: "ETH", show: false },
            { name: "BNB", show: false },
            { name: "MDX", show: false },
          ],
        },
        { name: this.$t("Innovation"), show: false,
          child: [
            { name: this.$t("all"), show: true },
            { name: "USDT", show: false },
            { name: "ETH", show: false },
            { name: "MDX", show: false },
            { name: "HT", show: false },
            { name: "HUSD", show: false },
          ],
        },
        { name: this.$t("currency"), show: false },
      ]
    },
    homeData() {
      return this.$store.state.homeData;
    },
    list: function () {
      const list = [[], [], [], []]
      let pools = this.$store.getters["liquidity/poolList"]
      pools = pools.map((pool) => {
        return {
          ...pool,
          earnToken: "MDX",
        }
      })
      pools.forEach((val) => {
        // 单币 —— 3
        if (!val.name.includes(" LP")) list[3].push(val)
        // LP —— 1  
        if (val.name.includes(" LP")) list[1].push(val)
        // 所有 —— 2
        list[2].push(val)
      })
      return list
    },
    apylist() {
      return this.$store.state.liquidity.apylist
    },
    poolReward() {
      return this.$store.state.liquidity.poolReward
    },
    dataList() {
      let data = this.list[this.tab]
      if(this.boolChenck) data = this.list[2]
      if(this.tab == 1 && this.searchValue !== ''){
        data=this.list.reduce((prev, curr) => (prev.concat(curr)), []);
      }
      let arr = []
      if (data.length) {
        data.forEach((item) => {
          const pid = item.pid;
          const apyData = this.apylist[pid];
          let eObj = {
            ...apyData,
            ...item,
            ...{
              __apy: apyData ? +apyData.pool_apy + +apyData.swap_apy : 0,
              __tvl: apyData ? apyData.pool_tvl : 0,
              __earnPercent: apyData ? apyData.pool_rate : 0,
              __reward: apyData ? this.poolReward[apyData.pid] : 0,
            },
          };
          arr.push(eObj);
        });

        let str = "apy";
        switch (this.sortType) {
          case "1":
            str = "__earnPercent";
            break;
          case "2":
            str = "__earnPercent";
            break;
          case "4":
            str = "__tvl";
            break;
          case "3":
            str = "__apy";
            break;
          case "5":
            str = "__reward";
            break;
          default:
            str = "__apy";
        }

        let newArr = [];
        arr.forEach((item) => {
          const bool = this.tab === 1 || this.tab === 2
          if (bool && this.classifyActive !== "all") {
            if (!item.name.includes(this.classifyActive)){
              return;
            }
          }
          if (
            this.searchValue.length === 0 ||
            item.name.includes(this.searchValue.toLocaleUpperCase())
          ) {
            newArr.push(item);
          }
        })
        if(this.tab == 2 && !this.boolChenck) {
          newArr= newArr.filter(ele =>ele.pool_type == 2)
        }
        newArr.sort(this.compare(str))   

        if (this.isPC && this.boolChenck) {
          return newArr.filter((item) => this.poolReward[item.pid] > 0);
        }
        
        // 只有不为空时才进行去重
        if(this.searchValue.length !== 0 ){
          newArr= this.removeSame(newArr)
        }

        // switch切换
        if (this.switchStatus) {
          newArr = newArr.filter((item) => {
            return (this.apylist[item.pid] ? this.apylist[item.pid].pool_mdx : 0) > 0
          });
        } else {
          newArr = newArr.filter((item) => {
            return (this.apylist[item.pid] ? this.apylist[item.pid].pool_mdx : 0) == 0
          });
        }
        
        return newArr;
      } else {
        return [];
      }
    },
  },
  methods: {
    // 数组对象去重
    removeSame(arr){
      let result=[]
      let obj={}
      for(let i=0;i<arr.length;i++){
        if(!obj[arr[i].base_name]){
          result.push(arr[i]);
          obj[arr[i].base_name] = true;
        }
      }
      return result
    },
    // 是否质押
    onChenck(bool) {
      this.boolChenck = bool;
    },
    // 点击一行跳转
    onTable(item) {
      if (this.chainId != 1) {
        this.toPool(item);
      }
    },
    // 一级切换安装原来传法
    onList({ index }) {
      this.tab = index + 1
      this.$refs.operation.resetTable()
      if((index + 1 == 2) && this.riskShowStatus) {
        this.$refs.RiskWarnPop.status = true
      }
    },
    // 二级切换安装原来传法
    onListItem({ item, index }) {
      const name = index === 0 ? "all" : item.name;
      this.setClassifyActive(name);
    },
    // h5排序
    onh5Sort(v) {
      this.setSort(v);
    },
    // PC排序
    sortChange({ prop, order }) {
      this.setSort(prop.toString());
    },
    //以上重构的代码
    setdmx_show() {
      if (this.isPC) return "";
      return "MDX";
    },
    setdmx() {
      if (this.isPC) return "MDX";
      return "";
    },
    getApy(pid) {
      return this.apylist[pid] ? +(this.apylist[pid].pool_apy * 365).toFixed(2) + +(this.apylist[pid].swap_apy * 365).toFixed(2) : 0
    },
    toPool(item) {
      //  path: "/pool/:type/:earn/:id", // type为池子的类型, 分为boardroom和liquidity, earn为赚取的币，分为mdx和ht, id为池子ID
      this.$router.push({
        path: `/pool/liquidity/mdx/${item.pid}`,
      });
    },
    getImg(item) {
      return this.globalGetImgUrl(item.lpAddress);
    },
    fukData(pid) {
      return this.apylist[pid] ? this.apylist[pid].pool_tvl : 0;
    },
    h5_tab_evens() {
      this.$router.replace({
        path: `/trading`,
      });
      //this.$emit("onselete", "reward");
    },
    setClassifyActive(v) {
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
    setSort(v) {
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
    openLink(item) {
      fnCheckSymble(this.chainId, item.address).then(res => {
        if (res.data.code == 0) {
          _toTrade(item.address, this.getLanguage, this.isMobile)
        } else {
          window.open(this.globalGetTokenConfig(item), '_self')
        }
      })
    },
    _transferNum,
    _transferUnit
  },
  beforeDestroy() {
    clearInterval(intrvel);
  }
};
</script>
<style lang="less" scoped>
  @import './h5liquidity.less';
</style>
