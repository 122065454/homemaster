<template>
    <div class="main"  :class="[chainName, getLanguage]" v-if="show" >
       <div class="logo_tips"></div>
       <p class="text">{{$t('tipsWebsite')}}<a :href='link' target="_blank" class="text">{{$t('tipsWebsiteLink')}}</a></p>
       <img src="@/assets/tips/esc_icon.svg" alt="" class="esc" @click="close">
    </div>
</template>
<script>
export default {
    name:'tips',
    data(){
      return{
        show:true
      } 
    },
    computed:{
     link(){
      return  `https://mdex.blog/#/?lang=${this.getLanguage=='zh-CN'?'zh-CN':'en'}`
     }
    },
    methods:{
     close(){
       this.show=false
     }
    }
   
    
}
</script>

<style lang="less" scoped>
  .Heco{
       background: rgba(20,61,185,0.5);
       .logo_tips{
        background: url('~@/assets/tips/tips_heco.svg');
        background-size: 100%;
       }
       a{
        color: #59A4FF;
       }
  }
  .Bsc{
       background: rgba(184, 143, 0, 0.7);
        .logo_tips{
        background: url('~@/assets/tips/tips_bsc.svg');
        background-size: 100%;
       }
       a{
        color: #FFE177;
       }
  }
  .Eth{
       background: rgba(68, 35, 195, 0.7);
        .logo_tips{
        background: url('~@/assets/tips/tips_eth.svg');
        background-size: 100%;
       }
       a{
           color: #A7A1FF;
       }
  }
 .main{
     width: 100%;
     height: 40px;
     display: flex;
     align-items: center;
     justify-content: center;
 }
 a{
     font-size: 14px;
 }
 p{
    color: #fff;
    padding-right: 134px;
    font-size: 14px;
    
 }
 .logo_tips{
     width: 22px;
     height: 22px;
     margin-right: 10px;
 }
 .esc{
     width: 12px;
     height: 12px;
    
 }

 
</style>