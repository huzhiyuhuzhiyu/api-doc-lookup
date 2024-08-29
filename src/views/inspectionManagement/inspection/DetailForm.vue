<template>
  <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false" :visible="visible" lock-scroll
    class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="visible = false">
    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="subtitle">
            <h5>基本信息</h5>
          </div>
          <JNPF-col v-model="dataForm" :tabContent="dataFormItems" ref="dataForm" :openMode="'只读'" />
          <div class="subtitle">
            <h5>上/下工记录</h5>
          </div>
          <JNPF-table v-loading="listLoading" :data="tableData" hasNO fixedNO ref="dataTable">
            <el-table-column prop="personName" label="工作人员姓名"  />
            <el-table-column prop="workType" label="工作类型">
              <template slot-scope="scope">
                <div v-if="scope.row.workType === 'up'">上工</div>
                <div v-else-if="scope.row.workType === 'down'">下工</div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="createByName" label="创建人" min-width="160" />
            <el-table-column prop="updateByName" label="修改人" min-width="160" /> -->
            <el-table-column prop="operatingTime" label="操作时间" width="180" />
          </JNPF-table>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { detailDispatchData } from '@/api/productOrdes/dispatchTicketInquiry'
export default {
  props: {
    startingStatusList: {},
    workOrderStatusList: {},
  },
  data() {
    return {
      title: "查看上/下工记录",
      tableData: [],
      dataForm: {},
      dataFormItems: [
        { prop: "orderNo", label: "派工单号", value: "", type: "input", sm: 6 },
        { prop: "productionOrderNo", label: "生产订单号", value: "", type: "input", sm: 6 },
        { prop: "workNo", label: "工单号", value: "", type: "input", sm: 6 },
        { prop: "processName", label: "工序名称", value: "", type: "input", sm: 6 },
        // { prop: "workOrderNo", label: "工作令号", value: "", type: "input", sm: 6 },
        { prop: "workGroupName", label: "班组名称", value: "", type: "input", sm: 6 },
        { prop: "equipmentName", label: "设备名称", value: "", type: "input", sm: 6 },
        { prop: "personName", label: "人员名称", value: "", type: "input", sm: 6 },
        { prop: "productionLineName", label: "产线名称", value: "", type: "input", sm: 6 },
        { prop: "workstationName", label: "工位名称", value: "", type: "input", sm: 6 },
        { prop: "productionQuantity", label: "派工生产数量", value: "", type: "input", sm: 6 },
        { prop: "completedQuantity", label: "完工数", value: "", type: "input", sm: 6 },
        { prop: "planStartDate", label: "计划开始日期", value: "", type: "input", sm: 6 },
        { prop: "planEndDate", label: "计划结束日期", value: "", type: "input", sm: 6 },
        { prop: "actualStartDate", label: "实际开始日期", value: "", type: "input", sm: 6 },
        { prop: "actualEndDate", label: "实际结束日期", value: "", type: "input", sm: 6 },
        { prop: "processCode", label: "工序编码", value: "", type: "input", sm: 6 },
        { prop: "createTime", label: "创建时间", value: "", type: "input", sm: 6 },
        { prop: "createByName", label: "创建人", value: "", type: "input", sm: 6 },
        { prop: "startingStatus", label: "开工状态", value: "", type: "select", options: this.startingStatusList, sm: 6 },
        { prop: "workOrderStatus", label: "派工单状态", value: "", type: "select", options: this.workOrderStatusList, sm: 6 },
        { prop: "remark", label: "备注", value: "", type: "input", sm: 6 },
      ],
      visible: false,
      listLoading: false,
      listQuery: {},
      initListQuery: {},
      total: 0,
    }
  },
  methods: {
    init(id) {
      this.visible = true
      detailDispatchData(id).then(res => {
        this.dataForm = res.data.dispatch
        this.tableData = res.data.workRecordList
      })
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