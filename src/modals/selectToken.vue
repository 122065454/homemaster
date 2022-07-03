<template>
  <modal class="selectToken-modal" title="Select a token" width="520px">
    <table class="token-table" cellspacing="0">
      <thead>
        <tr>
          <th>Token Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in $s.exchange.tokens" :key="item.symbol" @click="onSelect(item)">
          <td class="symbol">
            <img class="icon" :src="item.logoURI" /><span>{{
              item.symbol
            }}</span>
          </td>
          <td class="balance">{{ 0 | balanceNum }}</td>
        </tr>
      </tbody>
    </table>
  </modal>
</template>
<script>
export default {
  name: "modal-select-token",
  props: ["select", 'accept'],
  methods: {
    onSelect(item) {
      this.accept && this.accept(item)
      this.$modalClose()
    }
  }
};
</script>
<style lang="less" scoped>
.token-table {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding-bottom: 30px;
  thead {
    border-bottom: 1px solid rgb(255, 247, 242);
    font-size: 22px;
  }
  tbody {
    tr {
      cursor: pointer;
      &:hover {
        background: #ffd0254d;
      }
    }
    img.icon {
      width: 24px;
      height: 24px;
      vertical-align: middle;
    }
  }
  tr {
    line-height: 60px;
    th,
    td {
      padding: 0 20px;
      &:first-of-type {
        text-align: left;
      }
      &:last-of-type {
        text-align: right;
      }
    }
  }
  .symbol {
    font-size: 20px;
    img {
      margin-right: 15px;
    }
  }
}
</style>