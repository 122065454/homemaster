<template>
  <section class="selete" :class="[chainName, getLanguage]">
    <div class="sele-head text">
      <div class="se-input">
        <!-- 进行中 -->
        <div class="switch-bar" v-show="['Liquidity', 'Reward'].includes(kind)">
          <el-switch v-model="switchStatus" active-color="#03AD90" inactive-color="#FF765B" v-show="chainName === 'Heco'"></el-switch>
          <el-switch v-model="switchStatus" active-color="#F3BC00" inactive-color="#FF765B" v-show="chainName === 'Bsc'"></el-switch>
          <el-tooltip effect="dark" placement="top" popper-class="middle-topic" :content="switchStatus ? $t('SelectTableOverTopic') : $t('SelectTableProcessingTopic')">
            <div class="topic-bar">
              <span>{{switchStatus ? $t("Processing") : $t("Over")}}</span>
              <img class="topic-pic" :src="topic" alt=''/>
            </div>
          </el-tooltip>  
        </div>
        <!-- 只看我参与 -->
        <div class="action" @click="chenck" v-if="showCheck">
          <img v-show="chainName=='Heco'&& actionChenck" src="~@/assets/Check.png" alt="" />
          <img v-show="chainName=='Bsc'&& actionChenck" src="~@/assets/Bsc-Check.png" alt="" />
          <img v-show="!actionChenck" src="~@/assets/unCheck.png" alt="" />
          <span>{{ $t("Pledged") }}</span>
        </div>
        <div class="sele-input">
          <input type="text" v-model="searchValue" :placeholder="inputText" />
          <img src="~@/assets/search-icon.png" alt="" />
        </div>
      </div>
      <ul class="sele-wenzi numbers" >
        <template v-if="kind != 'Reward' || !isMobile">
          <li v-for="(da, i) in list" class="sele-span item-span" :class="da.show ? 'sele-act-btn numbers SemiBold' : ''"
            @click="onlist(da, i)" :key="i">
            <span> {{ da.name }}</span>
          </li>
        </template>
        <li class="li-hide" v-if="isMobile">
          <div class="dig" @click="jumpHandle" v-if="kind == 'Liquidity'">
            <span class="text">{{$t("VoteDig")}}</span>
            <img :src="chainName=='Heco' ? hecoArrow : bscArrow" alt="" />
          </div>
        </li>
      </ul>
    </div>
    <!-- 二级切换 -->
    <div class="item-ul" v-if="listItem.length > 0">
      <ul class="sele-item numbers">
        <li v-for="(da, i) in listItem" class="se-item-name child-item" :class="da.show ? 'se-li-item-act numbers SemiBold' : ''"
          @click="onlistItem(da, i)" :key="i">
          <span>
            {{ da.name }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: "selete-table",
  data() {
    return {
      // 气泡框图标
      topic: require('@/assets/tist.png'),
      hecoArrow: require('@/assets/heco_right-arrow.svg'),
      bscArrow: require('@/assets/bsc_right-arrow.svg'),
      listAct: 0,
      listItemAct: 0,
      searchValue: "",
      listItem: [],
      actionChenck: false,
      autoTapIndex:0,
      autoTapChild:[],
      switchStatus: true,
    };
  },
  watch: {
    // 切换数据
    switchStatus (e) {
      this.$emit('switch-change-list', e)
    },
    searchValue(e) {
      this.$emit("change-input", e);
    },
    list(list){
      this.listItem = list[0].child || [];
    },
    chainName(){
      for(let val of this.list){
          val.show=false
          if(val.child){
              for(let v of val.child ){
                  v.show=false
              }
          }
          if(val.child&&val.child.length>0){
              val.child[0].show=true
          }
      }
      this.list[0].show=true
      this.listItem = this.list[0].child || [];
    }
  },
  props: {
    list: {
      type: Array,
      default: () => [
      ],
    },
    inputText: {
      type: String,
      default: "",
    },
    kind: {
      type: String,
      default: "",
    },
    showCheck: {
      type: Boolean,
      default: true,
    },
    autoTap: {
      type: Boolean,
      default: false,
    },
  },
  beforeMount() {
    if(this.kind == 'Reward') {
      this.listItem = []
    } else {
      this.listItem = this.list[0].child || []
    }
  },
  computed: {},
  methods: {
    // 重置表单
    resetTable() {
      this.searchValue = "";
      this.switchStatus = true
    },
    chenck() {
      this.actionChenck = !this.actionChenck;
      this.$emit("onchenck", this.actionChenck);
      if(this.autoTap){
          // autoTapIndex
          for(let num in  this.list){
            this.list[num].show = false;
          }
          if(this.actionChenck){
            this.list[0].show = true;
            this.$emit('change-list', { item:this.list[0], index: 0 });
            this.listItem =  [];
          }else{
            this.list[this.autoTapIndex].show = true;
            this.$emit('change-list', { item: this.list[this.autoTapIndex], index: this.autoTapIndex });
            this.listItem = this.autoTapChild;
          }
      }
    },
    setAct(name, act, i, item, onitem) {
      this[name][this[act]].show = false;
      for(let num in  this[name]){
          this[name][num].show = false;
      }
      this[name][i].show = true;
      this[act] = i;
      if(item==null) return
      this.$emit(onitem, { item, index: i });
    },
    onlist(item, i) {
      // this.setAct("list", "listAct", i, item, "change-list");
      //  autoTapIndex:0,
      // autoTapChild:[]
      if (this.kind == 'Reward') return 
      if(!this.isPC) this.hiddenHandle()

      for(let num in  this.list){
         this.list[num].show = false;
      }
      this.list[i].show = true;
      this.$emit('change-list', { item, index: i });
      this.listItem = item.child || [];
      this.autoTapChild=this.listItem
      this.autoTapIndex=i
    },
    onlistItem(item, i) {
      this.setAct("listItem", "listItemAct", i, item, "change-list-item");
      if(!this.isPC) this.hiddenHandle()
    },
    hiddenHandle() {
      this.$el.offsetParent.querySelectorAll('.topic_content').forEach((item) => {
        if(item.style.display==''){
          item.style.display = 'none'
        }
      })
    },
    jumpHandle() {
      window.open(this.getUrlList['VoteDig'])
    }
  },
};
</script>

<style scoped lang="less">
.selete {
  width: 100%;
  position: relative;
}
.sele-head {
  overflow-x: scroll;
  overflow-y: hidden;
  border-bottom: 1px solid #c5c8d4;
}
.item-ul {
  overflow-x: scroll;
  overflow-y: hidden;
}
.item-span {
  display: inline-block;
  color: #626e88;
  text-align: center;
  cursor: pointer;
}

input::input-placeholder {
  color: #a3b4d7;
}

input {
  border: none;
  outline: none;
}

.action {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7f8faf;
}

.child-item {
  display: inline-block;
  text-align: center;
}

.Heco {
  .sele-act-btn {
    border-bottom: 3px solid #02c09f;
  }
}
.Bsc {
  .sele-act-btn {
    border-bottom: 3px solid #ffca13;
  }
}
.ETH {
}
@media screen and (min-width: 540px) {
  .topic-bar {
    display: flex;
    align-items: center;
    img {
      width: 16px;
      height: 16px;
      margin-left: 5px;
    }
  }
  .switch-bar {
    display: flex;
    align-items: center;
    margin-right: 34px;
    & span {
      padding-left: 10px;
      color: #7f8faf;
      font-size: 18px;
    }
  }
  .sele-head {
    padding-right: 260px;
    display: flex;
    justify-content: space-between;
  }
  .sele-wenzi {
    display: flex;
    justify-content: flex-start;
    height: 79px;
  }

  .sele-span {
    font-size: 18px;
    // min-width: 80px;
    padding: 0 20px;
    line-height: 78px;
  }
  .sele-act-btn {
    color: #041843;
    font-size: 18px;
  }
  .se-input {
    height: 79px;
    display: flex;
    align-items: center;
    margin-right: 10px;
    position: absolute;
    right: 0px;
   // background-color: white;
  }
  .sele-input {
    position: relative;
    height: 37px;
    width: 253px;
    position: relative;
  }
  .sele-input img {
    position: absolute;
    right: 20px;
    top: 10px;
    width: 19px;
    height: 19px;
  }
  input {
    background: #f1f3f7;
    width: 253px;
    padding: 8px 50px 8px 12px;
    color: #000;
    border-radius: 19px;
    height: 37px;
    font-size: 16px;
  }
  input::-webkit-input-placeholder {
    color: #a3b4d7;
    font-size: 14px;
  }
  input::-moz-input-placeholder {
    color: #a3b4d7;
    font-size: 14px;
  }
  .sele-item {
    display: flex;
    justify-content: flex-start;
    padding: 15px 25px;
  }

  .se-item-name {
    min-width: 93px;
    height: 46px;
    line-height: 46px;
    color: #a3b4d7;
    cursor: pointer;
    border-radius: 4px;
    cursor: pointer;
  }

  .se-li-item-act {
    background-color: #f0f2f5;
    color: #041843;
    border-radius: 4px;
  }

  .action {
    margin-right: 10px;
    img {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
    span {
      font-size: 18px;
    }
  }
}
.sele-head::-webkit-scrollbar,
.item-ul::-webkit-scrollbar {
  display: none;
}
@media screen and (max-width: 540px) {
  .topic-bar {
    display: flex;
    align-items: center;
    img {
      width: 14px;
      height: 14px;
      margin-left: 3px;
    }
  }
  .switch-bar {
    display: flex;
    align-items: center;
    margin-right: 26px;
    & span {
      padding-left: 10px;
      color: #7f8faf;
      font-size: 12px;
    }
    /deep/ .el-switch__core {
      width: 29px !important;
      height: 16px !important;
    }
    /deep/ .el-switch__core:after {
      width: 14px !important;
      height: 14px !important;
      top: 50%;
      transform: translateY(-50%);
    }
    /deep/ .el-switch.is-checked .el-switch__core::after {
        left: 100%;
        margin-left: -15px;
    }
  }
  .Heco {
    .sele-act-btn {
      color: #48587b;
    }
    .dig {
      background: linear-gradient(322deg, #1673F3 0%, #06C4A3 100%);
      span {
        color: #fff;
      }
    }
  } 
  .Bsc {
    .sele-act-btn {
      color: #171717;
    }
    .dig {
      background: linear-gradient(329deg, #F39A16 0%, #FFCA13 100%);
      span {
        color: #000;
      }
    }
  }
  .ETH {
  }
  .li-hide {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    .dig {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 110px;
      border-radius: 16px;
      padding: 7px 12px;
      margin-right: 15px;
      span {
        font-size: 13px;
        font-weight: bold;
      }
      img {
        width: 16px;
        height: 16px;
      }
    }
  }
  .sele-wenzi {
    display: flex;
    justify-content: flex-start;
    position: relative;
    i {
      height: 43px;
    }
  }
  .sele-span {
    font-size: 12px;
    line-height: 43px;
    padding: 0 6px;
    flex-shrink: 0;
  }
  .sele-span span {
    display: inline-block;
    flex-shrink: 0;
    min-width: 25px;
  }
  .se-input {
    height: 43px;
    display: flex;
    align-items: center;
    padding-right: 10px;
    right: 0px;
    background-color: white;
    border-radius: 10px;
    margin-left: 13px;
  }
  .sele-input {
    position: relative;
    height: 24px;
    width: 85px;
  }

  .sele-input img {
    position: absolute;
    right: 15px;
    top: 4px;
    width: 13px;
    height: 13px;
  }

  input {
    width: 80px;
    /* padding: 0px 12px; */
    padding-left: 7px;
    padding-right: 20px;
    color: #000;
    height: 100%;
    border-radius: 19px;
    /* border: 1px solid #2c72f4; */
    background: #f1f3f7;
    padding-bottom: 3px;
    font-size: 13px;
  }
  input::-webkit-input-placeholder {
    color: #a3b4d7;
    font-size: 13px;
  }
  input::-moz-input-placeholder {
    color: #a3b4d7;
    font-size: 13px;
  }
  .sele-item {
    display: flex;
    justify-content: flex-start;
    padding: 15px 15px;
  }

  .se-item-name {
    height: 25px;
    line-height: 25px;
    color: #a3b4d7;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 2px;
    padding: 0 2px;
  }
  .se-item-name span {
    display: inline-block;
    min-width: 45px;
  }

  .se-li-item-act {
    background-color: #f0f2f5;
    color: #041843;
    border-radius: 4px;
  }
  .action {
    margin-right: 10px;
    img {
      width: 14px;
      height: 14px;
      margin-right: 1px;
      margin-right: 6px;
    }
    span {
      display: inline-block;
      min-width: 85px;
      font-size: 12px;
    }
  }
  .pt {
    .switch-bar {
      margin-right: 5px;
    }
    .action span {
      min-width: 75px;
    }
  }
  .vi, .pt, .tl {
    .sele-input img{
      right: 5px;
      top: 5px;
    }
  }
  .es, .it, .ina {
    .dig {
      width: 155px;
      span {
        font-size: 12px;
      }
    }
  }
  .fa {
    .dig {
      width: 130px;
    }
  }
}
</style>
