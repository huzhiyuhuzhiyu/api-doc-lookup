<template>
  <el-dialog title="单箱打印" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="dialogVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px"
    @close="handleClose">
    <el-form label-width="100px">
      <el-form-item label="选择托盘">
        <el-select v-model="currentTrayNo" placeholder="请选择托盘" style="width: 100%;">
          <el-option v-for="item in trayOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="filteredData" border max-height="400">
      <el-table-column prop="trayNo" label="托盘号" width="120" />
      <el-table-column prop="productsCode" label="产品编码" width="150" />
      <el-table-column prop="productsName" label="产品名称" min-width="150" />
      <el-table-column prop="drawingNo" label="图号" width="120" />
      <el-table-column prop="mainUnit" label="单位" width="80" />
      <el-table-column prop="totalNum" label="数量" width="80" />
      <el-table-column prop="traySize" label="托盘尺寸" width="120" />
      <el-table-column prop="grossWeight" label="毛重" width="80" />
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="handleConfirm">打印</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getStockPackingListNoticeDetail } from "@/api/batchPacking/index";

export default {
  name: 'SingleBoxPrintDialog',
  data() {
    return {
      dialogVisible: false,
      trayOptions: [],
      tableData: [],
      currentTrayNo: '',
      btnLoading: false,
      currentTemplateCode: ''
    }
  },
  computed: {
    filteredData() {
      if (!this.currentTrayNo) return []
      return this.tableData.filter(item => item.trayNo === this.currentTrayNo)
    }
  },
  methods: {
    async open(packingListId, templateCode) {
      this.currentTemplateCode = templateCode
      try {
        const res = await getStockPackingListNoticeDetail(packingListId);
        if (!res.data || !res.data.packingListLines) {
          return this.$message.warning('未找到装箱明细数据');
        }
        const lines = res.data.packingListLines;
        const trayOptions = [...new Set(lines.map(item => item.trayNo))].map(trayNo => ({
          label: trayNo,
          value: trayNo
        }));
        this.trayOptions = trayOptions;
        this.tableData = lines;
        this.currentTrayNo = trayOptions.length > 0 ? trayOptions[0].value : '';
        this.dialogVisible = true;
      } catch (error) {
        console.error('获取装箱明细失败:', error);
        this.$message.error('获取装箱明细失败');
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.trayOptions = [];
      this.tableData = [];
      this.currentTrayNo = '';
      this.currentTemplateCode = '';
    },
    handleConfirm() {
      if (!this.currentTrayNo) {
        return this.$message.warning('请选择托盘号');
      }
      this.$emit('confirm', this.currentTemplateCode, this.currentTrayNo);
    }
  }
}
</script>
