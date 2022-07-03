<template>
  <span @click="sort(num)" class="sort">
    {{ name }}
    <img
      v-show="sortType === num && sortSide === '0'"
      src="@/assets/up.png"
      alt=""
    />
    <img
      v-show="sortType === num && sortSide === '1'"
      src="@/assets/down.png"
      alt=""
    />
    <img v-show="sortType !== num" src="@/assets/sort.png" alt="" />
  </span>
</template>

<script>
export default {
  name: "h5sort",
  data() {
    return {
      sortNum: 1,
    };
  },

  props: {
    name: {
      type: String,
      default: "",
    },
    sortType: {
      type: String,
      default: "",
    },
    sortSide: {
      type: String,
      default: "1",
    },
    num: {
      type: String,
      default: "",
    },
  },
  beforeMount() {},
  computed: {},

  methods: {
    sort(v) {
      this.sortNum = this.sortNum == 1 ? 2 : 1;
      this.$emit("sort", this.num, this.sortSide, this.sortNum);
    },
  },
};
</script>

<style scoped lang="less">
.sort {
  display: flex;
  align-items: center;
}

.sort img {
  width: 6px;
  height: 10px;
  margin-left: 5px;
}
@media screen and (max-width: 700px) {
  .sort img {
    width: 6px;
    height: 10px;
    margin-left: 5px;
  }
}
@media screen and (min-width: 700px) {
  .sort img {
    width: 9px;
    height: 15px;
    margin-left: 5px;
  }
}
</style>
