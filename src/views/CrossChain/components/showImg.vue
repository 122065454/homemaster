<template>
  <span class="span">
    <!-- PolyNetwork-icon.svg -->
    <img v-show="name=='PolyNetwork'" src="@/assets/svg/PolyNetwork-icon.svg" class="bet-icon" alt="">
    <img v-show="name=='HECO'" src="@/assets/HECO.png" class="bet-icon" alt="">
    <img v-show="name=='MDX'" src="@/assets/MDX.png" class="bet-icon" alt="">
    <img v-show="name=='BSC'" src="@/assets/BSC.png" class="bet-icon" alt="">
    <img v-show="name=='Ethereum'" src="@/assets/ETH.png" class="bet-icon" alt="">
    <img v-show="name=='FEI'" src="@/assets/FEI.png" class="bet-icon" alt="">
    <img v-show="name=='Tribe'" src="@/assets/Tribe.png" class="bet-icon" alt="">
  </span>
</template>
 
<script>
export default {
  name: "show-img",
  data() {
    return {};
  },

  props: {
    name: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped lang="less">
.span {
  display: inline-block;
  height: 20px;
  width: 20px;
  margin-right: 5px;
}
.bet-icon {
  height: 20px;
  width: 20px;
}
</style>