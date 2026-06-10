<template>
  <div class="custom-input">
    <!-- <slot name="prepend"></slot> -->
    <input class="input" :value="currentValue" :placeholder="placeholder" :disabled="disabled" :readonly="readonly"
      :maxlength="maxlength" :autocomplete="autocomplete" :autofocus="autofocus" :type="type" :name="name"
      @input="handleInput" @blur="handleBlur" @focus="handleFocus">
    <i v-if="clearable && currentValue" class="clear el-select__caret el-input__icon el-icon-circle-close"
      @click="clearInput"></i>
    <!-- <slot name="append"></slot> -->
    <el-button class="button" slot="append" icon="el-icon-search" @click="$emit('buttonClick')"></el-button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: [String, Number],
      default: Infinity
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    name: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentValue: this.value
    }
  },
  watch: {
    value(newValue) {
      this.currentValue = newValue;
    }
  },
  methods: {
    handleInput(event) {
      this.currentValue = event.target.value;
      this.$emit('input', this.currentValue);
    },
    handleBlur() {
      this.$emit('blur');
    },
    handleFocus() {
      this.$emit('focus');
    },
    clearInput() {
      this.currentValue = '';
      this.$emit('input', '');
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-input {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;

  .input {
    font-size: 16px;
    width: 100%;
    height: 100%;
    padding: 0 15px;
    border: 1px solid #DCDFE6;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    border-radius: 4px 0 0 4px;

    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    box-sizing: border-box;
    color: #606266;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    outline: none;

    &:hover {
      border-color: #c0c4cc;
    }

    &:focus {
      border-color: #409EFF;
    }
  }

  .clear {
    position: absolute;
    top: 41%;
    right: 50px;
    transform: translateY(-50%);
    cursor: pointer;
    color: #c0c4cc;

    &:hover {
      color: #606266;
    }

    &:focus {}
  }

  .button {
    border-radius: 0 4px 4px 0;
    background-color: #F5F7FA;
    border-left: none;

    &:hover {
      background-color: #f5f7fa;
      border-color: #DCDFE6;
      color: #606266;
    }

    &:focus {
      background-color: #f5f7fa;
      border-color: #DCDFE6;
      color: #606266;
    }
  }

  input::-webkit-input-placeholder {
    color: #c0c4cc;
  }
}
</style>
