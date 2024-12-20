<template>

  <el-dialog title="设置料废金额" :close-on-click-modal="false" :close-on-press-escape="false" @close="setcodeVisible = false"
    :visible.sync="setcodeVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
    append-to-body>

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

      <div class="JNPF-common-layout-center JNPF-flex-main" style="background-color: #fff;overflow-y:auto ;">

        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table v-loading="listLoading" :data="tableDataList" :fixedNO="true">
            <el-table-column prop="parentId" label="类型" min-width="180" sortable="custom">
              <template slot-scope="scope">
                <el-select v-model="currentProcess.producerName" placeholder="类型" style="width: 100%;" class="ipt">
                  <el-option v-for="(item, index) in personList" :key="index" :label="item.label"
                    :value="item.id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="workNo" label="数量" min-width="180" sortable="custom">
              <template slot-scope="scope">
                <el-input ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="amount" label="金额" min-width="180" sortable="custom"></el-table-column>
          </JNPF-table>
        
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click=" setcodeVisible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="submitCodeFun()">
        确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getWorkReportList } from "@/api/productOrdes/index.js"
export default {
  data() {
    return {

      customerVisible: false,

      form: {
        productDrawingNo: "",
        orderNo: "",
        workNo: "",
        pageNum: 1,
        pageSize: 20,
        documentStatus: "submit",
        orderItems: [{
          asc: false,
          column: ""
        },],

      },
      listLoading: false,
      total: 0,
      tableDataList: [],
      isProductNameSwitch: "",


    }
  },
  async created() {
    await this.getProductNameSwitch('product', 'enable_productName')

  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    init(data) {
      this.form.workNo = data
      this.customerVisible = true
      this.getrecordsList()
    },
    // 选择批次
    selectFun(row) {
      this.$emit("selectRouting", row,)
      this.customerVisible = false
    },
    getrecordsList() {
      this.listLoading = true
      getWorkReportList(this.form).then(res => {
        console.log("报工记录", res);
        // res.data.records.forEach(item => {
        //   item.selectFlag = false
        // })
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    search() {
      this.getrecordsList()
    },
    reset() {
      this.form = {
        productDrawingNo: "",
        orderNo: "",
        workNo: "",
        pageNum: 1,
        pageSize: 20,
        documentStatus: "submit",
        orderItems: [{
          asc: false,
          column: ""
        },],
      }
      this.getrecordsList()
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

::v-deep .el-table__body-wrapper {
  height: 100%;
}
</style>
