<template>

  <el-dialog title="选择任务物料" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectProcess" width="70%" append-to-body
    @close="customerVisible = false">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="orderForm.productDrawingNo" placeholder="品名规格" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="orderForm.productCode" placeholder="产品编码" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="orderForm.processName" placeholder="工序名称" clearable
                  @keyup.enter.native="search()" />
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
          <JNPF-table v-loading="listLoading" :data="tableDataList" :fixedNO="true" @selection-change="selectmaterial"
            @row-click="handleRowClick" hasC>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="140"></el-table-column>
            <el-table-column prop="productCode" label="产品编码" min-width="140"></el-table-column>
            <el-table-column prop="processName" label="工序名称" min-width="140" />
            <el-table-column prop="mainUnit" label="单位" min-width="140" />
            <el-table-column prop="materialsUsedQuantity" label="投料数量" min-width="140" />
            <el-table-column prop="waitReceiveQuantity" label="待领料数量" min-width="140" />

          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="getMaterialListFun" />
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="customerVisible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" @click="submitFun()">
        确认</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { ordershengchanList, addOrderNum, detailordershengchan, getMaterialList,ordermaterialList } from '@/api/productOrdes/index.js'
export default {
  data() {
    return {
      orderTypeList: [
        { label: "正常任务", value: "normal" },
        { label: "返工任务", value: "rework" },
      ],
      customerVisible: false,

      orderForm: {
        productDrawingNo: "",
        productCode: "",
        processName: "",
        pageNum: 1,
        pageSize: 20,
        productionOrderId:"",
        reduceType: "picking",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      listLoading: false,
      total: 0,
      tableDataList: [],
      id: "",
      selectArr:[],
    }
  },
  methods: {
    init(id) {
      this.customerVisible = true
      this.orderForm.productionOrderId = id
      this.getMaterialListFun()
    },
    selectmaterial(val){
      this.selectArr = val

    },
     
    submitFun () {
     
     this.$emit('selectOrderMaterial',this.selectArr)
     this.customerVisible = false

      // this.productData=[...this.productData,...this.selectArr]
    },
 
    getMaterialListFun() {
      this.listLoading = true
      ordermaterialList(this.orderForm).then(res => {
        console.log("生产详情", res);
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.getMaterialListFun( )
    },
    reset() {
      this.form = {
        productsDrawingNo: "",
        productCode: "",
        processName: "",
        reduceType: "picking",
        pageNum: 1,
        pageSize: 20,
        productionOrderId: this.orderForm.productionOrderId,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      }
      this.getMaterialListFun()
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
