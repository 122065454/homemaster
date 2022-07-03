<template>
  <modal class="provider-modal" title="Select a Wallet" :acceptText="select === connected ? 'Connected' : 'Connect'" :accept="connect" :acceptDisabled="select === connected">
    <div class="tips">Please select a wallet to connect to this dapp:</div>
    <div class="wallet-list">
      <div class="wallet-item" v-for="item in $s.wallets" :key="item.id" @click="select = item.disabled ? select : item.id" :class="{active: item.id === select, disabled: item.disabled, connected: connected == item.id}">
        <div class="logo"><img :src="item.ico"></div>
        <div class="name" v-if="item.id !== 'injected'">{{item.name}}</div>
        <div class="name" v-else-if="isInstallMetaMask">{{item.name}}</div>
        <div class="name" v-else><a :href="'https://metamask.io/?'+globalLanguage" target="_blank">Install Metamask</a> </div>
        <div class="help" v-if="connected == item.id">connected</div>
      </div>
    </div>
  </modal>
</template>
<script>
const isMobile = false
export default {
  name: 'modal-wallet',
  data() {
    return {
      select: 'injected',
    }
  },
  watch: {
    '$s.isLogin'(v) {
      if (v) {
        this.$modalClose()
      }
    }
  },
  computed: {
    isInstallMetaMask() {
      return window.ethereum || window.ethereum.isMetaMask
    },
    // isMobile,
    connected() {
      return this.$s.walletConnected
    }
  },
  methods: {
    async connect() {
      const t = this.select
      await this.$s.connect(t)

      this.$modalClose()
    }
  },
  mounted() {
    if (this.$s.walletConnected) {
      this.select = this.$s.walletConnected
    }
  }
}
</script>
<style lang="less" scoped>
.tips {
  color: #ccc;
  font-size: 20px;
  margin-bottom: 33px;
  text-align: center;
}
.wallet-list {
  padding: 0 35px;
}
.wallet-item {
  width: 25%;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  vertical-align: top;

  @media screen and (max-width: 730px) {
    width: 50%;
    margin-bottom: 30px;
  }
  &.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
   &.connected {
    // color: #ffc224;
    // .logo {
    //   img {
    //     border-color:  #ffc224;
    //   }
    // }
    .help {
      color: #F47C00;
    }
  }
  &.active {
    color: #F47C00;
    .logo {
      img {
        border-color: #F47C00;
      }
    }
  }
 
  .logo {
    padding: 22.5px;
    box-sizing: border-box;
    img {
      border: 3px solid #fff;
      border-radius: 50%;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
  }
  .name {
    font-size: 21px;
    font-weight: 600;
    a {
      text-decoration: underline;
    }
  }
}
</style>