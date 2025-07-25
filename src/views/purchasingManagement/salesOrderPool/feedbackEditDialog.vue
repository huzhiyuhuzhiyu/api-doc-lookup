<template>
  <el-dialog
    title="交期反馈"
    :visible.sync="dialogVisible"
    width="50%"
    lock-scroll
    append-to-body
    :close-on-click-modal="false"
    class="JNPF-dialog JNPF-dialog_center"
    @close="$emit('update:visible', false)"
  >
    <div class="date-select-dialog">
      <div class="date-picker-container">
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        />
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" class="cancel-btn">取消</el-button>
      <el-button type="primary" @click="handleConfirm" class="confirm-btn">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      selectedDate: '',
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal
      if (newVal) {
        this.selectedDate = '' // 每次打开时清空选择
      }
    }
  },
  methods: {
    handleConfirm() {
      if (!this.selectedDate) {
        this.$message.warning('请选择日期')
        return
      }
      this.$emit('update:visible', false)
      this.$emit('confirm', this.selectedDate)
    }
  }
}
</script>

<style lang="scss">
.date-select-dialog {
  .date-picker-container {
    display: flex;
    justify-content: center;
    padding: 20px;

    .el-date-editor {
      width: 100%;
      max-width: 300px;
    }
  }
}
</style>
