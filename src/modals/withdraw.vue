<template>
  <modal class="withdraw-modal" :title="`Withdraw ${name}`" :acceptText="!loading ? 'Confirm' : 'Pending Confirmation'" cancelText="Cancel" :accept="onAccept" :acceptDisabled="loading">
    <div class="main">
      <div class="title">{{name}}</div>
      <div class="num"><input type="text" v-model="num" placeholder="0"></div>
      <div class="limit" @click="setMax">MAX</div>
    </div>
    <div class="tips">{{max.toLocaleString()}} {{name}} Available</div>
  </modal>
</template>
<script>
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance } from '@/utils/formatBalance'

export default {
  data() {
    return {
      num: '',
      loading: false,
    }
  },
  props: ['max', 'pid', 'name', 'accept'],
  async mounted() {
    // const tokenBalance = await this.$s.bnp.fetchTokenBalance(this.lpContract.options.address)
    // console.log('tokenBalance: ', tokenBalance)
    // this.max = getFullDisplayBalance(tokenBalance)
  },
  methods: {
    setMax() {
      this.num = this.max
    },
    async onAccept() {
      this.loading = true
      await this.accept({val: this.num || '0'}).finally(() => {
        this.loading = false
      })
      if (!this._isDestroyed) {
        this.$modalClose()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  background: #fafafa;
  margin-top: 20px;
  text-align: center;
  // width: 760px;
  width: 90%;
  margin: 20px 5%;
  .title  {
    font-size: 26px;
    color: #ccc;
    padding-top: 20px;
  }
  .num {
    margin-top: 22px;
    margin-bottom: 17px;
    color: #000;
    font-size: 48px;
    input {
      border: none;
      outline: none;
      background: none;
      text-align: center;
    }
  }
  .limit {
    color: #3B76FCFF;
    font-size: 24px;
    padding-bottom: 20px;
    cursor: pointer;
  }
}
.tips {
  margin-top: 15px;
  text-align: center;
}
</style>