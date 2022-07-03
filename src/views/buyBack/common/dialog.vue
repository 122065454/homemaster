<template>
  <div class="models" :class="getLanguage" v-show="show">
    <div class="modal-mask">
      <div class="content text">
        <div class="title" @click="show = false">
          <span class="text Heavy">{{$t('Note')}}</span>
          <img src="@/views/buyBack/img/close.png" alt="" />
        </div>
        <ul>
          <li>
             1.{{$t('onesm')}}
          </li>
          <li>
            2.{{$t('twosm')}}
          </li>
          <li>3.{{$t('threesm')}}</li>
          <!-- <li>
           4.{{$t('foursm')}}
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
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
    background-color: rgba(0, 0, 0, 0.3);
  }
  .content {
    position: absolute;
    top: 22%;
    left: 8%;
    width: 320px;
    height: 330px;
    border-radius: 24px;
    background: #ffffff;
    padding: 14px 16px;
    overflow:scroll;
    li {
      font-size: 12px;
   
      color: #000000;
      line-height: 20px;
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    margin-bottom: 13px;
    img {
      width: 12px;
      height: 12px;
    }
  }
}
</style>
