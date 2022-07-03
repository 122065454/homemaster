<template>

  <x-modal
    class="vs-modal"
    v-bind="$props"
    @cancel="onCancel"
    @accept="onAccept"
    @close="onClose"
    :acceptDisabled="acceptDisabled"
    :active="active"
    :parent="parent"
  >
    <slot></slot>
  </x-modal>


</template>

<script>
import XModal from './xmodal'
export default {
  name: "modal-wrapper",
  components: {
    XModal,
  },
  props: {
    title: {
      default: "弹框",
      type: String
    },
    buttonsHidden: {
      default: false,
      type: Boolean
    },
    acceptText: {
      default: "",
      type: String
    },
    acceptDisabled: {
      default: false,
      type:Boolean,
    },
    cancelText: {
      default: "",
      type: String
    },


    cancel: {
      default: () => {},
      type: Function
    },
    accept: {
      default: () => {},
      type: Function
    },
    width: {
      type: [String, Number],
      default: 826,
    }
  },
  data() {
    return { active: true };
  },
  watch: {
    active(n) {
      if (!n) {
        this.$modalClose(this.modalid);
        this.$emit("close");
      }
    }
  },
  computed: {
    modalid() {
      return this.$parent.id;
    },
    parent() {
      // return this.$parent.$el
      return document.getElementById('modal-container')
    }
  },
  methods: {
    onClose() {
      return this.onCancel();
    },
    async onAccept() {
      const rt = await this.accept();
      if (rt !== false) {
        this.active = false;
      }
    },
    async onCancel() {
      const rt = await this.cancel();
      if (rt !== false) {
        this.active = false;
      }
    }
  }
};
</script>