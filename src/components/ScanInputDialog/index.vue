<template>
  <el-dialog
    :title="title"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    :visible.sync="visible"
    lock-scroll
    class="scan-dialog JNPF-dialog JNPF-dialog_center"
    width="500px"
    @close="handleClose">
    <div class="scan-dialog__content" v-loading="loading">
      <div class="scan-dialog__input-box">
        <el-input
          v-model="scanResult"
          ref="inputRef"
          :placeholder="placeholder"
          @keyup.enter.native="handleSubmit"
          class="scan-dialog__input">
        </el-input>
        <div class="scan-dialog__tip">说明：{{ tipText }}</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ScanInputDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '扫码录入'
    },
    placeholder: {
      type: String,
      default: '请扫产品码'
    },
    tipText: {
      type: String,
      default: '根据产品码自动添加对应的产品'
    }
  },
  data() {
    return {
      scanResult: ''
    }
  },
  methods: {
    handleClose() {
      this.scanResult = ''
      this.$emit('close')
    },
    handleSubmit() {
      this.$emit('submit', this.scanResult)
      this.scanResult = ''
    },
    focusInput() {
      this.$nextTick(() => {
        this.$refs.inputRef.focus()
      })
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.focusInput()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.scan-dialog {
  &__content {
    padding: 20px;
  }

  &__input-box {
    margin-bottom: 20px;
  }

  &__input {
    width: 100%;
  }

  &__tip {
    margin-top: 10px;
    font-size: 12px;
    color: #999;
  }
}
</style>
