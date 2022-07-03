<template>
  <section class="h5TableTitle between numbers" :class="chainName" @click="onitem" v-show="isShow">
    <!--up down  sort-->
    <div class="item">
      <p> {{ item.base_name ? item.base_name : item.pair_name }}</p>
    </div>
    <div class="item">
       <p>
        <CountUp :endVal="Number(item.alloc_mdx_amt / 1e18)" />MDX
      </p>
    </div>
    <div class="item">
      <p>
        <CountUp :endVal="_transferNum(Number(item.total_quantity / 1e18), getLanguage)" />
        {{_transferUnit(Number(item.total_quantity / 1e18), getLanguage, $t('unitB'), $t('unitM'))}}
        {{ unit }}
      </p>
      <p> 
        <CountUp :endVal="_transferNum(Number(item.pool_quantity / 1e18), getLanguage)" />
        {{_transferUnit(Number(item.pool_quantity / 1e18), getLanguage, $t('unitB'), $t('unitM'))}}
        {{ unit }}
      </p>
    </div>
    <div class="item">
      <p>{{ mobileUnit }}<CountUp :endVal="Number( rewardList[item.pool_id]? rewardList[item.pool_id].userMint: 0)" />{{ unit }}</p>
      <p><CountUp :endVal="Number( rewardList[item.pool_id] ? rewardList[item.pool_id].userReward : 0 )" />MDX</p>
    </div>

  </section>
</template>
<script>
import { _transferNum, _transferUnit } from "@/utils/comMethod"
import { formatFloat } from "@/utils/formatBalance";
import { divide, splitFormat } from "@/utils";
import { isMobile } from "mobile-device-detect";
export default {
  name: "h5Table",
  data() {
    return {
      listAct: 0,
      listItemAct: 0,
      searchValue: "",
      listItem: [],
      per: "",
      after: "",
      earned: "",
      mobileUnit: isMobile ? "" : "",
      unit: isMobile ? "" : "USDT",
    };
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },

    show: {
      type: Boolean,
      default: false,
    },
  },
  beforeMount() {},
  mounted() {},
  computed: {
    chainName() {
      return this.$store.state.chainName;
    },
    isShow() {
      if (this.show) {
        return this.PersonalIncome === 0 ? false : true;
      }
      return true;
    },
    mobileCountUpOptions() {
      return {
        formattingFn: (number) => {
          let m=10000
          let b=100000000
          if(this.$t("unitM")=='M'||this.$t("unitB")=='B'){
              m=1000000
              b=1000000000
          }
          if(number>b){
                  return splitFormat(divide(number, b), 2) + this.$t("unitB");
          }
          if(number>m){
                 return splitFormat(divide(number, m), 2) + this.$t("unitM");
          }
          return number.toLocaleString() ;
        },
      };
    },
    rewardList() {
      return this.$store.state.reward.rewardList;
    },
  },

  methods: {
    getformatFloat() {
      return formatFloat(this.PersonalIncome, 4);
    },
    onitem() {
      this.$emit("onclick");
    },
    _transferNum, 
    _transferUnit
  },
};
</script>

<style scoped lang="less">
.Heco {
  .content-header__h5table-left-rose {
    background: #2c72f4;
    color: #fff;
  }
}
.Bsc {
  .content-header__h5table-left-rose {
    color: #171717;
    background: #ffca13;
  }
}
.h5TableTitle {
  height: 56px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 500;
  color: #7f8faf;
  border-bottom: 1px solid #f6f6f6;
}
.between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item {
  width: 100%;
  flex-grow: 1;
}
.item p {
  font-size: 12px;
  color: #626e88;
  font-weight: 600;
  transform: scale(0.85);
}
.item p:first-child {
  height: 20px;
  //   color: #48587b;
}
.item p:last-child {
  height: 15px;
  font-size: 12px;
  //   color: #7f8faf;
}
.right p {
  text-align: right;
}
.item-end {
  width: 108px;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.item-end p {
  width: 75px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  background: #03ad90;
  border-radius: 4px;
}
.span {
  margin-left: 2px;
}
.content-header__h5table-left-rose {
  padding: 0 4px;
  display: inline-block;
  height: 17px;
  line-height: 17px;
  border-radius: 2px;

  transform: scale(0.9);
}
</style>
