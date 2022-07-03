<template>
  <div class="mian">
     <img src="@/assets/imo/imo-cn.jpg" alt=""  v-if="$store.state.language!=='en'">
     <img src="@/assets/imo/imo_en.jpg" alt=""  v-else>
  </div>

</template>
 <script>
   export default {
       name:'imo',
       computed:{
          isImo(){
           return  this.$store.state.language=='en'?' Bsc-home-en':'Bsc-home-zh-CN'
       },
       }
       
       
   }
 </script>
 
<style lang="less" scoped>
 .mian{
    //  width: 100%;
    //  min-height: 100%;
    //  background: url('/assets/imo/imo.jpg');
    //  background-size: 100%;
     img{
         width: 100%;
       
     }
 }
</style>