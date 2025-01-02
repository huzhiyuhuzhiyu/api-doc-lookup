<template>
  <el-dialog title="查看领料明细" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectProcess" width="70%" append-to-body
    @close="customerVisible = false">
    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main" v-loading="listLoading">
        <!-- <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="form.productCode" placeholder="产品编码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="form.productDrawingNo" placeholder="品名规格" clearable />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                  {{ $t('common.search') }}
                </el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row> -->
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <JNPF-table :data="tableDataList" :fixedNO="true">
            <el-table-column prop="orderNo" label="任务单号" width="180" />
            <el-table-column prop="orderType" label="任务类型" width="120">
              <template slot-scope="scope">
                <div v-for="(item, index) in orderTypeList" :key="index">
                  <span v-if="item.value == scope.row.orderType">{{ item.label }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称" v-if="isProductNameSwitch === '1'" min-width="160"
              sortable="custom" />
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="160" />
            <el-table-column prop="pairingModeName" label="配对方式" width="160" sortable="custom" />

            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
              v-if="isProjectSwitch == 1" />
            <el-table-column prop="mainUnit" label="单位" width="80" />
            <el-table-column prop="productionQuantity" label="生产数量" width="120" />
            <el-table-column prop="completedQuantity" label="已完成数量" width="130" />
            <el-table-column prop="waitReceivedQuantity" label="待入库数量" width="160" />
            <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" sortable="custom"
              v-if="sealingCoverTypingFlag == 1" />
            <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom"
              v-if="accuracyLevelFlag == 1" />
            <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"
              v-if="vibrationLevelFlag == 1" />
            <el-table-column prop="oil" label="油脂" width="100" sortable="custom" v-if="oilFlag == 1" />
            <!-- <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom" v-if="oilQuantityFlag == 1" /> -->
            <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" v-if="clearanceFlag == 1" />
            <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"
              v-if="packagingMethodFlag == 1" />
            <el-table-column prop="specialRequire" label="特殊要求" width="120" sortable="custom"
              v-if="specialRequireFlag == 1" />
            <el-table-column v-if="classAttribute == 'finish_product'" prop="createTime" label="创建时间" width="180" />
            <el-table-column v-if="classAttribute == 'semi_finished'" prop="createByName" label="创建人" width="180" />
          </JNPF-table>
          <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="search" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { ordershengchanList } from '@/api/productOrdes/index.js'
export default {
  data() {
    return {
      customerVisible: false,

      form: {
        orderNo: "",
        orderType: "",
        orderTypeList: ['normal', 'rework', 'manually'],
        productsId: '',
        productDrawingNo: "",
        stockFlag: true,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      },
      listLoading: false,
      total: 0,
      tableDataList: []
    }
  },
  async created() { },
  methods: {
    init(productDrawingNo) {
      this.productDrawingNo = productDrawingNo
      this.form.productDrawingNo = productDrawingNo
      this.customerVisible = true
      this.search()
    },

    search() {
      this.listLoading = true
      ordershengchanList(this.form).then((res) => {
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      })
    },

    reset() {
      this.form = {
        orderNo: "",
        orderType: "",
        orderTypeList: ['normal', 'rework', 'manually'],
        productsId: '',
        productDrawingNo: this.productDrawingNo,
        stockFlag: true,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
      }
      this.search()
    }
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
