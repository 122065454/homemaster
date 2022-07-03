<template>
  <div class="pending" v-if="$s.txStatus.pending">

    <div class="pending-loading" v-if="!$s.txStatus.hash">
      <div class="loading"><div></div></div>
      <span>pending...</span>
    </div>
    <div v-else class="view">
      <div class="close" @click="$s.setTxStatus(false)"><img src="@/assets/modal-close.png" alt=""></div>
      <div class="text">{{$s.txStatus.text}}</div>
      <a :href="viewLink" target="_blank" @click="$s.setTxStatus(false)">View on Hecoscan</a>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    viewLink() {
      return $s.etherscanBaseUrl + '/tx/' + $s.txStatus.hash
    }
  }
}
</script>
<style lang="less" scoped>
@keyframes rotate {
    0% {
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }

    50% {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg)
    }

    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg)
    }
}
.pending {
  position: absolute;
  top: 110px;
  right: 50px;
  z-index: 20;
  font-size: 22px;
  background: #fff;
  box-shadow: 0px 2px 12px 6px rgba(0, 0, 0, 0.06);
  padding: 15px 55px 15px 15px;
  border-radius: 16px;
  line-height: 30px;
  max-width: 350px;
  .pending-loading {
    display: flex;
    > span {
      vertical-align: top;
      display: inline-block;
      line-height: 30px;
    }
    .loading {
      display: inline-block;
      margin-right: 5px;
      height: 30px;
      > div {
        border-radius: 100%;
        margin: 2px;
        border: 2px solid #ffd124;
        border-bottom-color: transparent;
        height: 26px;
        width: 26px;
        background: 0 0!important;
        display: inline-block;
        -webkit-animation: rotate .75s 0s linear infinite;
        animation: rotate .75s 0s linear infinite
      }
    }
  }
  .view {
    .close {
      position: absolute;
      top: 15px;
      right: 10px;
      img {
        width: 22px;
        height: 22px;
        vertical-align: middle;
      }
    }
    .text {
      font-size: 20px;
      word-break: break-all;
      color: #333;
    }
    a {
      display: block;
      color: #3B76FC;
      text-decoration: none;
      text-align: left;
    }
  }
}
</style>