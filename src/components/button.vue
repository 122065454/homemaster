<template>
  <span :class="{disabled, [btnCls]: true, 'icon-button': !!icon}" v-on="!disabled ? {...$listeners} : {}" v-bind="$attrs">
    <i v-if="icon" class="icon"><img :src="iconEl" /></i>
    <slot />
  </span>
</template>
<script>
export default {
  name: 'Button',
  computed: {
    btnCls() {
      switch(this.type) {
        case 'flat': return 'flat-button'; break;
        default: return 'main-button';break;
      }
    },
    iconEl() {
      switch(this.icon) {
        case 'plus': return require('@/assets/plus.png');
        default: return '';
      }
    }
  },
  props: {
    disabled: Boolean,
    type: {
      type: String,
      default: 'main',
    },
    icon: String,
  }
}
</script>