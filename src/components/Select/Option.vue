<template>
  <div
    class="v-option-item"
    :class="{ 'is-disabled': disabled, 'is-active': isActive }"
    @click.stop="handleClick"
  >
    <div class="v-options-item__slot">
      <slot>
        <span>{{ label }}</span>
      </slot>
    </div>
  </div>
</template>

<script>
import { langSignList } from '@/utils/comStatic'
export default {
  name: 'VOption',
  props: {
    // 值
    value: {
      type: [String, Number, Object],
      require: true,
      default: '',
    },
    // label
    label: {
      type: [String, Number],
      require: true,
      default: '',
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  inject: {
    select: {
      default: '',
    },
  },
  computed: {
    isActive() {
      return this.select?.selectValue === this.value;
    },
  },
  created() {
    this.select.$emit?.('add', this);
  },
  destroyed() {
    this.select.$emit?.('remove', this);
  },
  methods: {
    handleClick() {
      if (this.disabled) return;
      if(langSignList.includes(this.value)) {
        this.select.$emit?.('changeValue', this.value);
        return
      }
      switch(this.value) {
        case 1 :
          ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [
              {
                chainId: '0x1',
              }
            ]
          }).then(res => {
            // this.select.$emit?.('changeValue', this.value);
            const hostname = window.location.hostname.replace('www.', '')
            window.location.href=`https://eth.${hostname}`
          })
        break;
        case 56 :
          console.log('ethereum:', ethereum)
          if(ethereum.switchIdentity) {
            try {
              ethereum.switchIdentity('bnb')
              setTimeout(() => {
                this.select.$emit?.('changeValue', this.value);
              }, 300);
            } catch (error) {
              console.log('switchIdentity', error)
            }
          } else {
            ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x38',
                  chainName: 'BSC Mainnet',
                  nativeCurrency: {
                    name: 'BSC',
                    symbol: 'BNB',
                    decimals: 18
                  },
                  rpcUrls: ['https://bsc-dataseed.binance.org'],
                  blockExplorerUrls: ['https://bscscan.com/']
                }
              ]
            }).then(res => {
              this.select.$emit?.('changeValue', this.value);
            })
          }
        break;
        case 128 :
          if(ethereum.switchIdentity) {
            try {
              ethereum.switchIdentity('ht')
              setTimeout(() => {
                this.select.$emit?.('changeValue', this.value);
              }, 300);
            } catch (error) {
              console.log('switchIdentity', error)
            }
          } else {
            ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x80',
                  chainName: 'Heco Mainnet',
                  nativeCurrency: {
                    name: 'Heco',
                    symbol: 'HT',
                    decimals: 18
                  },
                  rpcUrls: ['https://http-mainnet-node.huobichain.com'],
                  blockExplorerUrls: ['https://hecoinfo.com']
                }
              ]
            }).then(res => {
              this.select.$emit?.('changeValue', this.value);         
            })
          }
        break;    
      }
    },
  },
};
</script>

<style>
.v-option-item {
  cursor: pointer;
  color: #626E88;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  line-height: 26px;
}
.v-options-item__slot {
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: bold;
}
.v-option-item.is-disabled{
  color: #c0c4cc;
  cursor: not-allowed;
}
.v-option-item.is-active{
  color: #041843;
}
</style>
