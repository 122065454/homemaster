<template>
  <section class="pc-section" :class="chainName">
    <div class="title between">
      <img @click="back" src="@/assets/history-back.png" class="selete-img poin" alt />
      <span>{{ $t("details") }}</span>
      <span></span>
    </div>

    <div class="details">
      <div class="start" v-for="(da, i) in oneChainHistory" :key="i">
        <div class="schedule">
          <p>
            <!-- 等待 await-iocn  处理 processed-icon 完成 notarize-icon-->
            <img v-show="da.blocks == 0" class="status-img" src="@/assets/await-icon.png" alt />
            <img
              v-show="da.blocks != 0 && da.blocks < da.need_blocks"
              class="status-img"
              src="@/assets/processed-icon.png"
              alt
            />
            <img
              v-show="da.blocks == da.need_blocks"
              class="status-img"
              src="@/assets/notarize-icon.png"
              alt
            />
          </p>
          <p>
            <img class="next-img" src="@/assets/next-icon.png" alt />
          </p>
        </div>
        <div class="det-status numbers">
          <p class="start">
            <show-img :name="da.chain_symbol" />
            <span class="det-name">{{ da.chain_symbol }}</span>
          </p>
          <div class="det-num">
            <p class="confirmed">{{ da.blocks }}/{{ da.need_blocks }} Confirmed</p>
            <div class="det-line start">
              <span :style="`width: ${(da.blocks / da.need_blocks) * 100}%`"></span>
            </div>
          </div>
          <!-- // globalCheckHashUrl   @click="showInfo(da)"-->
          <div class="det-check">
            <a
              v-show="da.hash.length"
              :href="url[da.chain_symbol] + da.hash"
              class="span"
              target="_blank"
            >
              <span>{{ $t("CheckTheHash") }}</span>
              <img src="@/assets/point-to-icon.png" alt />
            </a>
          </div>
          <div class="det-check2" v-if="i==oneChainHistory.length-1">
            {{$t('ReceivinAddress')}}:<br v-if="!isPC">{{address}}
          </div>
        </div>
      </div>
      <!-- notarizeBool -->
      <div class="det-notarize" v-show="oneChainHistory.length > 0">
        <img v-show="!notarizeBool" class="status-img" src="@/assets/processed-icon.png" alt />
        <img v-show="notarizeBool" class="status-img" src="@/assets/notarize-icon.png" alt />
        <span class="det-not-span">
          <span>{{ $t("finish1") }}</span>
        </span>
      </div>
    </div>
  </section>
</template>

<script>
import showImg from "@/views/CrossChain/components/showImg.vue";
export default {
  name: "chain-details",
  data() {
    return {
      notHistory: false,
      notarizeBool: false,
      url: {
        BSC: "https://bscscan.com/tx/0x",
        HECO: "https://hecoinfo.com/tx/0x",
        PolyNetwork: "https://explorer.poly.network/tx/",
        Ethereum: "https://etherscan.io/tx/0x",
      },
    };
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    address:{
      type:String,
      default:''
    }
  },
  components: {
    showImg,
  },
  mounted() { },

  computed: {
    oneChainHistory() {
      const list =
        this.list.length == 0
          ? this.$store.state.crossChain.oneChainHistory
          : this.list;
      if (list.length > 0) {
        this.notarizeBool =
          Number(list[list.length - 1].blocks) ==
          Number(list[list.length - 1].need_blocks);
      }
      return list;
    },
    booloneChainHistory() {
      return this.$store.state.crossChain.oneChainHistory;
    },
  },
  beforeDestroy() {
    this.$store.commit("crossChain/changeOneChainHistory", []);
  },
  methods: {
    back() {
      if (this.booloneChainHistory.length == 0) {
        this.$emit("back");
      } else {
        this.$emit("next-back");
      }
      this.$store.commit("crossChain/changeOneChainHistory", []);
    },
    showInfo(da) {
      this.$emit("on-show-info", da.hash);
    },
  },
};
</script>

<style scoped lang="less">
.poin {
  cursor: pointer;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

input {
  border: none;
  outline: none;
}

section {
  min-height: 550px;
  background-color: white;
}

.title {
  img:first-child {
    width: 26px;
    height: 26px;
  }
  img:last-child {
    width: 16px;
    height: 16px;
  }
  font-size: 16px;
  font-weight: 600;
  color: #171717;
}
//

.details {
  margin-top: 25px;
  .schedule {
    flex-shrink: 0;
    width: 25px;
    height: 100px;
  }

  .status-img {
    width: 16px;
    height: 16px;
  }
  .next-img {
    width: 17px;
    height: 80px;
  }
  .det-status {
    flex-grow: 1;
    height: 100px;
  }
  .det-name {
    margin-left: 10px;
  }
  .det-line {
    width: 100%;
    height: 7px;
    background: #e9edf3;
    border-radius: 7px;
    span {
      display: inline-block;
      height: 7px;
      border-radius: 7px;
      background: #03ad90;
    }
  }
  .det-num {
  }
  .confirmed {
    line-height: 25px;
    text-align: right;
    font-size: 12px;
    color: #10283f;
    margin-top: 0px;
  }
  
  .det-check, .det-check2{
    font-size: 12px;
    font-weight: 500;
    color: #03ad90;
    display: flex;
    align-items: center;
    cursor: pointer;
    a:link {
      color: #03ad90;
    }
    a:visited {
      color: #03ad90;
    }
    img {
      width: 14px;
      height: 14px;
    }
  }
  .det-check{
    margin-top: 10px;
  }
 
  .det-notarize {
    height: 30px;
    display: flex;
    align-items: center;
  }
  .det-not-span {
    margin-left: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #181f36;
  }
}
 .det-check2{
    margin-top: 6px;
  }
.Heco {
}
.Bsc {
}
.ETH {
}

@media screen and (max-width: 700px) {
   .det-check2{
    margin-top: 1px;
  }
}

@media screen and (min-width: 700px) {
  .pc-section {
    width: 415px;
    background-color: white;
    padding: 20px;
    margin-top: -100px;
    // min-height: 550px;
    // background: #ffffff;
    box-shadow: 0px 20px 30px 0px rgba(81, 85, 121, 0.03);
    border-radius: 10px;
  }
}
</style>