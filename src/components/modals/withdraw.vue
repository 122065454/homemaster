<template>
  <transition name="modal" :class="chainName">
    <div class="model" v-if="modelShow">
      <div class="model-wrap">
        <h3>{{ $t("Withdraw") }} {{ data.name }}</h3>
        <img
          class="close-icon"
          src="../../assets/close-icon.png"
          @click="hideModel"
        />
        <div class="input-wrap">
          <input type="text" v-model="value" />
          <div class="button-wrap">
            <button :disabled="!max" @click="setMax">MAX</button>
          </div>
        </div>
        <p>{{ max }} {{ data.name }} {{ $t("Available") }}</p>
        <div class="btn">
          <div class="cancel" @click="this.hideModel">{{ $t("Cancel") }}</div>
          <button
            class="confirm"
            @click="handelWithdrawl"
            :disabled="!Number(value) || Number(value) > Number(max)"
          >
            {{ $t("Confirm") }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapGetters } from "vuex";
let actionTip = null;
export default {
  name: "Withdraw",
  props: ["max", "pid", "data", "erc20Utils"],
  data() {
    return {
      modelShow: false,
      value: '',
    };
  },
  computed: {
    ...mapGetters(["isPC", "isMobile", "currentAddress"]),
  },
  mounted() {
    // if(this.data.earned_token == "ZT") {
    //   this.setMax()
    // }
  },
  methods: {
    showModel() {
      this.modelShow = true;
    },
    hideModel() {
      this.modelShow = false;
    },
    setMax() {
      this.value = this.max;
    },
    async handelWithdrawl() {
      this.hideModel();
      const withdrawlmsg = `Withdrawl ${this.value} ${this.data.name}`;
      const overalltip = this.$overalltip({
        type: "loading",
        msg: withdrawlmsg,
      });
      let { unStake } = this.erc20Utils;
      unStake(this.pid, this.value, this.account)
      .then((res) => {
        this.$emit("updateData");
        overalltip.close();
        const msg = `${withdrawlmsg} Success`;
        actionTip = this.$overalltip({
          type: "success",
          msg,
        });
      })
      .catch((err) => {
        overalltip.close();
        const msg = `${withdrawlmsg} Error`;
        actionTip = this.$overalltip({
          type: "error",
          msg,
        });
      })
      .finally(() => {
        this.value = 0;
      });
      // if(this.data.earned_token == "ZT") {
      //   let { emergencyWithdraw } = this.erc20Utils;
      //   emergencyWithdraw(this.pid, this.account).then((res) => {
      //     this.$emit("updateData");
      //     overalltip.close();
      //     const msg = `${withdrawlmsg} Success`;
      //     actionTip = this.$overalltip({
      //       type: "success",
      //       msg,
      //     });
      //   })
      //   .catch((err) => {
      //     overalltip.close();
      //     const msg = `${withdrawlmsg} Error`;
      //     actionTip = this.$overalltip({
      //       type: "error",
      //       msg,
      //     });
      //   })
      //   .finally(() => {
      //     this.value = 0;
      //   });
      // } else {
      //   let { unStake } = this.erc20Utils;
      //   unStake(this.pid, this.value, this.account)
      //   .then((res) => {
      //     this.$emit("updateData");
      //     overalltip.close();
      //     const msg = `${withdrawlmsg} Success`;
      //     actionTip = this.$overalltip({
      //       type: "success",
      //       msg,
      //     });
      //   })
      //   .catch((err) => {
      //     overalltip.close();
      //     const msg = `${withdrawlmsg} Error`;
      //     actionTip = this.$overalltip({
      //       type: "error",
      //       msg,
      //     });
      //   })
      //   .finally(() => {
      //     this.value = 0;
      //   });
      // }
    },
  },
  beforeDestroy() {
    if (actionTip) {
      actionTip.close();
    }
  },
};
</script>

<style lang="less" scoped>
.Heco {
  .confirm {
    background: #3870fc;
    color: #fff;
  }
  .button-wrap {
    button {
      background: #02c09f;
      color: #ffffff;
      box-shadow: 0px 10px 10px 0px rgba(1, 207, 170, 0.2);
    }
  }
}
.Bsc {
   .button-wrap {
    button {
    background: #2e2e2e;
    color: #ffca13;
    }
  }
  .confirm {
    background: #2e2e2e;
    color: #ffca13;
  }
}
.ETH {
}
// .Heco {
//   .confirm {
//     background: #3870fc;
//     color: #fff;
//   }
// }
// .Bsc {
//   .confirm {
//     background: #2e2e2e;
//     color: #ffca13;
//   }
// }
// .ETH {
// }

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.close-icon {
  position: absolute;
  width: 18px;
  height: 18px;
  padding: 14px;
  right: 0;
  top: 0;
  box-sizing: content-box;
  cursor: pointer;
}

@media screen and (min-width: 450px) {
  .model {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    transition: opacity 0.3s ease;
    z-index: 1;

    .model-wrap {
      width: 644px;
      background: #ffffff;
      border-radius: 10px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 43px 27px 31px;

      h3 {
        font-size: 28px;
        font-weight: 800;
        color: #041843;
        margin-bottom: 40px;
        text-align: center;
      }

      p {
        text-align: right;
        font-size: 20px;
        font-weight: 500;
        color: #808eb5;
        margin-top: 15px;
      }

      .input-wrap {
        width: 100%;
        height: 66px;
        background: #f0f2f5;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        position: relative;

        input {
          border: none;
          height: 66px;
          width: 60%;
          background: #f0f1f6;
          outline: none;

          font-size: 28px;
          color: #48587b;
        }

        .button-wrap {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          width: 77px;
          button {
            flex-shrink: 0;
            width: 77px;
            height: 37px;
            //background: #02c09f;
            border-radius: 6px;
            font-size: 24px;
            font-weight: 600;
          //  color: #ffffff;
            outline: none;
            border: none;
           // box-shadow: 0px 10px 10px 0px rgba(1, 207, 170, 0.2);
          }
        }
        .unit {
          position: absolute;
          right: 105px;
          font-size: 24px;
          color: #b7c3dc;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      .btn {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 34px;

        .cancel {
          width: 285px;
          height: 66px;
          background: #dde2eb;
          border-radius: 10px;
          font-size: 24px;
          font-weight: 600;
          color: #808eb5;
          cursor: pointer;
          text-align: center;
          line-height: 66px;
        }

        .confirm {
          width: 285px;
          height: 66px;
         // background: #3870fc;
          border-radius: 10px;
          font-size: 24px;
          font-weight: 600;
        //  color: #fff;
          cursor: pointer;
        }
      }
    }
    .close-icon {
      padding: 19px;
      width: 24px;
      height: 24px;
    }
  }
}

@media screen and (max-width: 450px) {
  .model {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;

    .model-wrap {
      width: 92%;
      background: #ffffff;
      border-radius: 10px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 40px 15px 15px;

      h3 {
        font-weight: 800;
        color: #041843;
        font-size: 20px;
        margin-bottom: 29px;
        text-align: center;
      }

      p {
        text-align: right;
        color: #808eb5;
        font-size: 14px;
        margin-top: 14px;
      }

      .input-wrap {
        width: 100%;
        height: 46px;
        background: #f0f2f5;
        border-radius: 4px;
        display: flex;
        justify-content: space-around;
        padding: 0 10px;
        padding-left: 0px;
        position: relative;

        input {
          border: none;
          height: 46px;
          width: 70%;
          background: #f0f1f6;
          outline: none;
          font-size: 28px;
          color: #48587b;
          flex-shrink: 1;
        }

        .button-wrap {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          width: 42px;
          span {
            height: 33px;
            font-size: 14px;
            font-weight: 800;
            color: #757575;
            line-height: 33px;
          }

          button {
            height: 26px;
            font-size: 14px;
            font-weight: 600;
           // color: #ffffff;
            line-height: 22px;
           // background: rgba(1, 207, 170, 1);
           // box-shadow: 0px 10px 10px 0px rgba(1, 207, 170, 0.2);
            border-radius: 6px;
          }
        }

        .unit {
          position: absolute;
          right: 60px;
          font-size: 14px;
          color: #b7c3dc;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      .btn {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 30px;

        .cancel {
          width: 150px;
          height: 36px;
          background: #dde2eb;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          color: #808eb5;
          box-shadow: 0px 10px 10px 0px rgba(128, 139, 159, 0.15);
          line-height: 36px;
          text-align: center;
        }

        .confirm {
          width: 150px;
          height: 36px;
        //  background: #3870fc;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
         // color: #fff;
          box-shadow: 0px 10px 10px 0px rgba(44, 114, 244, 0.2);
        }
      }
    }
  }
}

button:disabled {
  color: #808eb5 !important;
  box-shadow: 0 0 0 0 !important;
}
</style>
