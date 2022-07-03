<template>
  <div
    v-click-outside="handleClose"
    class="v-select"
    :class="[{ 'is-options__show': isOptionsShow }]"
    @click="handleClick"
  >
    <div class="v-select-inner" :class="[`v-select-${color}`]">
      <span>{{ currentLabel }}</span>
      <span class="arrow" :class="{ rotate: isOptionsShow }"></span>
    </div>
    <transition name="v-options-animation">
      <div v-show="isOptionsShow" class="v-options">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
export default {
  name: "VSelect",
  model: {
    prop: "value",
    event: "change",
  },
  directives: {
    ClickOutside,
  },
  provide() {
    return {
      select: this,
    };
  },
  props: {
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 值
    value: {
      type: [String, Number, Boolean],
      default: "",
    },
    /**
     * @white 白色
     * @green 绿色
     * @yellow
     * */
    color: {
      type: String,
      default: "white",
    },
  },
  data() {
    return {
      isOptionsShow: false,
      // 所有 otpion 实例
      options: [],
      selectValue: this.value,
    };
  },
  computed: {
    currentLabel() {
      return (
        this.options.find((item) => item.value === this.selectValue)?.label ||
        ""
      );
    },
  },
  watch: {
    selectValue(v) {
      if (this.value === v) return;
      this.$emit("change", v);
    },
    value(v) {
      this.selectValue = v;
    },
  },
  created() {
    this.$on("changeValue", (value) => {
      this.selectValue = value;
      this.handleClose();
    });
    this.$on("add", (component) => {
      this.options.push(component);
    });
    this.$on("remove", (component) => {
      this.options = this.options.filter((item) => item !== component);
    });
  },
  methods: {
    handleClick() {
      if(this.disabled) return
      this.isOptionsShow = !this.isOptionsShow;
    },
    // 处理关闭
    handleClose() {
      this.isOptionsShow = false;
    },
  },
};
</script>

<style type="text/css" lang="less">
// pc
@media screen and (min-width: 450px) {
  .v-select {
    position: relative;
    width: 100%;
    display: inline-block;
  }

  .v-select-inner {
    padding: 0 13px;
    height: 42px;
    border-radius: 24px;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    word-break: keep-all;
    .arrow {
      width: 12px;
      height: 7px;
      margin-left: 10px;
      display: inline-block;
      background-repeat: no-repeat;
      transition: all 0.3s;
      transform-origin: center center;
    }
  }

  .v-select-white {
    background-color: #fff;
    color: #041843;
    .arrow {
      background-image: url("~@/assets/arrow-white.png");
    }
  }

   .v-select-yellow {
    background: #FFCA13;
   color: #2E2E2E;
    .arrow {
      background-image: url("~@/assets/arrow-white.png");
    }
  }

  .v-select-green {
    background-color: #02c09f;
    color: #fff;
    .arrow {
      background-image: url("~@/assets/arrow-green.png");
    }
  }

  .v-options {
    position: absolute;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 999;
    border-top: none;
    margin-top: 16px;
    border-radius: 8px;
    transform-origin: center top;
    padding: 15px 0;
  }
}

// h5
@media screen and (max-width: 450px) {
  .v-select {
    position: relative;
    width: 100%;
    display: inline-block;
  }

  .v-select-inner {
    padding: 0 6px;
    height: 28px;
    border-radius: 4px;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    word-break: keep-all;
    font-size: 14px;
    .arrow {
      width: 7px;
      height: 4px;
      margin-left: 5px;
      display: inline-block;
      background-repeat: no-repeat;
      background-size: contain;
      transition: all 0.3s;
      transform-origin: center center;
    }
  }

  .v-select-white {
    background-color: #fff;
    color: #041843;
    .arrow {
      background-image: url("~@/assets/arrow-white.png");
    }
  }

  .v-select-green {
    background-color: #02c09f;
    color: #fff;
    .arrow {
      background-image: url("~@/assets/arrow-green.png");
    }
  }

  .v-options {
    position: absolute;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 999;
    border-top: none;
    margin-top: 9px;
    border-radius: 8px;
    transform-origin: center top;
    padding: 8px 0;
  }
}

.v-select .arrow.rotate {
  transform: translateY(-50%) rotate(-180deg);
}

.v-options-animation-enter,
.v-options-animation-leave-to {
  transform: scaleY(0);
}

.v-options-animation-leave,
.v-options-animation-enter-to {
  transform: scaleY(1);
}

.v-options-animation-enter-active,
.v-options-animation-leave-active {
  transition: transform 0.1s;
}
</style>
