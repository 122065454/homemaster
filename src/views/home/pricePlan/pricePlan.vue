<template>
  <div class="main" :class="[chainName, getLanguage]">
    <title-banner />
    <div class="introduce text">
      <section class="banner">
        <div class="plantitle">
           <a href="mailto:developer@mdex.com">
          <span>{{ $t("tijiaoreport") }}</span>
          </a>
          <!-- <div class="logo"></div> -->
        </div>
      </section>
      <!-- 介绍 -->
     
      <div class="plan">
        <h2>{{ $t("sjrd") }}</h2>
        <div class="title">
          <h1>{{ $t("overview") }}</h1>
          <p v-html="$t('overviewdetail')">
           
          </p>
        </div>
        <!-- 计划 -->
        <div class="title">
          <h1>{{ $t("Scopeapplication") }}</h1>
          <p>{{ $t("Scopeapplication1") }}</p>
          <p>{{ $t("Scopeapplication2") }}</p>
          <ul>
            <li>
              <a
                href="https://hecoinfo.com/address/0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c#code"
                target="_blank" 
              >
                {{ $t("Scopeapplication3") }}(heco)</a
              >
            </li>
            <li>
              <a
                href="https://bscscan.com/address/0x9C65AB58d8d978DB963e63f2bfB7121627e3a739#code"
                 target="_blank"
                >{{ $t("Scopeapplication3") }}(bsc)</a
              >
            </li>
            <li>
              <a
                href="https://hecoinfo.com/address/0xFB03e11D93632D97a8981158A632Dd5986F5E909#code"
                 target="_blank"
              >
                {{ $t("Scopeapplication4") }}</a
              >
            </li>
            <li>
              <a
                href="https://bscscan.com/address/0xc48FE252Aa631017dF253578B1405ea399728A50#code"
                 target="_blank"
              >{{ $t("Scopeapplication5") }}</a>
            </li>
            <li>
              <a
                href="https://hecoinfo.com/address/0x7373c42502874C88954bDd6D50b53061F018422e#code"
                 target="_blank"
              >
                {{ $t("Scopeapplication6") }}(heco)</a
              >
            </li>
            <li>
              <a
                href="https://bscscan.com/address/0x782395303692aBeD877d2737Aa7982345eB44c11#code"
                 target="_blank"
                >{{ $t("Scopeapplication6") }}(bsc)</a
              >
            </li>
          </ul>
          <p>{{ $t("ExternalContracts") }}</p>
          <ul>
            <li>
              <a href="https://hecoinfo.com/address/0x46900C0c18ace98bAAB81561B9906Dc93287910C#code" target="_blank"> {{ $t("ExternalContracts1") }}(heco)</a>
             </li>
            <li>
              <a href="https://bscscan.com/address/0x1308AF6853B449d7604C7544cb2170248527110F#code" target="_blank">{{ $t("ExternalContracts1") }}(bsc)</a>
            </li>
            <li>
              <a href="https://bscscan.com/address/0x5FEF5CC8AE1E42c5299AAe05a2EFfA1634BA5E77#code" target="_blank">{{ $t("ExternalContracts2") }}</a>
              </li>
          </ul>
          <p>{{ $t("followingsituations") }}</p>
          <ul>
            <li>{{ $t("followingsituations1") }}</li>
            <li>{{ $t("followingsituations2") }}</li>
            <li>
              {{ $t("followingsituations3") }}
            </li>
          </ul>
        </div>

        <!-- 奖励计划 -->
        <div class="title">
          <h1>{{ $t("RewardPlan") }}</h1>
          
       <!-- <i18n path="RewardPlan1" tag="p">
         
        <a place="action" href="https://www.first.org/cvss/calculator/3.0" target="_blank">CVSS</a>
       </i18n> -->
          <p>{{ $t("RewardPlan1") }}</p>
          <!-- tabel -->
          <table cellspacing="0" cellpadding="0" width="80%" class="numbers">
            <tr>
              <th>{{ $t("Rating") }}</th>
              <th>{{ $t("Rating1") }}</th>
            </tr>
            <tr>
              <td>{{ $t("Rating2") }}(9.0-10.0)</td>
              <td class="numbers">$60000 MDX</td>
            </tr>
            <tr>
              <td>{{ $t("Rating3") }}(7.0-8.9)</td>
              <td >$50000 MDX</td>
            </tr>
            <tr>
              <td>{{ $t("Rating4") }}(4.0-6.9)</td>
              <td>$10000 MDX</td>
            </tr>
            <tr>
              <td>{{ $t("Rating5") }}(0.1-3.9)</td>
              <td>$6000 MDX</td>
            </tr>
          </table>
          <p>
            {{ $t("Rating6") }}
          </p>
        </div>
        <!-- 评审和奖励时间 -->
        <div class="title">
          <h1>{{ $t("rewardtimeline") }}</h1>
          <p v-html="$t('rewardtimeline1')"></p>
        </div>
        <!-- 漏洞报告提交方式 -->
        <div class="title">
          <h1>{{ $t("submitreport0") }}</h1>
          <i18n path="submitreport" tag="p">
           <a place="action" href="mailto:developer@mdex.com" target="_blank">developer@mdex.com</a>
         </i18n>
          <!-- <p v-html="$t('submitreport')"></p> -->
          <p>{{ $t("submitreport1") }}</p>
          <ul>
            <li>{{ $t("submitreport2") }}</li>
            <li>{{ $t("submitreport3") }}</li>
            <li>{{ $t("submitreport4") }}</li>
            <li>{{ $t("submitreport5") }}</li>
          </ul>
        </div>

        <!-- 获得奖励条件 -->
        <div class="title">
          <h1>{{ $t("TermsConditions") }}</h1>
          <p v-html="$t('TermsConditions2')"></p>
        </div>
        <!-- 安全顾问 -->
        <div class="title">
          <h1>{{ $t("SecurityConsultant") }}</h1>
          <p>{{ $t("SecurityConsultant0") }}</p>
          <p v-html="$t('SecurityConsultant1')"></p>
        </div>

        <!-- 其他条款 -->
        <div class="title">
          <h1>{{ $t("Otherterms") }}</h1>
          
          <p v-html="$t('Otherterms1')"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleBanner from "@/components/TitleBanner/TitleBanner";
export default {
  name: "introduce",
  components: {
    TitleBanner,
  },
  computed: {
    getLanguage() {
      return this.$store.state.language;
    },
    bannerName() {
      return this.$store.state.language === "en" ? "banner_en" : "banner";
    },
  },
};
</script>


<style lang="less" scoped>
@import './common.less';
/* h5 */
@media screen and (max-width: 450px) {
 @import './h5price.less';
}

@media screen and (min-width: 450px) {
  .plantitle {
    left: 130px;
    bottom: 57px;
    padding: 4px 20px;
    height: 35px;
    font-size: 20px;
    line-height: 27px;
  }
  .logo {
    width: 25px;
    height: 25px;
  }
  .apply {
    position: absolute;
    top: 46px;
    right: 47px;
    height: 28px;
    font-size: 20px;
    font-weight: 500;
  }
  .plan {
    background: #ffffff;
    border-radius: 20px;
    padding: 30px;
    margin-top: 15px;
  }
  .title {
    padding-top: 20px;
  }
}


</style>