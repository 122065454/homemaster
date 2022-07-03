<template>
 <div class="model" v-show="isShow">
  <img   :src="url" alt="">
  <!-- H5 -->
 </div>
</template>

<script>


export default {
 name:'airDrop',
 data(){
    return {
    url:null,
    timeid:null,
    isShow:false
    }
 },
 methods:{
    show(url,flag=false,timeout=2000){
        this.url=url
        this.isShow=true
        return new Promise(resolve=>{
          this.timeid=setTimeout(()=>{
          if(flag){
             this.close()
          }
          resolve()
        },timeout)
        })    
    },
    close(){
        clearTimeout(this.timeid)
        this.isShow=false
    }
 }
 
 
}
</script>



<style lang="less" scoped>
.model{
    z-index: 1;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.6);
  img{
   width: 100%;
   height: 100%;
 }
}
@media screen and (max-width: 450px) {
  .model {
    // width: 94%;
  }
}
</style>