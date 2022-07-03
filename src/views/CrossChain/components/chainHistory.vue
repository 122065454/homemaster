<template>
  <section class="pc-section" :class="chainName">
    <div class="title between">
      <img @click="$emit('back')" src="@/assets/history-back.png" class="selete-img poin" alt="">
    
      <span>{{$t('AcrossChainRecord')}}</span>
      <span></span>
    </div>
    <div class="not-history" v-show="getChainHistory.transactions.length==0">
      <div>
        <img src="@/assets/history-chain.png" class="selete-img" alt="">
        <p>{{$t('NoRecord')}}</p>
      </div>
    </div>

    <div class="historyContainer">
      <!-- transactions -->
      <div class="items" v-for="(da,i) in getChainHistory.transactions" :key="i">
        <div class="between line-li" @click="goDetails(da)">
          <div class="between line-info numbers Medium">
            <div class="title-info start">
              <p class="index-info">{{i+1}} </p>
              <show-img :name="da.src_chain_symbol" />
              <span>{{da.src_chain_symbol}}</span>
            </div>
            <img src="@/assets/point.png" class="point-img" alt="">
            <p class="start">
              <show-img :name="da.dst_chain_symbol" />
              <span>{{da.dst_chain_symbol}}</span>
            </p>
          </div>
          <!--   完成 line-finish  处理中 line-await 跨链资产 资产数量  手续费-->
          <span v-if="da.state==0" class="line-status line-finish text Bold">{{$t('finish')}} > </span>
          <span v-else class="line-status line-await text Bold">{{$t('BeingProcessed')}} > </span>
         
        </div>
        <p class="line-time numbers">{{ formatData(da.create_time)}}</p>
        <div class="between">
          <div class="line-msg">
            <p>{{$t('AcrossTheChainAssets')}}</p>
            <p class="numbers"> {{da.src_chain_symbol=="BSC" && da.cross_token.symbol=='MDX' ?'HMDX':da.cross_token.symbol}}</p>
          </div>
          <div class="line-msg">
            <p>{{$t('NumberOfAssets')}}</p>
            <p class="numbers">{{Number(da.cross_amount)+Number(da.cross_fee)}}</p>
          </div>
          <div class="line-msg">
            <p>{{$t('ServiceCharge')}}</p>
            <p class="numbers">{{da.cross_fee}}</p>
          </div>
        </div>
      </div>
      <!--  -->
      <!--  -->
    </div>

  </section>
</template>

<script>
// import seleteAssets from "@/views/CrossChain/components/seleteAssets.vue";
import { formatDate } from "@/utils";
import showImg from "@/views/CrossChain/components/showImg.vue";
export default {
  name: "chain-history",
  data() {
    return {
      notHistory: false,
    };
  },
   components: {
    showImg
  },
  beforeCreate() {
  },
  mounted() {},
  computed: {
    getChainHistory() {
      console.log(this.$store.state.crossChain.chainHistory,'ss');
      return this.$store.state.crossChain.chainHistory;
    },
  },
  methods: {
    formatData(time) {
      return formatDate(time * 1000, "-").ymdhms;
    },
    goDetails(item) {
      this.$emit("on-details", item);
    },
  },
};
</script>

<style scoped lang="less">
.historyContainer{
  max-height: 550px;
  overflow-y: scroll;
  padding: 10px
}
 .historyContainer::-webkit-scrollbar {
   width: 3px;
   
}
.historyContainer::-webkit-scrollbar-thumb {
border-radius: 10px;
box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
background:#03AD90
}
.historyContainer::-webkit-scrollbar-track {
box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
 border-radius: 0;
//  background: rgba(0,0,0,0.1);
// background:white;
 }


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
.not-history {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
  width: 100%;
  img {
    height: 61px;
    width: 67px;
  }
  font-size: 12px;
  font-weight: 500;
  color: #7f8faf;
}

.items {
  margin-top: 15px;
  height: 120px;
  border-bottom: 1px solid #F7F7FB;
  .line-time {
    height: 35px;
    line-height: 35px;
    font-size: 12px;
    font-weight: 500;
    color: #7f8faf;
  }

  .line-li {
    cursor: pointer;
    margin-top: 5px;
    font-size: 16px;
    font-weight: bold;
    color: #181f36;
    .line-info {
      width: 67%;
      .title-info{
        display: flex;
        align-items: center;
      }
      .index-info{
        width: 18px;
        height: 18px;
        line-height: 18px;
        background: #03AD90;
        border-radius: 2px;
        text-align: center;
        color: white;
        font-size: 12px;
      }
    }
    .point-img {
      width: 26px;
      height: 26px;
    }
    .bet-icon {
      width: 20px;
      height: 20px;
      margin:0 3px;
    }
  }
  .line-msg {
    font-size: 12px;
    font-weight: 500;
    p {
      height: 25px;
    }
    p:first-child {
      color: #7f8faf;
    }
    p:last-child {
      color: #10283f;
    }
  }
  .line-status {
    font-size: 12px;
    font-weight: 500;
    line-height: 17px;
  }
  .line-finish {
    // color: #e02020;
    color: #03AD90;
  }
  .line-await {
    color: #e02020;
  }
}
//     min-height: 535px;

.Heco {
}
.Bsc {
}
.ETH {
}

@media screen and (max-width: 700px) {
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