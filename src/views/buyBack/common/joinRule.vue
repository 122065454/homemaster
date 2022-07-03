<template>
  <div class="wrap text" :class="[lang,getLanguage]">
    <!--上面背景图部分 -->
    <div class="top">
      <div class="w">
        <div class="btn" @click="$router.push('/pastrecord')">
        {{$t('Viewall')}}
        </div>
        <h3 class="h3 text Heavy"> {{ $t("WinningRules") }}  <i @click="$refs.dialog.show = true"></i></h3>

        <p class="p">
            {{ $t("deteil") }}<a v-if="lang!=='en'" 
            href="https://mdexdoc.gitbook.io/doc/v/chinese/yong-hu-zhi-nan/hui-gou-xiao-hui/can-xuan-hao-ma-chan-sheng-gui-ze" target="_blank" style="color:red">{{$t("deteilend")}}</a><a v-if="lang=='en'" href="https://mdexdoc.gitbook.io/doc/yong-hu-zhi-nan/hui-gou-xiao-hui/can-xuan-hao-ma-chan-sheng-gui-ze" target="_blank" style="color:red">{{$t("deteilend")}}</a>

        </p>
        <!--卡片 -->
        <div class="card">
          <div class="frist">
            <div class="img" v-if="isPC">
              <img src="@/views/buyBack/img/footer-jx.png" alt="" />
            </div>
            <p class="price text Heavy" v-if="isPC">{{ $t("JupiterAward") }}</p>
            <!-- h5 -->
            <div class="img" v-if="!isPC">
              <img src="@/views/buyBack/img/footer-jx.png" alt="" />
              <p class="price text Heavy">{{ $t("JupiterAward") }}</p>
            </div>
            <h4>
              {{ $t("contribution") }}
            </h4>
            <div class="card-bottom">
              <img src="@/views/buyBack/img/gift-pc.png" alt="" />
              <div class="gift-right">
                <p>{{ $t("Share10") }}</p>
                <p class="text Heavy">{{ $t("Share101") }}</p>
              </div>
            </div>
          </div>
          <div class="frist">
            <div class="img" v-if="isPC">
              <img src="@/views/buyBack/img/footer-hx.png" alt="" />
            </div>
            <p class="price text Heavy" v-if="isPC">{{ $t("SatumAward") }}</p>
            <!-- h5 -->
            <div class="img" v-if="!isPC">
              <img src="@/views/buyBack/img/footer-hx.png" alt="" />
              <p class="price text Heavy">{{ $t("SatumAward") }}</p>
            </div>

            <h4>
               {{ $t("contribution2") }}
            </h4>
            <div class="card-bottom">
              <img src="@/views/buyBack/img/gift-pc.png" alt="" />
              <div class="gift-right">
                <p>{{$t("Share1000") }}</p>
                <p class="text Heavy">{{ $t("Share1001") }}</p>
              </div>
            </div>
          </div>
          <div class="frist">
            <div class="img" v-if="isPC">
              <img src="@/views/buyBack/img/footer-pt.png" alt="" />
            </div>
            <p class="price text Heavy" v-if="isPC">{{ $t("PlutoAward") }}</p>
            <!-- h5 -->
            <div class="img" v-if="!isPC">
              <img src="@/views/buyBack/img/footer-pt.png" alt="" />
              <p class="price text Heavy">{{ $t("PlutoAward") }}</p>
            </div>
             <div>
                 <h4>{{ $t("contribution3") }}</h4>
            <div class="card-bottom">
              <img src="@/views/buyBack/img/gift-pc.png" alt="" />
              <div class="gift-right">
                <p>{{ $t("Share2000") }}</p>
                <p class="text Heavy">{{ $t("Share2001") }}</p>
              </div>
            </div>
             </div>
          
          </div>
        </div>
        <!-- 说明 -->
        <footer v-if="isPC">
          <footerDetail></footerDetail>
        </footer>
      </div>
    </div>
    <!-- 弹框提示 -->
    <dialogs ref="dialog"></dialogs>
  </div>
</template>

<script>
import dialogs from "./dialog.vue";
import footerDetail from './joinRuleDetail'
export default {
  name: "joinrule",
  components: { dialogs,footerDetail },
  data(){
    return{

    }
  },
  computed: {
    isPC() {
      return this.$store.getters.isPC;
    },
    lang() {
      return this.$store.state.language === "en" ? "en" : "zn";
    },
    // 当前状态
    currrentName() {
      return this.$store.state.buyBack.states;
    },
    phase(){
      return  this.$store.state.buyBack.phase;
    }
    
  },
  watch:{
   currrentName(){
    this.isFrist()
   }
  },
  mounted(){
   this.isFrist()
  },
  methods:{
    // 如果是第一期还未开始就不显示
    isFrist(){  
      if(this.phase==1&&this.currrentName=='start'){
        
        document.querySelector('.top .btn').style.visibility='hidden'
      }else {
        if(this.phase==1){
        document.querySelector('.top .btn').style.visibility='visible'
        }
      }
        
      
    }
  }
};
</script>
 <style lang="less" scoped>
// 弹性居中
.flex() {
  display: flex;
  align-items: center;
  justify-content: center;
}
//  设高宽
.w(@width,@height) {
  width: @width;
  height: @height;
}

.Bsc {
  .top {
    background: url("~@/views/buyBack/img/bsc/bsc-bg-pc.png") no-repeat;
    background-size: cover;
    .btn {
      background: #080808;
      color: #ffc900;
    }
    .frist:hover {
      p {
        color: #e78900;
      }
    }
  }
}

// pc
@media screen and (min-width: 450px) {
  .wrap {
    height: 1432px;
    margin-top: 80px;
    //  background-size: 100%;
    // background-position: center;
    // background: url("~@/views/buyBack/img/bottom-bg.png") no-repeat
  }

  .top {
    width: 100%;
    height: 971px;
    // background-size: 100%;
    background-position: center;
    background: url("~@/views/buyBack/img/bottom-bg.png") no-repeat;
    background-size: cover;
    .w {
      width: 1200px;
      margin: 0 auto;
    }
    .btn {
      width: 309px;
      height: 60px;
      background: #009a7f;
        cursor:pointer;
      border-radius: 30px;
      font-size: 16px;
     
      color: #ffffff;
      text-align: center;
      line-height: 60px;
      margin: 0 auto;
      // visibility: hidden;
    }
    .h3 {
      font-size: 30px;
      
      color: #ffffff;
      text-align: center;
      margin-top: 204px;
    }
    .p {
      font-size: 16px;
     
      color: #ffffff;
      margin-top: 50px;
      line-height: 30px;
    }
    .card {
      margin-top: 100px;
      display: flex;
      justify-content: space-between;
    }
    .frist {
      width: 370px;
      border-radius: 24px;
      padding: 37px 32px 40px 32px;
      background-color: #fff;
      transition: all 0.3s;
      .img {
        text-align: center;
      }
      img {
        width: 263px;
        height: 263px;
      }
      h4 {
        font-size: 12px;
      
        color: #000000;
        line-height: 20px;
        margin-top: 30px;
      }
      .card-bottom {
        margin-top: 55px;
        display: flex;
        align-items: center;
        img {
          width: 50px;
          height: 50px;
        }
        .gift-right {
          margin-left: 20px;
          p:first-child {
            font-size: 14px;
          
            line-height: 20px;
          }
          p:last-child {
            font-size: 18px;
         
            line-height: 25px;
          }
        }
      }
    }
    .frist:hover {
      transform: translateY(-50px);
      .img {
        img {
          width: 214px;
          height: 214px;
        }
      }
      p {
        color: #006ced;
      }
      .price {
        font-size: 36px;
      }
    }
  }
  footer {
    margin-top: 50px;
    color: #000000;
    line-height: 28px;
    overflow: hidden;
    h1 {
      font-size: 14px;
    }
    li {
      font-size: 14px;
    }
  }
  .frist:last-child{
      h4{
        margin-bottom: 50px;
      }
    }
  .en{
    height: 1542px;
    .frist:last-child{
      h4{
        margin-bottom: 70px;
      }
    }
    footer{
       line-height: 31px;
    }
  }
  .ru{
    height: 1600px;
  }

}
// h5rgb(65, 65, 65)
@media screen and (max-width: 450px) {
  .Bsc {
  .top {
    background: url("~@/views/buyBack/img/bsc/bsc-bg-h5.png") no-repeat;
   
  
  }
}
  .wrap {
    height: 412px;
    margin-bottom: 100px;
    // margin-bottom: 150px;

  }
  .ru{
     margin-bottom: 300px;
  }

  .top {
    width: 100%;
    height: 412px;
    background-size: 100%;
    background-position: center;
    background: url("~@/views/buyBack/img/bottom-bg-h5.png") no-repeat;
    .btn {
      width: 266px;
      height: 50px;
      font-size: 14px;
      line-height: 50px;
      transform: translateY(-110px);
      background: #009a7f;
    
      border-radius: 30px;
      color: #ffffff;
      text-align: center;
      margin: 0 auto;
    }
    .h3 {
      font-size: 20px;
      margin-top: -10px;
      color: #ffffff;
      text-align: center;
    }
    i {
      background: url("~@/views/buyBack/img/qustion2.svg");
      width: 14px;
      height: 14px;
      display: inline-block;
    }
    .p {
      font-size: 12px;
      line-height: 22px;
      margin: 20px 16px 0px;
      color: #ffffff;
    }
    .card {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      overflow-x: hidden;
      overflow: scroll;
      //   flex-grow:0;
      //  flex-shrink:0
    }
    .card::-webkit-scrollbar {
      display: none;
    }
    .frist {
      width: 240px;
      border-radius: 24px;
      padding: 8px 14px 20px;
      background-color: #fff;
      margin-left: 19px;
      flex-grow: 0;
      flex-shrink: 0;
      .img {
        .flex();
      }
      .price {
        font-size: 20px;
      }
      img {
        width: 100px;
        height: 100px;
      }
      h4 {
        font-size: 12px;
        color: #000000;
        line-height: 20px;
        margin-top: 5px;
        margin-bottom: 21px;
      }
      .card-bottom {
        
        display: flex;
        align-items: center;
        img {
          width: 30px;
          height: 30px;
        }
        .gift-right {
          margin-left: 10px;
          p {
            // white-space: nowrap;
          }
          p:first-child {
            font-size: 12px;
            line-height: 17px;
          }
          p:last-child {
            font-size: 15px;
            line-height: 22px;
            color: #000000;
          }
        }
      }
    }
    .frist:last-child{
      h4{
        margin-bottom: 33px;
      }
    }
  }
    .en{
   
    // height: 412px;
    // margin-bottom: 50px;
    margin-bottom: 200px;
       .frist:last-child{
      h4{
        margin-bottom: 57px;
      }
    }

  
  }
}
</style>