<template>
  <div class="model" v-if="isShow">
    <div class="modal-mask">
      <div class="content text">
        <div class="head_top">
          <P class="price">{{ $t("ClaimAirdrop") }}</P>
          <P class="num">{{ `${nums}` }} {{ coinName }}</P>
        </div>
        <div class="head_bottom">
          <div class="tag" :class="[getLanguage]">
            <div
              v-for="(item, index) in list"
              :key="index"
              @click="select(index)"
              :class="[
                '_tag ',
                check === index ? 'tag_select' : 'tag_noSelect',
              ]"
            >
              {{ $t(`${item}`) }}
            </div>
          </div>
          <p class="noteText">
            <img src="@/assets/star-icon.png" alt="" /> {{ $t("airdropNew") }}
          </p>
          <div class="serch_reward">
            <input
              type="text"
              v-model="msg"
              @input="input"
              :placeholder="$t('inputAdress')"
            />
          </div>
          <!-- <div
            :class="['button ', disabled ? 'disabled' : 'search']"
            @click="seach"
          >
            {{ $t(`${content}`) }}
          </div> -->
          <el-button
            :loading="isload"
            :class="[disabled ? 'disabled' : 'search']"
            @click="seach"
          >
            {{
              success
                ? $t(`${content}`)
                : $t("noun") + nums + `${coinName}` + $t("ClaimedSuccessfully")
            }}</el-button
          >
        </div>
        <div class="img" @click="cancle">
          <img src="@/assets/svg/Close.svg" alt="" />
        </div>
      </div>
    </div>
    <!-- 火箭 -->
    <airdrop ref="airdrop"></airdrop>
  </div>
</template>

<script>
import { isAddress } from "@/utils/publicErc20";
import airdrop from "./airdrop";
export default {
  components: {
    airdrop,
  },
  data() {
    return {
      coinName: "MDX",
      success: true,
      timeID: "",
      isload: false,
      content: "Check",
      msg: "",
      nums: "0",
      disabled: true,
      isShow: false,
      check: 0,
      list: ["airdropName"],
      pcgif: {
        pending: require("@/assets/airdrop/pc-pending.gif"),
        leave: require("@/assets/airdrop/pc-success.gif"),
      },
      h5gif: {
        pending: require("@/assets/airdrop/h5_pending.gif"),
        leave: require("@/assets/airdrop/h5_success.gif"),
      },
    };
  },
  computed: {
    isPC() {
      return this.$store.getters.isPC;
    },
    chainId() {
      return this.$store.state.chainId;
    },
  },
  methods: {
    init() {
      this.content = "Check";
      this.nums = "0";
      this.disabled = true;
      this.success = true;
    },
    seach(e) {
      if (!isAddress(this.msg)) {
        this.$overalltip({
          type: "error",
          msg: `${window.$v.$t("addrTip3")}`,
        });
        return;
      }
      let Base_Url = "https://airdrop.mdex.cc/airdrop/";
      // let Base_Url = "http://8.210.205.21:7001/airdrop/";
      this.getCheck(Base_Url);
      // if (["领取USDT", "Claim USDT",'領取USDT'].includes(e.target.innerText)) {
      //   // 领取奖励
      //   this.getClaim(Base_Url);
      // }
      if (this.$t("ClaimPrice") == e.target.innerText) {
        // 领取奖励
        this.getClaim(Base_Url);
      }
    },
    // 奖励查询
    async getCheck(Base_Url) {
      this.isload = true;
      let oRes = await this.axios.get(
        `${Base_Url}check?address=${this.msg.trim()}&&type=${
          this.check
        }&&mdex_chainid=${this.chainId}`
      );
      this.isload = false;
      let { code, message, result } = oRes.data;
      // 有奖励
      if (code === 0) {
        this.nums = result.quantity;
        this.content = "ClaimPrice";
      } else if (code === 1004) {
        // 已领取过奖励
        this.content = "AirdropClaimed";
        this.disabled = true;
      } else if (code === 1002) {
        // 无效地址
        this.$overalltip({
          type: "error",
          msg: `${window.$v.$t("NoAirdrop")}`,
        });
      } else {
        this.$overalltip({
          type: "error",
          msg: message,
        });
      }
    },
    // 奖励领取
    async getClaim(Base_Url) {
      this.isload = true;
      let res = await this.axios.get(
        `${Base_Url}claim?address=${this.msg.trim()}&&type=${
          this.check
        }&&mdex_chainid=${this.chainId}`
      );
      this.isload = false;
      this.$refs.airdrop.show(
        this.isPC ? this.pcgif.pending : this.h5gif.pending
      );
      // 领取成功
      if (res.data.code === 0 && res.data.result) {
        this.$refs.airdrop
          .show(this.isPC ? this.pcgif.leave : this.h5gif.leave, true, 4000)
          .then(() => {
            this.disabled = true;
            this.success = false;
          });
      } else if (res.data.code === 1004) {
        // 已经领取
        this.disabled = true;
        this.content = "AirdropClaimed";
      } else {
        this.$refs.airdrop
          .show(this.isPC ? this.pcgif.leave : this.h5gif.leave, true, 4000)
          .then(() => {
            this.disabled = true;
            this.content = "AirdropClaimed";
          });
      }
    },
    input() {
      this.disabled = this.msg === "" ? true : false;
      this.success = true;
      this.content = "Check";
    },
    select(index) {
      this.check = index;
    },
    show() {
      this.isShow = true;
    },
    cancle() {
      this.isShow = false;
    },
  },
  watch: {
    msg() {
      if (this.msg === "") {
        this.init();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.model {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: block;
  z-index: 8;
  .noteText {
    font-size: 12px;
    margin-top: 10px;
    img {
      width: 14px;
    }
  }
  .modal-mask {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .content {
    width: 334px;
    // height: 370px;
    height: 385px;
    background: #ffffff;
    border-radius: 11px;
    position: absolute;
    top: 47%;
    left: 50%;
    transform: translate(-50%, -50%);
    .head_top {
      background: url("../../assets/alertbgc.png") no-repeat;
      background-size: 100% 100%;
      height: 118px;
      padding: 16px 16px;
      .price,
      .num {
        color: #ffffff;
      }
      .price {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 5px;
      }
      .num {
        // font-size: 30px;
        font-weight: 600;
      }
    }
    .head_bottom {
      padding: 0 16px;
      margin-bottom: 39px;
    }
    .tag {
      margin-top: 11px;
      height: 41px;
      display: flex;
      ._tag {
        position: relative;
        padding: 8px 13px 8px 14px;
        margin-right: 10px;
        border-radius: 6px;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        border: 1px solid #ffca13;
        line-height: 25px;
      }
      .tag_select::before {
        content: "";
        position: absolute;
        top: -8px;
        right: -8px;
        width: 16px;
        height: 16px;
        background: url("../../assets/select_icon.png") no-repeat;
      }
    }

    .tag_noSelect {
      color: #b0b0b0;
      background: #f4f4f4;
      margin-right: 16px !important;
    }
    .serch_reward {
      margin-top: 10px;
      p {
        font-size: 12px;
        font-weight: 500;
        color: #171717;
        margin-bottom: 5px;
      }
      input {
        width: 100%;
        height: 50px;
        background: #f4f4f4;
        border-radius: 10px;
        border: none;
        font-size: 12px;
        font-weight: 500;
        color: #171717;
        line-height: 50px;
        outline: none;
        padding-left: 10px;
      }
    }
    .el-button {
      width: 100%;
      height: 50px;
      border-radius: 10px;
      margin-top: 20px;
      text-align: center;
      font-size: 18px;
      // line-height: 50px;
      border: none;
    }
    /deep/ .el-button {
      padding: 0;
    }
    .disabled {
      background: #d7d7d7 !important;
      pointer-events: none !important;
      color: #7d7d7d !important;
    }
    .search {
      background: #191919 !important;
      color: #ffca13 !important;
    }
  }
  .img {
    width: 35px;
    height: 35px;
    margin: auto;
    img {
      width: 100%;
    }
  }

  // pc
  @media screen and (min-width: 450px) {
    .content {
      width: 415px;
      height: 375px;
      top: 40%;
      .num {
        font-size: 30px;
      }
      .el-button {
        font-size: 18px;
        // line-height: 50px;
      }
      .en {
        ._tag {
          line-height: 14px;
        }
      }
    }
  }

  @media screen and (max-width: 450px) {
    .content {
      .num {
        font-size: 18px;
      }
      .el-button {
        font-size: 16px;
        // line-height: 50px;
      }
        .en {
      ._tag {
        line-height: 14px;
        font-size: 13px;
      }
    }
    }
  
  }
}
</style>
