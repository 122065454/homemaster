<template>
  <div class="select text">
    <div class="content" @click="toggle">
      <span v-if="lang=='zn'">第<b class="num numbers">{{ date }}</b>期</span>
       <span v-if="lang=='en'" class="nums numbers"> Round {{date}}</span>
      <span class="time numbers">{{ currentValue }}</span>
      <img
        src="@/views/buyBack/img/arrow.svg"
        alt=""
        :class="[isOptionsShow ? 'rotate' : 'rotate_out']"
      />
    </div>
    <transition name="v-options-animation">
      <div class="contain v-options numbers" v-show="isOptionsShow && dataList.length !== 0" >
      <ul>
        <li
          v-for="(item, index) in dataList"
          @click="checkdata(item, index)"
          :class="[index === i ? 'liclick' : '']"
        >
          <span v-if="lang=='zn'">第<b class="num">{{ item.phase }}</b>期</span>
          <span v-if="lang=='en'" class="nums numbers"> Round {{item.phase}}</span>
          <span class="time">{{startTime(item.start_time,item.end_time)}}</span>
        </li>
      </ul>
      </div>
  
    </transition>
  </div>
</template>

<script>
/**
 * @description:默认展示当前期
 * @param {type}
 * @return:
 */
import { formatDate } from "@/utils";
export default {
  name: "select",
  data() {
    return {
      isOptionsShow: false,
      i: sessionStorage.getItem("phaseNow")-1,
      date: sessionStorage.getItem("phaseNow"), // 当前期
      list: [],
      currentValue: "",
      dataList: []
    };
  },
  watch:{
   
  },
  created() {
   this.init()
  },
  computed: {
    lang() {
      return this.$store.state.language == "zh-CN" ? "zn" : "en";
    },
    getData() {
      return this.$store.state.buyBack.assetBuyData;
    },
     chainId() {
      return this.$store.getters.chainId;
    },
    //  当前期的时间
    dataNow() {
      const start = formatDate(this.$store.state.buyBack.assetBuyData.start_time*1000).ymd.split("-").join(".");
      const end = formatDate(this.$store.state.buyBack.assetBuyData.end_time*1000).ymd.split("-").join(".");
      return start + "-" + end;
    },
  },
  methods: {
    init(){
     this.$store.dispatch("buyBack/getDateNum").then((res) => {
      if (res.data.code === 0 && res.data.result) {
        this.dataList = res.data.result;
         console.log("sd", res,this.dataList );
      }
    });
   this.currentValue=this.dataNow
    },
    startTime(start_time, end_time) {
      const start = formatDate(start_time*1000).ymd.split("-").join(".");
      const end = formatDate(end_time*1000).ymd.split("-").join(".");
      return start + "-" + end;
    },
    toggle() {
      this.isOptionsShow = !this.isOptionsShow;
    },
    checkdata(item, index) {
      this.i = index;
      // VUEX 分发state
      this.$store.commit("buyBack/changePhase", Number(index+1));
      // this.$emit("changdate", index+1);
      // 事件公交 传值
      // this.bus.$emit('changephase',index+1)
      this.currentValue = this.startTime(item.start_time,item.end_time);
      this.date=index+1
    //   this.data = index;
      this.isOptionsShow = false;
    },
  },
  
  watch: {
    // i(val, old) {
        
    //   this.$emit("input", val);
    //   alert(val)
    // },
    // immediate: true
  },
};
</script>
<style lang="less" scoped>

.select {
  width: 214px;
  height: 36px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 0px rgba(9, 56, 149, 0.03);
  border-radius: 24px;
  display: flex;
  align-items: center;
  .content,
  li {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
      cursor:pointer;
    img {
      width: 16px;
      height: 16px;
    }
  
    span:first-child {
      font-size: 14px;
    }
    b {
      color: #3a8cef;
      margin-right: 2px;
      margin-left: 2px;
    }
    .time {
      font-size: 12px;
      color: rgba(60, 60, 67, 0.6);
    }
  }
  .contain{
    margin-top: 154px;
    width: 224px;
    height: 300px;
    background: #ffffff;
    box-shadow: 0px 0px 20px 0px rgba(9, 56, 149, 0.03);
    border-radius: 24px;
    padding-right: 5px;
  }
  ul {
    height: 100%;
    overflow-y: hidden;
    overflow-y: scroll;
    position: relative;
  }
ul::-webkit-scrollbar {
   width: 3px;
   height: 15px;
   
}
ul::-webkit-scrollbar-thumb {
// height: 16px;
border-radius: 10px;
box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
background:#03AD90
}
ul::-webkit-scrollbar-track {
// box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
 border-radius: 0;
//  height: 26px;
//  background: rgba(0,0,0,0.1);
// background:white;
 }
  .v-options {
    left: unset;
  }
  li {
    margin-bottom: 9px;
    padding-left: 10px;
  }
  
  .liclick::before {
    content: "";
    background: url("~@/views/buyBack/img/check-now.svg");
    width: 16px;
    height: 16px;
    position: absolute;
    left: 3px;
  }
}
// ul::-webkit-scrollbar {
//   display: none;
// }
.rotate {
  transform: rotate(-180deg);
  transition: all 0.3s;
}
.rotate_out {
  transform: rotate(0deg);
  transition: all 0.3s;
}
.v-options-animation-enter,
.v-options-animation-leave-to {
  transform: scaleY(0);
}

.v-options-animation-leave,
.v-options-animation-enter-to {
  transform: scaleY(1);
}

.v-options-animation-enter-active,
.v-options-animation-leave-active {
  transition: transform 0.1s;
}

  .nums{
    font-size: 12px !important;
    
  }


</style>