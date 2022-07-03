<template>
  <section class="h5TableTitle between">
    <!--up down  sort-->

    <!-- sortType 每日1 质押4 APY3  sortSide(0,1)  -->
    <div class="item">
      <template v-if="kind!='Reward'">
        <span>{{ name }}</span>
        <span class="line">/</span>
      </template>
      <h5sort
        :name="transaction"
        :sortType="sortType"
        :sortSide="sortSide"
        class="numbers"
        num="4"
        @sort="sort"
      ></h5sort>
      <template v-if="kind=='Reward'">
        <span class="line">/</span>
        <h5sort
          :name="reward"
          :sortType="sortType"
          :sortSide="sortSide"
          num="1"
          @sort="sort"
        ></h5sort>
      </template>
    </div>
    <div class="item right">
      <h5sort
        :name="PersonalIncome"
        :sortType="sortType"
        :sortSide="sortSide"
        num="5"
        @sort="sort"
      ></h5sort>
      <template v-if="kind!='Reward'"> 
        <span class="line">/</span>
        <h5sort
          :name="reward"
          :sortType="sortType"
          :sortSide="sortSide"
          num="1"
          @sort="sort"
        ></h5sort>
      </template>
    </div>
    <div class="item-end">
      <h5sort
        :name="APY"
        :sortType="sortType"
        :sortSide="sortSide"
        num="3"
        class="numbers"
        @sort="sort"
      ></h5sort>
    </div>
  </section>
</template>

<script>
//
import h5sort from "@/components/h5sort.vue";
export default {
  name: "h5TableTitle",
  data() {
    return {
      isShow: false,
      listAct: 0,
      listItemAct: 0,
      searchValue: "",
      listItem: [],
    };
  },
  components: { h5sort },
  props: {
    name: {
      type: String,
      default: "交易对",
    },
    transaction: {
      type: String,
      default: "TVL",
    },
    PersonalIncome: {
      type: String,
      default: "个人收益",
    },
    reward: {
      type: String,
      default: "日产量",
    },
    APY: {
      type: String,
      default: "APY",
    },
    sortType: {
      type: String,
      default: "3",
    },
    sortSide: {
      type: String,
      default: "1",
    },
    kind: {
      type: String,
      default: "liquidity",
    }
  },
  beforeMount() {},
  computed: {},

  methods: {
    sort(v, i, t) {
    
      // if (this.sortType !== v) {
      //   this.sortType = v;
      //   this.sortSide = "1";
      // } else {
      //   this.sortSide = this.sortSide === "1" ? "0" : "1";
      // }
      this.$emit("sort", v, i, t);
    }
  },
};
</script>

<style scoped lang="less">
.h5TableTitle {
  height: 35px;
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
  // width: 70%;
  width: 80px;
  flex-grow: 1;
  display: flex;
  align-items: center;
}
.right {
  display: flex;
  justify-content: flex-end;
  // width: 100%;
}
.item-end {
  width:88px;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.es {
  .right {
    justify-content: inherit;
  }
}

/* .item-data {
}
.item-button {
  width: 90px;
  background-color: red;
} */
</style>
