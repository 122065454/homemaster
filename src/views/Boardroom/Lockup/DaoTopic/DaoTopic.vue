<template>
  <el-tooltip effect="dark" placement="bottom" popper-class="dao-topic">
    <img class="dao-pic" :src="topic" alt=''/>
    <div slot="content">{{$t('DaoDescribe', {voucher: lockInfo.voucher, coin: lockInfo.name})}}</div>
  </el-tooltip>
</template>
<script>
export default {
  name: "DaoTopic",
  props: ["lockInfo"],
  data() {
    return {
      // 气泡框图标
      topic: require('@/assets/tist.png'),
    }
  },
  computed: {},
  methods: {},
}
</script>

<style lang="less">
.dao-topic {
  max-width: 200px;
  line-height: 20px;
}
.dao-pic {
  width: 12px;
  height: 12px;
  margin-left: 10px;
}
</style>
