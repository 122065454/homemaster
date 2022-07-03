<template>
  <div class="modal-container" id="modal-container">
    <transition-group name="modal" class="transition-group" tag="div">
      <component v-for="(mod, index) in list" v-bind="mod" :key="mod.id || mod.name" :is="modals[mod.id || mod.name] || 'div'" :id="mod.id || mod.name" :style="{zIndex: index}" />
    </transition-group>
  </div>
</template>
<script>
import message from './message'

export let modalVM
let modals = {
  message,
}
export function getVM() {
  return modalVM
}
export function setModals(obj = {}) {
  modals = {
    ...modals,
    ...obj,
  }
  // set modal id
  Object.keys(modals).forEach(key => {
    const comp = modals[key]
    if (!comp.props || !comp.props.id) {
      comp.props = comp.props || {}
      comp.props.id = { type: String, default: key }
    }
  })
  if (modalVM) {
    modalVM.modals = modals
  }
}

export default {
  name: 'modal-container',
  inheritAttrs: false,
  data() {
    return {
      list: [],
      modals: modals,
    }
  },
  beforeCreate() {
    modalVM = this
  },
}
</script>
<style lang="less">
.modal-container {
  position: relative;
  z-index: 99;
  .transition-group {
    display: block;
  }
}

.transition() {
  transition-property: transform, opacity;
  transition-duration: 100ms;
  transition-timing-function: ease-out;
}
.x-modal-root {
    .transition();
    .modal-main {
      .transition();
    }
    &.modal-enter{
      opacity: 0;
      .modal-main {
        // opacity: 0;
        transform: translate3d(0,-50%,0)
      }
    }
    &.modal-enter-to {
      opacity: 1;
      // opacity: 1;
      .modal-main {
        // opacity: 1;
        transform: translate3d(0,0,0)
      }
    }
    &.modal-leave{
      opacity: 1;
      .modal-main {
        // opacity: 1;
        transform: translate3d(0,0,0)
      }
    }
    &.modal-leave-active{
      opacity: 0;
      .modal-main {
        // opacity: 0;
        transform: translate3d(0,-50%,0)
      }
    }
  
}
</style>
