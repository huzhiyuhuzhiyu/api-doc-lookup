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
            <el-table-column prop="productCode" label="产品编码" sortable="custom"></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" sortable="custom"></el-table-column>
            <el-table-column prop="orderNo" label="领料单号" sortable="custom"></el-table-column>
            <el-table-column prop="num" label="领料数量" sortable="custom"></el-table-column>
            <el-table-column prop="receiveType" label="领料类型" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.receiveType == 'order' ? '任务物料' : '工序物料' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="personId" label="领料人" sortable="custom"></el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="search" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { WithdrawalmxList } from '@/api/productOrdes/index.js'
export default {
  data() {
    return {
      customerVisible: false,

      form: {
        productCode: '',
        productDrawingNo: '',
        materialListId: this.id,
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          }
        ]
      },
      listLoading: false,
      total: 0,
      tableDataList: []
    }
  },
  async created() { },
  methods: {
    init(id) {
      this.id = id
      this.form.productsId = id
      this.customerVisible = true
      this.search()
    },

    search() {
      this.listLoading = true
      WithdrawalmxList(this.form).then((res) => {
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      })
    },

    reset() {
      this.form = {
        productCode: '',
        productDrawingNo: '',
        materialListId: this.id,
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          }
        ]
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
