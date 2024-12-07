<template>

  <el-dialog title="报工记录" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectProcess" width="70%" append-to-body
    @close="customerVisible = false">

    <div class="JNPF-common-layout" style="height:600px;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <!-- <el-col :span="4">
              <el-form-item>
                <el-input v-model="form.workNo" placeholder="工单单号" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col> -->

            <el-col :span="4">
              <el-form-item>
                <el-input v-model="form.orderNo" placeholder="报工单号" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="form.productDrawingNo" placeholder="品名规格" clearable @keyup.enter.native="search()" />
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
          <JNPF-table v-loading="listLoading" :data="tableDataList" :fixedNO="true">
            <el-table-column prop="productionOrderNo" label="任务单号" min-width="180" sortable="custom" />
            <el-table-column prop="workNo" label="工单单号" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="orderNo" label="报工单号" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="productCode" label="产品编码" min-width="160" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
            v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="300" sortable="custom"></el-table-column>
            <el-table-column prop="productCategoryName" label="产品分类" min-width="120" sortable="custom" />
            <el-table-column prop="processName" label="工序名称" width="160" sortable="custom" />
            <el-table-column prop="reportingTime" label="报工时间" min-width="160" sortable="custom" />
            <el-table-column prop="producerName" label="生产人" min-width="160" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" min-width="160" />
            <el-table-column prop="reportingQuantity" label="报工数量" min-width="160" sortable="custom" />
            <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="160" sortable="custom" />
            <el-table-column prop="responsibilityWasteQuantity" label="责废数量" min-width="160" sortable="custom" />
            <el-table-column prop="materialWasteQuantity" label="料废数量" min-width="160" sortable="custom" />
            <el-table-column prop="reworkQuantity" label="返工数量" min-width="160" sortable="custom" />
            <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" sortable="custom" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom"></el-table-column>


          </JNPF-table>
          <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize"
            @pagination="getrecordsList" />
        </div>
      </div>
    </div>

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
      isProductNameSwitch:"",


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
::v-deep .el-table__body-wrapper{
  height: 100%;
}
</style>
