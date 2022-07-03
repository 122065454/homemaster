<template>
  <modal
    class="provider-modal"
    title="My Account"
    width="580px"
    acceptText="Change"
    :accept="signOut"
  >
    <div class="account-list">
      <ul class="harvest">
        <li v-for="item in $s.bnp.harvest" :key="item.id">
          <i class="icon"><img :src="item.ico" /></i>
          <span class="num">{{ item.num | balanceNum }}</span>
          <!-- <span class="help" @click="viewon()">View on Etherscan</span> -->
        </li>
      </ul>
      <div class="action">
        <span ref="copyBtn" data-clipboard-action="copy" :data-clipboard-text="$s.boardRoom.account" @click="copyAddress">{{
          copyTip || "Copy Address"
        }}</span>
        <span @click="viewon()">View on Scan</span>
      </div>
    </div>
  </modal>
</template>
<script>
import ClipboardJS from "clipboard";
export default {
  name: "modal-account",
  data() {
    return {
      copyTip: "",
    };
  },
  mounted() {
    this.$s.bnp.fetchAllTokenBalanceOf();
    this.copyBtn = new ClipboardJS(this.$refs.copyBtn);
  },
  methods: {
    viewon() {
      const account = this.$s.boardRoom.account;

      const url = `${$s.etherscanBaseUrl}/address/${account}#tokentxns`;
      window.open(url);
    },
    signOut() {
      this.$modal("wallet");
    },
    copyAddress() {
      this.copyBtn.on("success", (e) => {
        this.copyTip = "Copyed!!";
        setTimeout(() => {
          this.copyTip = "";
        }, 1000);
      });
      this.copyBtn.on("success", (e) => {
        this.copyTip = "Copyed!!";
        setTimeout(() => {
          this.copyTip = "";
        }, 1000);
      });
    },
  },
};
</script>
<style lang="less" scoped>
.account-list {
  margin: 0 auto;
  background: #fafafa;
  width: 90%;
  padding: 30px 5%;
  box-sizing: border-box;
  .action {
    font-size: 20px;
    text-align: center;
    color: #3b76fc;
    margin-top: 50px;
    span {
      display: inline-block;
      width: 50%;
      cursor: pointer;
      // margin: 50px 20px;
    }
  }
}
.harvest {
  .num {
    font-size: 38px;
  }
  .icon,
  .help {
    vertical-align: top;
  }
  .help {
    cursor: pointer;
  }
}
</style>