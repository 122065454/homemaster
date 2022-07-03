<template>
  <!-- 获奖弹框 -->
  <transition name='modelToggel'>
  <div class="models text" v-show="show" @click="show = false">
    <div class="modal-mask" :class="lang">
      <div class="content" >
        <img :src="imgUrl[nameNum]" alt="" />
        <p class="p" v-if="nameNum==1">{{$t('chaojuxin',{num:num})}}</p>
        <p class="p" v-if="nameNum==2">{{$t('henxin',{num:num})}}</p>
        

        <!-- <p class="h2" v-if="lang==='zn'">{{$t('wonthree.text',{num:num})}}</p> -->
        <button @click="show=false">{{$t('wontbtn')}}</button>
      </div>
    </div>
  </div>
   </transition>
</template>


<script>
// 1 超巨星 2.恒星
export default {
  data() {
    return {
      show: false,
      num: '',
      nameNum: '',
      imgUrl: {
        1: require("@/views/buyBack/img/juxin-pc.png"),
        2: require("@/views/buyBack/img/hx-pc.png"),
      },
    };
  },
  computed: {
    isPC() {
      return this.$store.getters.isPC;
    },  
     lang() {
      return this.$store.state.language === "en" ? "en" : "zn";
    },
    
  },

};
</script>
 <style lang="less" scoped>
.models {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: block;
  z-index: 88;
  .modal-mask {
    position: relative;
    width: 100%;
    height: 100%;
    background: #000000;
    opacity: 0.8;
  }
  .content {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    img {
      width: 400px;
      height: 400px;
    }
    .p {
      position: absolute;
      top: 73%;
      left: 9%;
      font-size: 30px;
      color: #ffda00;
    }
    .h2 {
      font-size: 16px;
      color: #ffffff;
      text-align: center;
    }
  }
  button {
    width: 206px;
    height: 50px;
    background: #ffda00;
    border-radius: 30px;
    font-size: 16px;
    color: #561900;
    margin: 20px 0 0 94px;
  }
}
.en{
  text-align: center;
  .content{
    display: flex;
    flex-direction: column;
  .p{
     width: 293px;
     left: 10%;
     text-align: center;
     font-size: 20px;
  }
  }
}
.modelToggel-enter-active {
  animation: modalToggle 0.3s;
}
.modelToggel-leave-active {
  animation: modalToggle 0.3s reverse;
}
@keyframes modalToggle {
  0% {
    transform: scale(1.1);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
// h5
@media screen and (max-width: 450px) {
  .models {
    .content {
     top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
      img {
        width: 360px;
        height: 360px;
      }
      .p {
        text-align: center;
        font-size: 24px;
        top: 66%;
        left: 50%;
        transform: translateX(-50%);
      }
      .h2 {
        width: 205px;
        margin: 0 auto;
        font-size: 16px;

        line-height: 30px;
      }
    }
    button {
      width: 206px;
      height: 50px;
      background: #ffda00;
      border-radius: 30px;
      font-size: 16px;
      color: #561900;
      margin-left: 73px;
    }
  }
  .en{
  .content{
  // .p{
  //   width: 248px;
  //   text-align: center;
  //   left: 4%
  // }
  button{
    margin-left: 80px;
  }
  }
 
}
}
</style>
