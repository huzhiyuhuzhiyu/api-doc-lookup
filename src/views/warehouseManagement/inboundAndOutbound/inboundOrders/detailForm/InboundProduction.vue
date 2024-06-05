<template>
  <el-dialog title="查看生产订单" :close-on-click-modal="false" :close-on-press-escape="false" :visible="visible" lock-scroll
    class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="visible = false">
    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="formLoading">
          <div class="subtitle">
            <h5>基本信息</h5>
          </div>
          <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :openMode="'只读'" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
// import { detailDispatchData } from '@/api/productOrdes/dispatchTicketInquiry'
export default {
  data() {
    return {
      tableData: [],
      dataForm: {},
      dataFormItems: [
        { prop: "productionOrderNo", label: "生产单号", type: "input", sm: 6 },
        { prop: "productCode", label: "产品编码", type: "input", sm: 6 },
        { prop: "productName", label: "产品名称", type: "input", sm: 6 },
        { prop: "productDrawingNo", label: "产品图号", type: "input", sm: 6 },
        { prop: "processCode", label: "工序编码", type: "input", sm: 6 },
        { prop: "processName", label: "工序名称", type: "input", sm: 6 },
        { prop: "productionQuantity", label: "订单生产数量", type: "input", sm: 6 },
        { prop: "completedQuantity", label: "完成数量", type: "input", sm: 6 },
        { prop: "receivedQuantity", label: "已入库数量", type: "input", sm: 6 },
        { prop: "planStartDate", label: "计划开始时间", type: "date", sm: 6 },
        { prop: "planEndDate", label: "计划结束时间", type: "date", sm: 6 },
        { prop: "actualStartDate", label: "实际开始时间", type: "date", sm: 6 },
        { prop: "actualEndDate", label: "实际结束时间", type: "date", sm: 6 },
        { prop: "createTime", label: "创建时间", type: "date", sm: 6 },
        { prop: "createByName", label: "创建人", type: "input", sm: 6 }
      ],
      visible: false,
      listLoading: false,
      listQuery: {},
      initListQuery: {},
      formLoading: false,
      total: 0,
    }
  },
  methods: {
    init(id) {
      this.visible = true
      this.formLoading = true

      this.dataForm = {}
      this.formLoading = false
      // detailDispatchData(id).then(res => {
      //   this.dataForm = res.data.dispatch
      //   this.tableData = res.data.workRecordList
      // })
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 10px !important;
}

::v-deep .el-dialog__body {
  margin-bottom: 10px;
}

::v-deep .el-dialog__footer {
  padding: 0 20px 10px;
}

::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}

.noPaddingLeft {
  padding-left: 0 !important;
}

.subtitle {
  line-height: 33px;
  font-size: 18px;
  border-bottom: 1px solid #dcdfe6;
  background: #fafafa;
  padding-left: 5px;
}
</style>