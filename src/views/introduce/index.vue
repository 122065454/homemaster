<template>
  <div class="main" :class="[chainName, getLanguage]">
    <title-banner />
    <div class="introduce text">
      <section :class="bannerName"></section>

      <div class="list">
        <h1 class="text Heavy">{{ $t('joinmedx')}}</h1>
        <p v-html="$t('joinmedxDsc')"></p>
        <div class="apply">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSem595jWpO5_A5fRj9W4-wX_3mg3ypqqNiXcC_yi-tpcbOaqA/viewform" 
          style='text-decoration:underline;' target="_blank">{{ $t("joinnow") }}</a>
        </div>
      </div>
      <div class="list">
        <h1 class="text Heavy">{{$t('joinLiquidity')}}</h1>
        <p v-html="$t('joinLiquidityDsc')">
         
        </p>
        <div class="apply">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSem595jWpO5_A5fRj9W4-wX_3mg3ypqqNiXcC_yi-tpcbOaqA/viewform" 
          style='text-decoration:underline;' target="_blank">{{ $t("joinnow") }}</a>
        </div>
      </div>

      <div class="list">
        <h1 class="text Heavy">{{$t('joinunit')}}</h1>
        <p v-html="$t('joinunitDsc')">
        </p>
        <div class="apply">
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSem595jWpO5_A5fRj9W4-wX_3mg3ypqqNiXcC_yi-tpcbOaqA/viewform" 
          style='text-decoration:underline;' target="_blank">{{ $t("joinnow") }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleBanner from "@/components/TitleBanner/TitleBanner";
export default {
  name: "introduce",
  components: {
    TitleBanner,
  },
  computed:{
    getLanguage() {
      return this.$store.state.language
    },
    bannerName(){
        return this.$store.state.language==='en'?'banner_en':'banner'
    }
  }
};
</script>


<style lang="less" scoped>
@import './common.less';

@media screen and (min-width: 450px) {
  .apply {
    position: absolute;
    top: 46px;
    right: 47px;
    height: 28px;
    font-size: 20px;
    font-weight: 500;
  }
}

/* h5 */
@media screen and (max-width: 450px) {
 @import './h5introduce.less';
 
}
</style>