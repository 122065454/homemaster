<template>
  <section class="tradingH5TableTitle between">
    <!--up down  sort   titles-->
    <!-- sortType 每日1 质押4 APY3  sortSide(0,1)  -->
    <div class="item">
      <span>  {{ $t("Trades") }}</span>
    </div>
    <!--  -->
     <div class="item">
      <!-- <p> <h5sort :name="$t('gasFeeRebateRate')"
             :sortType="sortType" :sortSide="sortSide" num="1" @sort="sort"></h5sort></p> -->
      <p> <h5sort :name="$t('CurrentTotalAwards')" :sortType="sortType" :sortSide="sortSide" num="2" @sort="sort"></h5sort></p>
    </div>
    <!--  -->
    <div class="item ">
      <p> <h5sort :name="$t('TotalTransactionAmount')" :sortType="sortType" :sortSide="sortSide" num="3" @sort="sort"></h5sort></p>
      <p> <h5sort :name="$t('CurrentTransactionVolume')" :sortType="sortType" :sortSide="sortSide" num="4" @sort="sort"></h5sort></p>
    </div>
    <!--  -->
    <div class="item">
      <p> <h5sort :name="$t('PersonalTurnover')" :sortType="sortType" :sortSide="sortSide" num="5" @sort="sort"></h5sort></p>
      <p> <h5sort :name="$t('PersonalReward')" :sortType="sortType" :sortSide="sortSide" num="6" @sort="sort"></h5sort></p>
    </div>
  </section>
</template>

<script>
//
import h5sort from "@/components/h5sort.vue";
export default {
  name: "tradingH5TableTitle",
  data() {
    return {
      listAct: 0,
      listItemAct: 0,
      searchValue: "",
      listItem: [],
     
    };
  },
  components: { h5sort },
  props: {
   
    sortType: {
      type: String,
      default: "1",
    },
    sortSide: {
      type: String,
      default: "1",
    },
  },
  beforeMount() {},


  methods: {
    sort(v, i, t) {
      // if (this.sortType !== v) {
      //   this.sortType = v;
      //   this.sortSide = "1";
      // } else {
      //   this.sortSide = this.sortSide === "1" ? "0" : "1";
      // }
      this.$emit("sort", v, i, t);
    },
  },
};
</script>

<style scoped lang="less">
.tradingH5TableTitle {
  min-height:56px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 500;
  color: #7f8faf;
  border-bottom: 1px solid #e5e7eb;
}
.h5TableTitle img {
  width: 6px;
  height: 10px;
  margin-left: 5px;
}
.h5TableTitle .line {
  margin: 0 2px;
  color: #d2d2d2;
}
.between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item {
  width: 70%;
  flex-grow: 1;
  p{
       margin:1px 0px;
  }
//   display: flex;
//   align-items: center;
}
.right {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
.item-end {
  width: 108px;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
/* .item-data {
}
.item-button {
  width: 90px;
  background-color: red;
} */
</style>
