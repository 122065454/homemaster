<template>
  <!--  回购   -->
  <div class="repurchase" :class="chainName">
    <div class="container" v-if="isPC">
      <div class="repo-record">
        <div class="record-title text Bold">
          <span> {{ $t("buyHistory") }}</span>
          <a :href="hashQueryHandle(destroyAdrList[chainName], 'address')" target="_blank">
            <span> {{ $t("seeMores") }}</span>
            <span class="rule__button-icon"></span></a>
        </div>

        <div class="record-table">
          <div v-if="listData.length" class="repurchase__table">
            <div class="repurchase__table-head text Bold">
              <div class="repurchase__table-head-column column-1">
                {{ $t("hash") }}
              </div>
              <div class="repurchase__table-head-column column-2">
                {{ $t("block") }}
              </div>
              <div class="repurchase__table-head-column column-4">
                {{ $t("send") }}
              </div>
              <div class="repurchase__table-head-column column-5"></div>
              <div class="repurchase__table-head-column column-6">
                {{ $t("receive") }}
              </div>
              <div class="repurchase__table-head-column column-7">
                {{ $t("DistoryCoin") }}
              </div>
              <div class="repurchase__table-head-column column-8">
                {{ $t("price") }}
              </div>
              <div class="repurchase__table-head-column column-9">
                {{ $t("amount") }}
              </div>
            </div>
            <div class="repurchase__table-body numbers">
              <div v-for="list in listData" :key="list.trans_hash" class="repurchase__table-body-row">
                <div class="repurchase__table-body-column column-1 text-overflow">
                  <a target="_blank" :href="hashQueryHandle(list.trans_hash)" class="address">
                    {{ _substrAddress(list.trans_hash, 6) }}
                  </a>
                </div>
                <div class="repurchase__table-body-column column-2">
                  {{ list.block_number }}
                </div>
                <div class="repurchase__table-body-column column-4 text-overflow">
                  <a target="_blank" :href="hashQueryHandle(list.addr_from, 'address')" class="address">
                    {{ _substrAddress(list.addr_from, 6) }}</a>
                </div>
                <div class="repurchase__table-body-column column-5">
                  <span class="repurchase__table-body-icon"></span>
                </div>
                <div class="repurchase__table-body-column column-6 text-overflow">
                  <a target="_blank" :href="hashQueryHandle(list.addr_to, 'address')"
                    class="address">{{ _substrAddress(list.addr_to, 6) }}</a>
                </div>
                <div class="repurchase__table-body-column column-7">
                  {{ buyBackList[list.repurch_type] }}
                </div>
                <div class="repurchase__table-body-column column-8">
                  ${{ Number(list.price).toFixed(4) }}
                </div>
                <div class="repurchase__table-body-column column-9">
                  {{ Number(list.amount).toFixed(4) }}
                </div>
              </div>
            </div>
          </div>
          <div class="empty" v-if="!listData.length">
            <img src="@/assets/empty.png" />
            <p>{{ $t("empptyData") }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="container text" v-if="isMobile">
      <div class="repo-record">
        <div class="record-title">
          {{ $t("buyHistory") }}
          <a :href="hashQueryHandle(destroyAdrList[chainName], 'address')" target="_blank">
            <span> {{ $t("seeMores") }}</span>
            <span class="rule__button-icon"></span></a>
        </div>

        <div class="record-table">
          <div v-if="listData.length" class="repurchase__table">
            <div class="repurchase__table-head text Bold">
              <div class="repurchase__table-head-column column-1">
                <div class="repurchase__table-head-row">{{ $t("hash") }}</div>
                <div class="repurchase__table-head-row margin-top-4">
                  {{ $t("block") }}
                </div>
              </div>

              <div class="repurchase__table-head-column column-2">
                <div class="repurchase__table-head-row margin-top-4">
                  {{ $t("DistoryCoin") }}
                </div>
              </div>

              <div class="repurchase__table-head-column column-3">
                <div class="repurchase__table-head-row">{{ $t("price") }}</div>
                <div class="repurchase__table-head-row margin-top-4">
                  {{ $t("amount") }}
                </div>
              </div>

              <div class="repurchase__table-head-column column-4">
                <div class="repurchase__table-head-row">{{ $t("send") }}</div>
                <div class="repurchase__table-head-row margin-top-4">
                  {{ $t("receive") }}
                </div>
              </div>

              <div class="repurchase__table-head-column column-5"></div>
            </div>
            <div class="repurchase__table-body numbers">
              <div v-for="list in listData" :key="list.trans_hash" class="repurchase__table-body-row">
                <div class="repurchase__table-body-column-warp column-1">
                  <div class="repurchase__table-body-column  text-overflow">
                    <a target="_blank" :href="hashQueryHandle(list.trans_hash)" class="address">
                      {{ _substrAddress(list.trans_hash, 4) }}
                    </a>
                  </div>
                  <div class="repurchase__table-body-column">
                    {{ list.block_number }}
                  </div>
                </div>
                <div class="repurchase__table-body-column-warp column-2">
                  <div class="repurchase__table-body-column">
                    {{ buyBackList[list.repurch_type] }}
                  </div>
                </div>

                <div class="repurchase__table-body-column-warp column-3">
                  <div class="repurchase__table-body-column">
                    ${{ Number(list.price).toFixed(3) }}
                  </div>
                  <div class="repurchase__table-body-column">
                    {{ Number(list.amount).toFixed(2) }}
                  </div>
                </div>

                <div class="repurchase__table-body-column-warp column-4">
                  <div class="repurchase__table-body-column text-overflow">
                    <a target="_blank" :href="hashQueryHandle(list.addr_from, 'address')" class="address">{{ _substrAddress(list.addr_from, 4) }}</a>
                  </div>
                  <div class="repurchase__table-body-column text-overflow">
                    <a target="_blank" :href="hashQueryHandle(list.addr_to, 'address')" class="address">{{ _substrAddress(list.addr_to, 4) }}</a>
                  </div>
                </div>

                <div class="repurchase__table-body-column-warp column-5 numbers SemiBold">
                  <a class="repurchase__table-button" target="_blank" :href="hashQueryHandle(list.trans_hash)">Link</a>
                </div>
              </div>
            </div>
          </div>

          <div class="empty" v-if="!listData.length">
            <!-- chainName -->
            <img v-show="chainName=='Bsc'" src="@/assets/Bsc-empty.png" />
            <img  v-show="chainName=='Heco'" src="@/assets/empty.png" />
            <p>{{ $t("empptyData") }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { _hashQueryAddress } from "@/utils/urlMethod"
import { destroyAdrList, buyBackList } from "@/utils/comStatic"
import { _substrAddress } from "@/utils/comMethod"
let intrvel = null
export default {
  name: "Repurchase",
  data(){
    return {
      destroyAdrList,
      buyBackList
    }
  },
  beforeCreate() {
    this.$store.dispatch("boardRoom/getDestroyList");
  },
  methods: {
    // hash查询链接
    hashQueryHandle(address, kind) {
      return _hashQueryAddress(address, this.chainName, this.getLanguage, kind)
    },
    _substrAddress
  },
  computed: {
    listData() {
      return this.$store.state.boardRoom.destroyList;
    },
  },
  beforeDestroy() {
    clearInterval(intrvel)
  }
};
</script>

<style scoped lang="less">
@import "./Repurchase.less";
</style>
