<template>
  <div class="card" v-on="$listeners || {}" >
    <div class="card-inner">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'card'
}
</script>
<style lang="less" scoped>
.card {
  background: #fff;
  box-shadow: 0px 2px 12px 6px rgba(0, 0, 0, 0.06);

  &-inner {
    padding: 20px;
    position: relative;
    box-sizing: border-box;
    // height: calc(100% - 50px);
    // width: calc(100% - 50px);
  }
}
</style>