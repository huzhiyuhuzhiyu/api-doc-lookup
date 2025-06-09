<template>

  <el-dialog title="选择工序" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectProcess" width="70%" append-to-body
    @close="customerVisible = false">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="form.code" placeholder="工序编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input @keyup.native.enter="search()"  v-model="form.name" placeholder="工序名称" clearable />
              </el-form-item>
            </el-col>


            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table v-loading="listLoading" :data="tableDataList" :fixedNO="true"  ref="processRef" customKey="JNPFTableKey_708993">
            <el-table-column prop="name" label="工序名称"></el-table-column>
            <el-table-column prop="code" label="工序编码" />
            <el-table-column prop="processType" label="工序类型">
              <template slot-scope="scope">
                <div v-if="scope.row.processType == 'normal'">正常工序</div>
                <div v-if="scope.row.processType == 'vibrate'">测振工序</div>
                <div v-if="scope.row.processType == 'heat_treatment'">热工工序</div>
                <div v-if="scope.row.processType == 'packing'">包装工序</div>
                <div v-if="scope.row.processType == 'pairs'">配对工序</div>
                <div v-if="scope.row.processType == 'typing'">打字工序</div>
                <div v-if="scope.row.processType == 'fatInjection'">注脂工序</div>
                <div v-if="scope.row.processType == 'grinding'">磨孔工序</div>
                <div v-if="scope.row.processType == 'accuracy'">精度工序</div>
                <div v-if="scope.row.processType == 'boxing'">装盒工序</div>
              </template>
            </el-table-column>


            <el-table-column prop="processingType" label="加工类型" width="180">
              <template slot-scope="scope">
                <div v-if="scope.row.processingType == 'self_produced'">自制</div>
                <div v-if="scope.row.processingType == 'external_production'">外协</div>
              </template>
            </el-table-column>
            <el-table-column prop="technicalRequirement" label="技术要求" width="180" show-overflow-tooltip
              v-if="isTechnicalSwitch === '1'">

            </el-table-column>
            <el-table-column prop="inspectionInformation" label="检验信息" width="180" show-overflow-tooltip
              v-if="isCheckingSwitch === '1'">

            </el-table-column>
            <el-table-column prop="workOrderFlag" label="是否生成工单" width="180">
              <template slot-scope="scope">
                <div v-if="scope.row.workOrderFlag == true">是</div>
                <div v-if="scope.row.workOrderFlag == false">否</div>
              </template>
            </el-table-column>
             <el-table-column label="操作" width="100" >
              <template slot-scope="scope" >
                <el-button type="text" @click="selectFun(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </JNPF-table>

        </div>

      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="customerVisible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" @click="submitFun()">
        提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getBimProcessList } from '@/api/bimProcess'
export default {
  data() {
    return {

      customerVisible: false,

      form: {
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        },],
        processingType:"external_production",
      },
      listLoading: false,
      tableDataList: [],
    }
  },
  async created () {
 
  },
  methods: {
    
    init() {
      this.customerVisible = true
      this.getProcessList()
    },
    selectProcess(val) {
      this.selectArr = val
    },
    dispurchaseData(row) {
      return row.workOrderFlag;
    },
    selectFun(row) {
     

    
      this.$emit("selectFun", row)
      this.customerVisible = false
    },
    handleRowClick(row) {
      this.$refs.processRef.$refs.JNPFTable.toggleRowSelection(row);
    },

    getProcessList(id) {

      this.listLoading = true
      getBimProcessList(this.form).then(res => {
        this.listLoading = false
        this.tableDataList=res.data.records
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.getProcessList()
    },
    reset() {
      this.form = {
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        },],
        processingType:"external_production",
      }
      this.search()
    },
  }
}
</script>
<style scoped>
.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 10px !important;
}

.selectProcess.JNPF-dialog_center ::v-deep .el-dialog .el-dialog__body {
  padding: 0 !important;
}
</style>
