<template>
    <div class="addbg" :class="chainName">
    <div class="home-using text">
      <div class="container">
        <div class="home-using__title text Bold">{{ $t("MDXUsageScenarios") }}</div>
        <div class="home-using__content">
          <div class="home-using__item">
            <div class="home-using__item-icon icon-1"></div>
            <div class="home-using__item-title">{{ $t("Repurchase") }}</div>
            <div class="home-using__item-describe">
              {{ $t("RepurchaseDesc") }}
            </div>
          </div>
          <div class="home-using__item">
            <div class="home-using__item-icon icon-2"></div>
            <div class="home-using__item-title">{{ $t("airdrop") }}</div>
            <div class="home-using__item-describe">{{ $t("HT") }}</div>
          </div>
          <div class="home-using__item">
            <div class="home-using__item-icon icon-3"></div>
            <div class="home-using__item-title">Dao</div>
            <div class="home-using__item-describe">{{ $t("DaoDesc") }}</div>
          </div>
        </div>
      </div>
    </div>
     <!-- -->
    
    <div class="home-mechanism home-mechanism-h5 text">
      <div class="container">
        <div class="home-mechanism__title text Bold">{{ $t("MDXCheck") }}</div>
        <div class="home-mechanism__content">
          <div class="home-mechanism__item">
            <a :href="fairyproof" target="_blank">
              <img class="home-mechanism__item-logo" :src="require('@/assets/new1.png')" />
            </a>
          </div>
          <div class="home-mechanism__item">
            <a :href="certik" target="_blank">
              <img class="home-mechanism__item-logo" :src="require('@/assets/new2.png')" />
            </a>
          </div>
          <div class="home-mechanism__item">
            <a :href="slowmist" target="_blank">
              <img class="home-mechanism__item-logo" :src="require('@/assets/new3.png')" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="home-mechanism text">
      <div class="container">
        <div class="home-mechanism__title text Bold">{{ $t("CooperativePartner") }}</div>
        <div class="home-mechanism__content">
          <div class="home__item_list_new">
            <a :href="coinmarketcap" target="_blank">
            <img class="home-mechanism__item-logo" :src="require('@/assets/new4.png')" />
            </a>
          </div>
           <div class="home__item_list_new" v-for="(item,index) in imgUrl" :key='index'>
            <img class="home-mechanism__item-logo" :src="item" />
          </div>
          <!--safepal添加链接 -->
          <div class="home__item_list_new">
            <a href="https://safepal.io/" target="_blank">
            <img class="home-mechanism__item-logo" :src="require('@/assets/new19.png')" />
            </a>
          </div>
          <div class="home__item_list_new">
            <img class="home-mechanism__item-logo" :src="require('@/assets/new8.png')" />
          </div>
          <div class="home__item_list_new">
            <a :href="getUrlList['OpenMeta']" target="_blank">
              <img class="home-mechanism__item-logo" :src="require('@/assets/new21.png')" />
            </a>
          </div>
        </div>
      </div>
      <!--  --> 
    </div>
    <!-- 赏金计划 -->
    <div class="wrap ">
       <div class="sjplan text">
       <h1>{{$t('OpenMetaDec')}}</h1>
       <button class="text" @click="jumpHandle">{{$t('seedetails')}}</button>
    </div>
    </div>
   
    </div>
</template>

<script>
export default {
  data() {
      return {
        imgUrl:
          [require('@/assets/new5.png'),
          require('@/assets/new6.png'),
          require('@/assets/new7.png'),
          require('@/assets/new20.png'),
          require('@/assets/new9.png'),
          require('@/assets/new10.png'),
          require('@/assets/new11.png'),
          require('@/assets/new12.png'),
          require('@/assets/new13.png'),
          require('@/assets/new14.png'),
          require('@/assets/new15.png'),
          require('@/assets/new16.png'),
          require('@/assets/new17.png'),
          require('@/assets/new18.png'),
        ],
        hostname: window.location.hostname.replace('www.', '')
      }
  },
  computed: {
    coinmarketcap(){
     return   this.$store.state.language == "en"? "https://coinmarketcap.com/exchanges/mdex/": "https://coinmarketcap.com/zh/exchanges/mdex/";   
    },
    certik(){
          const name=this.chainName=='Bsc'?"certik_bsc":"certik"
          return `https://${this.hostname}/${name}.pdf`
    },
    fairyproof(){
          const name=this.chainName=='Bsc'?"fairyproof_bsc":"fairyproof"
          return `https://${this.hostname}/${name}.pdf`
    },
    slowmist(){
          const name=this.chainName=='Bsc'?"slowmist_bsc":"slowmist"
          return `https://${this.hostname}/${name}.pdf`
    },
    chainId() {
      return this.$store.getters.chainId;
    },
  },
  methods: {
    jumpHandle() {
      window.open(this.getUrlList['OpenMeta'])
    }
  }
}
</script>

<style lang="less" scoped>
@import './common.less';
// h5
@media screen and (max-width: 450px) {
@import './h5sponsor.less';
}


// pc
@media screen and (min-width: 450px){
  .wrap{
  width: 100%;
  // height: 234px;
  background-color: #f6f7fb;
  padding-bottom: 120px;
}
   .sjplan{
     position: relative;
     width: 1200px;
     height: 234px;
     margin: auto;
     background: url('~@/assets/sjplan/openmeta_heco_pc.jpg');
     background-size: cover;
     background-position: center;
    //  margin-bottom: 120px;
     padding-top: 45px;
     h1{
       font-size: 36px;
       
       color: #FFFFFF;
       line-height: 50px;
       text-align: center;
       
     }
     button{
       position: absolute;
       left: 50%;
       bottom: 46px;
       transform: translateX(-50%);
       width: 192px;
       height: 48px;
       background: #009A7F;
       border-radius: 24px;
       font-size: 20px;
      
       color: #FFFFFF;
     }
   
   }
    .home-using {
    background-color: #fff;
    padding-top: 90px;
    padding-bottom: 103px;

    .home-using__title {
      font-size: 40px;
    
      color: #041843;
      text-align: center;
    }

    .home-using__content {
      display: flex;
      margin-top: 32px;
      justify-content: space-between;
      text-align: center;
    }

    .home-using__item {
      padding-top: 85px;
      flex: 1;
    }

    .home-using__item-icon {
      width: 120px;
      height: 120px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: inline-block;
    }


    .home-using__item-title {
      font-size: 32px;
      color: #041843;
      margin-top: 37px;
    }

    .home-using__item-describe {
      font-size: 20px;
      color: #7f8faf;
      margin-top: 19px;
    }
  }
   .home-mechanism {
    background-color: #f6f7fb;
    padding-top: 90px;
    padding-bottom: 97px;

    .home-mechanism__title {
      color: #041843;
      font-size: 40px;
    
      text-align: center;
    }

    .home-mechanism__content {
      padding: 0 10px;
      display: flex;
      justify-content: flex-start;
      margin-top: 87px;
      flex-wrap: wrap; 
      .home__item_list_new{
           width: 179px;
           height: 66px;
           border-radius: 10px;
           background-color: white;
           display: flex;
           justify-content: center;
           align-items: center;
           margin-right: 21px;
           margin-top:21px;
           img{
              width: 139px;
              height: 34px;
           }
      }
      .home__item_list_new:nth-child(6n){
           margin-right: 0px;
      }
    }
    
    .home-mechanism__item {
      width: 375px;
      height: 100px;
      /* border: 1px solid #808eb5; */
      background-color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      margin-left: 18px;
    }
    .home-mechanism__item_list {
      width: 272px;
      height: 100px;
      /* border: 1px solid #808eb5; */
      background-color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      margin-bottom: 10px;
      margin-left: 22px;
    }
     .home-mechanism__item-logo {
    width: 210px;
    height: 51px;
  }
  }
}



</style>