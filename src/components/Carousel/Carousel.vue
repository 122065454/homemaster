<template>
  <div class="title-banner">
    <el-carousel :interval="5000" :arrow="isPC && cloneBannerData.length > 1? 'always' : 'never'" :indicator-position="isPC ? 'none' : ''" :autoplay="true" ref="carousel">
      <el-carousel-item v-for="(item, i) in cloneBannerData" :key="`Carouserl${i}`">
        <v-touch :swipe-options="{direction: 'horizontal'}" v-on:swipeleft="swiperleft(i)" v-on:swiperight="swiperright(i)" class="wrapper">
          <div class="pic" :style="{backgroundImage: `url(${item[imgKey]['image_url']})`}" @click="() => jumpHandle(item[imgKey])"></div>
        </v-touch>
      </el-carousel-item>
    </el-carousel>
  </div>  
</template>

<script>
import { _getImgKey } from '@/utils/comMethod'
export default {
  name: "Carouserl",
  computed: {
    // banner列表原始数据
    bannerData() {
      return this.$store.state.bannerData
    },
    // banner列表展示数据
    cloneBannerData() {
      return this.$store.state.cloneBannerData
    },
    // 获取图片key
    imgKey () {
      return _getImgKey(this.isPC, this.getLanguage)
    },
  },
  watch: {
    getLanguage() {
      this.updataBannerDataHandle()
    }
  },
  methods: {
    // 点击跳转
    jumpHandle(item) {
      if (item.link_type == '1') this.$router.push(item['link_url'])
      if (item.link_type == '2') window.open(item['link_url'])
    },
     //设置滑动切换轮播图
    swiperleft: function (index) {
      //下一页
      this.$refs.carousel.next();
      this.$refs.carousel.setActiveItem(index + 1);
    },
    swiperright: function (index) {
      //上一页
      this.$refs.carousel.prev();
      //设置幻灯片的索引
      this.$refs.carousel.setActiveItem(index - 1);
    },
    // 过滤banner数据
    updataBannerDataHandle() {
      if (this.bannerData) {
        const filterData = this.bannerData.filter((item) => {
          return !!item[this.imgKey]['image_url'] 
        })
        this.$store.commit("saveCloneBannerData", filterData)
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "./Carousel.less";
</style>
