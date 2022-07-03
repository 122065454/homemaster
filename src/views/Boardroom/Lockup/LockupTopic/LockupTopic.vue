<template>
  <el-tooltip effect="dark" placement="bottom" popper-class="middle-topic">
    <img class="topic-pic" :src="topic" alt=''/>
    <div slot="content">
      <div v-if="type === '1'">
        <p class="mt-title">{{$t('ExtractExplain')}}</p>
        <p>APR：{{getApr()}}%</p>
        <p>APY：{{getApy()}}%</p>
      </div>
      <div v-if="type === '2' && Object.keys(kindIdList).length">
        <p>{{kindIdList[kindId]['listName']}}{{$t('GainsWeight')}} x{{lockInfo.weights[kindId]}}</p>
        <p>{{kindIdList[kindId]['listName']}} APR：{{getApr(lockInfo.weights[kindId])}}%</p>
        <p>{{kindIdList[kindId]['listName']}} APY：{{getApy(lockInfo.weights[kindId])}}%</p>
        <p>{{$t('LockApyRemark')}}</p>
      </div>
    </div>
  </el-tooltip>
</template>
<script>
export default {
  name: "LockupTopic",
  props: ["type", "kindId", "kindIdList", "lockInfo"],
  data() {
    return {
      // 气泡框图标
      topic: require('@/assets/tist.png'),
    }
  },
  computed: {},
  methods: {
    // 年利率
    getApr(multiple) {
      const ml = multiple ? +multiple : 1
      return (Number(this.lockInfo['pool_apy'])*ml).toFixed(2)
    },
    // 年复利
    getApy(multiple) {
      const ml = multiple ? +multiple : 1
      return Number(Math.pow(1 + this.lockInfo['pool_apy']*ml/365/100, 365)*100 - 100).toFixed(2)
    }
  },
}
</script>

<style lang="less">
.middle-topic {
  max-width: 200px;
  line-height: 20px;
  .mt-title {
    margin-bottom: 10px;
  }
}
</style>
