<template>
  <div class="wrap text">
    <div class="title text Bold">
      {{ $t("DestroyHistory") }}
      <a :href="transferUrl(getDestoryAdr, 'address')" target="_blank" class="more">
        <span> {{ $t("seeMores") }}</span>
        <img :src="rightArrow" alt="" />
      </a>
    </div>
    <table class="table numbers" v-if="combustionData['destroy_list'].length > 0">
      <colgroup v-if="isPC">
        <col v-for="(item, i) in pcWidthList" :key="`pcWidthList${i}`" :width="item"/>
      </colgroup>
      <colgroup v-else>
        <col v-for="(item, i) in mobileWidthList" :key="`mobileWidthList${i}`" :width="item"/>
      </colgroup>
      <thead class="text Bold">
        <tr><th v-for="(item, i) in textList" :key="`textList${i}`">{{ $t(item) }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in combustionData['destroy_list']" :key="`combustionList${i}`">
          <td><a :href="transferUrl(item['hash'])" target="_blank">{{transferAddress(item['hash'])}}<img :src="direction" alt="" /></a></td>
          <td>{{transferTime(item['destroy_time']*1000)}}</td>
          <td>{{_numComma(item['destroy_amount'], 4)}}</td>
          <td>
            <button @click="() => jumpHandle(item['hash'])">Link</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="empty" v-else>
      <img :src="chainName === 'Heco' ? hecoNodata : bscNodata" />
      <p>{{ $t("empptyData") }}</p>
    </div>
  </div>
</template>
<script>
import { _formatDate, _substrAddress, _numComma } from '@/utils/comMethod'
import { _hashQueryAddress } from '@/utils/urlMethod'
import { destroyAdrList } from '@/utils/comStatic'
export default {
  name: "Combustion",
  data() {
    return {
      //暂无数据(Bsc)
      bscNodata: require('@/assets/Bsc-empty.png'),
      //暂无数据(Heco)
      hecoNodata: require('@/assets/empty.png'),
      // 右箭头
      rightArrow: require('@/assets/boardroom-more.png'),
      // PC端表单宽度
      pcWidthList: ['25%', '25%', '25%', '25%'],
      // 移动端表单宽度
      mobileWidthList: ['30%', '27%', '28%', '15%'],
      // 表头列表
      textList: ['jyhash', 'DestroyTime', 'DestroyNum'], 
      // 箭头图标
      direction: require('@/assets/direction.png')
    }
  },
  beforeCreate() {
    this.$store.dispatch("buyBack/getCombustionData")
  },
  computed: {
    // 燃烧销毁列表数据
    combustionData() {
      return this.$store.state.buyBack.combustionData;
    },
    // 销毁的合约地址
    getDestoryAdr() {
      return destroyAdrList[this.chainName]
    }
  },
  methods: {
    // 跳转
    jumpHandle (adr) {
      window.open(this.transferUrl(adr))
    },
    // 转义时间
    transferTime (time) {
      return _formatDate(time, this.isPC ? 7 : 3)
    },
    // 转义地址
    transferAddress (adr) {
      return _substrAddress(adr, this.isPC ? 6 : 4)
    },
    // 转义链接
    transferUrl (adr, kind) {
      return _hashQueryAddress(adr, this.chainName, this.getLanguage, kind)
    },
    _numComma
  }
}
</script>

<style lang="less" scoped>
@import "./Combustion.less";
</style>
