<template>
  <div class="detail" :class="getLanguage">
    <p class="p" v-if="!isPC">{{ $t("Detailedrecords") }}</p>
    <section class="detail-content text">
      <p class="p text Heavy" v-if="isPC">{{ $t("Detailedrecords") }}</p>
      <nav>
        <ul>
          <li
            v-for="(item, index) in tabList"
            :key="index"
            @click="selectTab(index)"
            :class="[i === index ? 'liclick' : '']"
          >
            {{ $t(`${item}`) }}
          </li>
        </ul>
      </nav>
      <!-- pc 的头部 -->
      <header>
        <!-- pc 详情重构 -->
        <template v-if="isPC">
          <el-table
            v-if="i !== 1"
            :key="tableKey"
            style="width: 1200px"
            :data="listData"
            class="numbers"
            row-key="getRowKeys"
            v-loading="loading"
            :row-class-name="tableRowClassName"
            element-loading-text="loading..."
            lazy
            stripe
          >
            <el-table-column :label="$t('Address')" align="center">
              <template slot-scope="scope">
                <a
                  :href="
                    hashQueryAddress('address', scope.row.address, chainName)
                  "
                  target="_blank"
                  >{{ addressSlice(scope.row.address) }}</a
                >
                <i></i>
              </template>
            </el-table-column>
            <el-table-column :label="$t('jyhash')" align="center">
              <template slot-scope="scope">
                <a
                  :href="hashQueryAddress('tx', scope.row.hash, chainName)"
                  target="_blank"
                >
                  {{ addressSlice(scope.row.hash) }}</a
                >
                <i></i>
              </template>
            </el-table-column>
            <el-table-column :label="$t('qukhash')" align="center">
              <template slot-scope="scope">
                <a
                  :href="blockHash(scope.row.block_hash, chainName)"
                  target="_blank"
                  >{{ addressSlice(scope.row.block_hash) }}</a
                >
                <i></i>
              </template>
            </el-table-column>
            <el-table-column :label="$t('qkjys')" align="center">
              <template slot-scope="scope">
                {{ scope.row.trans_count }}
              </template>
            </el-table-column>
            <!-- <el-table-column label="基数" align="center">
              <template slot-scope="scope">
                {{ scope.row.multiple }}
              </template>
            </el-table-column> -->
            <el-table-column :label="$t('jyxuhao')" align="center">
              <template slot-scope="scope">
                {{ scope.row.repurch_index }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('Positionnumber')" align="center">
              <template slot-scope="scope">
                {{ scope.row.repurch_salt }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('jxsjc')" align="center">
              <template slot-scope="scope">
                {{ formatDate(scope.row.repurch_time * 1000).ymdhms.slice(5) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('cxhm')" align="center">
              <template slot-scope="scope">
                {{ scope.row.repurch_number }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('Contributionamount')" align="center">
              <template slot-scope="scope">
                <!-- {{ splitFormat(scope.row.amount) }}MDX -->
                {{ splitFormat(scope.row.base_amount) }}MDX
              </template>
            </el-table-column>
            <el-table-column :label="$t('Lottery')" align="center">
              <template slot-scope="scope">
                <img :src="imgPrice[scope.row.reward_type]" alt="" />
              </template>
            </el-table-column>
          </el-table>
          <!-- 燃烧池记录 -->
          <el-table
            v-if="i == 1"
            style="width: 1200px"
            :data="listData"
            v-loading="loading"
            element-loading-text="loading..."
            :lazy="true"
             class="numbers"
          >
            <template v-if="i == 1">
              <el-table-column :label="$t('rscjl')">
                <template slot-scope="scope">
                  <a
                    :href="
                      hashQueryAddress('address', listData[0].to, chainName)
                    "
                    target="_blank"
                    >{{ addressSlice(listData[0].to) }}</a
                  >
                  <i></i>
                </template>
              </el-table-column>
              <el-table-column :label="$t('jyhash')">
                <template slot-scope="scope">
                  <a
                    :href="hashQueryAddress('tx', listData[0].hash, chainName)"
                    target="_blank"
                    >{{ addressSlice(listData[0].hash) }}</a
                  >
                  <i></i>
                </template>
              </el-table-column>

              <el-table-column :label="$t('xiaohui')">
                <template slot-scope="scope">
                  {{ listData[0].destroy_time }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('numsput')">
                <template slot-scope="scope">
                  {{ splitFormat(listData[0].repurch_amount) }}MDX
                </template>
              </el-table-column>
              <el-table-column :label="$t('Amounburned')">
                <template slot-scope="scope">
                  {{ splitFormat(listData[0].destroy_amount) }}MDX
                </template>
              </el-table-column>
            </template>
          </el-table>
          <el-pagination
            align="center"
            @current-change="handleCurrentChange"
            :page-size="5"
            layout="total, prev, pager, next, jumper"
            :total="lastPage"
            class="numbers"
          >
          </el-pagination>
        </template>
      </header>
      <!-- 交易数据H5重构 -->
      <template v-if="!isPC">
        <div class="detail-data">
          <el-table
            :data="H5listData"
            style="width: 343px"
            v-if="i !== 1"
            :row-key="getRowKeys"
            max-height="500px"
            class="numbers"
            infinite-scroll-distance="20px"
            v-infinite-scroll="load"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="center" inline>
                  <el-form-item :label="$t('Address') + ':'">
                    <span>
                      <a
                        :href="
                          hashQueryAddress(
                            'address',
                            props.row.address,
                            chainName
                          )
                        "
                        >{{ addressSlice(props.row.address) }}</a
                      >
                      <i></i>
                    </span>
                  </el-form-item>
                  <el-form-item :label="$t('jyhash') + ':'">
                    <span>
                      <a
                        :href="
                          hashQueryAddress('tx', props.row.hash, chainName)
                        "
                        >{{ addressSlice(props.row.hash) }}</a
                      >
                      <i></i>
                    </span>
                  </el-form-item>
                  <el-form-item :label="$t('qukhash') + ':'">
                    <a
                      :href="blockHash(props.row.block_hash, chainName)"
                      class="three_header"
                      >{{ addressSlice(props.row.block_hash) }}<i></i>
                    </a>
                  </el-form-item>
                  <el-form-item :label="$t('qkjys') + ':'">
                    <span>{{ props.row.trans_count }}</span>
                  </el-form-item>
                  <el-form-item :label="$t('Positionnumber') + ':'">
                    <span>{{ props.row.repurch_salt }}</span>
                  </el-form-item>
                  <!-- <el-form-item label="基数" align="center">
                     <span>{{ props.row.multiple }}</span>     
                   
                  </el-form-item> -->
                  <el-form-item :label="$t('jyxuhao') + ':'" align="center">
                    <span>{{ props.row.repurch_index }}</span>
                  </el-form-item>
                  <el-form-item :label="$t('Contributionamount') + ':'">
                    <!-- <span>{{ splitFormat(props.row.amount) }}MDX </span> -->
                    <span>{{ splitFormat(props.row.base_amount) }}MDX </span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column :label="$t('jxsjc')" prop="repurch_time">
              <template slot-scope="scope">
                {{ formatDate(scope.row.repurch_time * 1000).ymdhms.slice(5) }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('cxhm')"
              prop="repurch_number"
              align="center"
            >
            </el-table-column>
            <el-table-column
              :label="$t('Lottery')"
              prop="reward_type"
              align="center"
            >
              <template slot-scope="scope">
                <img :src="imgPrice[scope.row.reward_type]" alt="" />
              </template>
            </el-table-column>
          </el-table>

          <!-- 燃烧池记录 -->

          <el-table
            :data="H5listData"
            style="width: 343px"
            max-height="400"
            v-if="i == 1 && H5listData"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="center" inline>
                  <el-form-item :label="$t('rscjl')">
                    <template slot-scope="scope">
                      <a
                        :href="
                          hashQueryAddress(
                            'address',
                            H5listData[0].to,
                            chainName
                          )
                        "
                        target="_blank"
                        >{{ addressSlice(H5listData[0].to) }}</a
                      >
                      <i></i>
                    </template>
                  </el-form-item>
                  <el-form-item :label="$t('jyhash')">
                    <span>
                      <a
                        :href="
                          hashQueryAddress('tx', H5listData[0].hash, chainName)
                        "
                        >{{ addressSlice(H5listData[0].hash) }}</a
                      >
                      <i></i>
                    </span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column :label="$t('xiaohui')">
              <template slot-scope="scope">
                {{ H5listData[0].destroy_time }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('numsput')" align="center">
              <template slot-scope="scope">
                {{ splitFormat(H5listData[0].repurch_amount) }}MDX
              </template>
            </el-table-column>
            <el-table-column :label="$t('Amounburned')" align="center">
              <template>
                {{ splitFormat(H5listData[0].destroy_amount) }}MDX
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </section>
  </div>
</template>

<script>
import { splitFormat, formatDate, Base_url } from "@/utils";
import { getRscinfo, getListInfo } from "@/api/buyback.js";
export default {
  name: "detail",
  components: {},
  data() {
    return {
      tabList: ["Myrecord", "rscjl", "burningrecord", "Allprizewinners"],
      imgPrice: {
        0: require("@/views/buyBack/img/lose-face.png"),
        1: require("@/views/buyBack/img/pc-one.png"),
        2: require("@/views/buyBack/img/pc-two.png"),
      },
      splitFormat: splitFormat,
      formatDate: formatDate,
      i: 0,
      selectIndex: 0, // 燃烧池下标
      page: 1, // 当前页
      isActive: false, // 按钮激活
      listData: [], // 数据
      lastPage: 0, // 最后页
      // base_url: "https://gateway.mdex.com",
      H5listData: [], // h5 的数据
      loading: false,
      tableKey: 0,
      // base_url: Base_url,
    };
  },
  computed: {
    lang() {
      return this.$store.state.language === "en" ? "en" : "zn";
    },
    getData() {
      return this.$store.state.buyBack.assetBuyData;
    },
    isPC() {
      return this.$store.getters.isPC;
    },
    id() {
      return this.$store.state.buyBack.id;
    },
    chainId() {
      return this.$store.getters.chainId;
    },
  },
  watch: {
    //  监听 id 的 变化
    id(val, oldval) {
      //  alert(val)
      this.init();
      this.i = 0;
    },
    // chainId
    chainId() {
      this.init();
      this.i = 0;
    },
  },
  created() {
    this.init();
  },
  methods: {
    getRowKeys(row) {
      return row.repurch_index + row.repurch_salt + row.repurch_number;
    },
    handleCurrentChange(val) {
      this.page = val;
      //  this.page++;
      this.fnGetdata();
    },
    tableRowClassName({ row }) {
      if (row.reward_type !== 0) {
        return "success-row";
      }
    },
    load() {
      this.page++;
      // 发请求 翻页
      this.PageReques();
    },
    // 获取燃烧记录
    fnGetrs() {
      // const base= this.Base_url
      this.listData = [];
      this.H5listData = [];
      getRscinfo({
        repurch_id: this.getData.id,
        mdex_chainid: this.chainId,
      }).then((res) => {
        console.log("res", res);
        if (res.data.code === 0 && res.data.result) {
          const { result } = res.data;
          this.listData = result;
          // this.currentpage = result.current_page;
          this.lastPage = 1;
          result ? (this.listData = [result]) : (this.listData = []);
          result ? (this.H5listData = [result]) : (this.H5listData = []);
        }
      });
    },
    //   hash 截取
    addressSlice(str) {
      return str
        ? str.substring(0, 5) + "..." + str.substring(str.length - 5)
        : "";
    },
    //    地址查询
    hashQueryAddress(name, address, chain) {
      return `https://${
        chain === "Heco" ? "hecoinfo" : "bscscan"
      }.com/${name}/${address}`;
    },
    // 区块hash跳转
    blockHash(address, chain) {
      return `https://${
        chain === "Heco" ? "hecoinfo" : "bscscan"
      }.com/block/${address}`;
    },
    //  默认显示我的记录
    init() {
      this.H5listData = [];
      this.getHistroylist(this.account);
    },
    // 获取历史数据
    // 历史列表
    getHistroylist(address = "", page = 1, check_reward = 0) {
      this.loading = true;
      const params = {
        repurch_id: this.getData.id,
        page,
        address,
        check_reward,
        mdex_chainid: this.chainId,
      };
      getListInfo(params)
        .then((res) => {
          // hideLoading()
          this.loading = false;
          console.log("res", res);
          if (res.data.code === 0 && res.data.result) {
            const { result } = res.data;
            if (result) {
              this.listData = result.data;
              // this.currentpage = result.current_page;
              this.lastPage = result.total;
              this.H5listData.push(...result.data);
            }
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 请求
    fnGetdata() {
      switch (this.i) {
        case 0:
          this.getHistroylist(this.account, this.page);
          break;
        case 1:
          this.fnGetrs();
          break; //燃烧池
        case 2:
          this.getHistroylist("", this.page);
          break;

        case 3:
          this.getHistroylist("", this.page, 1);
          break;
      }
    },
    selectTab(index) {
      this.H5listData = [];
      this.listData = [];
      this.page = 1;
      this.tableKey++;
      // this.lastPage = 1;
      this.i = index;
      this.i === 1 ? (this.selectIndex = 1) : (this.selectIndex = 0);
      this.fnGetdata();
    },
    // 翻页请求
    PageReques() {
      this.fnGetdata();
    },
  },
};
</script>
 <style lang="less" scoped>
@import './h5detailRcored.less';
// pc
@media screen and (min-width: 450px) {
  /deep/.el-table .success-row {
    background: #fff7f4;
  }
  /deep/ .el-pagination {
    margin-top: 33px;
  }
  /deep/.el-table .cell {
    word-break: normal;
  }
  /deep/.el-pagination button:disabled {
    color: #c0c4cc !important;
    background: #fff !important;
    cursor: not-allowed;
    box-shadow: none !important;
  }

  // 详细记录
  .detail {
    position: relative;
    width: 100%;
    // height: 721px;
    height: 814px;
    background-color: #fff;
    margin-top: -48px;
    padding-top: 70px;
    .detail-content {
      width: 1200px;
      margin: 0 auto;
    }
    .p {
      font-size: 30px;
      color: #000000;
      text-align: center;
      margin-bottom: 34px;
    }
    nav {
      ul {
        display: flex;
      }
      li {
        font-size: 20px;
        color: rgba(60, 60, 67, 0.6);
        margin-right: 45px;
        cursor: pointer;
      }
      .liclick {
        font-weight: bold;
        color: #000000;
      }
      li:hover {
        color: #000000;
      }
    }
    header {
      height: 67px;
      border-bottom: 1px solid #f0f2f5;
      ul {
        display: flex;
        justify-content: space-between;
      }

      li {
        display: flex;
        align-items: center;
        height: 67px;
        font-size: 14px;
        color: rgba(60, 60, 67, 0.6);
      }
    }

    a {
      color: #006ced;
    }
    i {
      display: inline-block;
      background: url("~@/views/buyBack/img/icon.svg");
      width: 14px;
      height: 14px;
    }
    img {
      width: 30px;
      height: 30px;
    }
  }
  .is-price {
    background: #fff7f4;
    .four,
    .three-li .three_header {
      color: #ff8830;
    }
  }
}

</style>