<template>
  <el-dialog title="导出数据" :close-on-click-modal="false" :visible.sync="visible" class="JNPF-dialog JNPF-dialog_center JNPF-dialog-export" lock-scroll width="600px" append-to-body>
    <el-form label-position="top">
      <el-form-item>
        <el-radio-group v-model="type" v-if="exportHidden">
          <el-radio :label="0">当前页面数据</el-radio>
        </el-radio-group>
        <el-radio-group v-model="type" v-else>
          <el-radio :label="0">当前页面数据</el-radio>
          <el-radio :label="1">全部页面数据</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="export-line">
        <p slot="label" class="export-label">列表数据<span>请选择导出字段</span></p>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="columns" @change="handleCheckedChange">
          <el-checkbox v-for="item in columnList" :label="item.prop" :key="item.prop" class="column-item">
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <p class="footer-tip">提示:系统将导出列表中选中的数据</p> -->
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" @click="downLoad">导 出</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    exportHidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      btnLoading: false,
      type: 0,
      columns: [],
      rows: [],
      checkAll: true,
      isIndeterminate: false,
      columnList: [],
    }
  },
  methods: {
    init(columnList) {
      this.visible = true
      this.checkAll = true
      this.isIndeterminate = false
      this.columnList = columnList
      this.columns = columnList.map(o => o.prop)
      this.rows = columnList.map(o => o.label)
    },
    handleCheckAllChange(val) {
      this.columns = val ? this.columnList.map(o => o.prop) : [];
      this.rows = val ? this.columnList.map(o => o.label) : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.rows = this.columnList.filter(function (item) {
        return value.includes(item.prop);
      }).map(function (item) {
        return item.label;
      });
      this.columns = this.columnList.filter(function (item) {
        return value.includes(item.prop);
      }).map(function (item) {
        return item.prop;
      });
      this.checkAll = checkedCount === this.columnList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnList.length;
    },
    downLoad() {
      if (!this.columns.length) return this.$message.warning(`请至少选择一个导出字段`)
      this.$emit('download', { dataType: this.type, selectKey: this.columns, selectVal: this.rows })
    }
  }
}
</script>
