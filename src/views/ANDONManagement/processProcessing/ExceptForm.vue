<template>
  <!-- 订单来源明细 -->
  <el-dialog title="异常数据明细" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="sourceDialog"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px" append-to-body>
    <el-row :gutter="20" style="margin :10px 0">
      <el-table ref="exDialog" v-loading="listLoading" :data="sourceListData" border height="400">
        <el-table-column min-width="160" v-for="item in tableItems" :prop="item" :label="item" :key="item"></el-table-column>
      </el-table>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  props: [ 'sourceListData', 'tableItems' ],
  data() {
    return {
      listLoading: false,
      sourceDialog: false,
    }
  },
  methods: {
    init() {
      this.listLoading = false
      this.sourceDialog = true
    },
  },
}
</script>