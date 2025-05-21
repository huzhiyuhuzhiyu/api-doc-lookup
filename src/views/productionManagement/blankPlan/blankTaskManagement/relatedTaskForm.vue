<template>

  <el-dialog title="选择关联任务" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="locationVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body
    @close="locationVisible = false">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
          

            <el-col :span="6">
              <el-form-item>
                <el-input v-model="tableQuery.orderNo" placeholder="生产任务单号" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="tableQuery.productDrawingNo" placeholder="品名规格" clearable
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

          <JNPF-table ref="tabForm" v-loading="listLoading" :data="tableDataList" row-key="id" :fixedNO="true"
            @sort-change="sortChange" custom-column customKey="JNPFTableKey_655628">
            <el-table-column prop="productionPlanNo" label="计划单号" min-width="180">
            </el-table-column>
            <el-table-column prop="orderNo" label="任务单号" min-width="180" >
            </el-table-column>
            <el-table-column prop="orderType" label="任务类型" min-width="120" >
              <template slot-scope="scope">
                <div v-if="scope.row.orderType == 'normal'">正常任务</div>
                <div v-if="scope.row.orderType == 'rework'">返工任务</div>
              </template>
            </el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="300" ></el-table-column>
            <el-table-column prop="productionQuantity" label="总生产数量" min-width="120"  />
            <el-table-column prop="completedQuantity" label="已完成数量" min-width="120"  />
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="seleceWareHouseFun(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="tableQuery.pageNum" :limit.sync="tableQuery.pageSize"
            @pagination="getOrderFun" />
        </div>
      </div>
    </div>

  </el-dialog>
</template>
<script>
import { getLocationList } from '@/api/warehouseManagement/inventory'
import { ordershengchanList, addOrderNum, detailordershengchan } from '@/api/productOrdes/index.js'
export default {
  data() {
    return {
      tableDataList: [],
      locationVisible: false,
      listLoading: false,
      tableQuery: {
        productDrawingNo: "",
        orderNo: "",
        productionPlanNo: "",
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        classAttribute: "raw_material",
        pageNum: 1,
        pageSize: 20,
      },
      total: 0,
      expands: true,
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      cpId: "",
      type: "",
      planNo:"",
    }
  },
  methods: {
    sortChange({ prop, order }) {
      const newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      this.tableQuery.orderItems[0].asc = order === 'ascending'
      this.tableQuery.orderItems[0].column = newProp
      this.initData()
    },
    init(data) {
      this.listLoading = true
      this.locationVisible = true
      this.planNo=data
      this.tableQuery.productionPlanNo=data
      this.getOrderFun()
      this.$nextTick(() => { this.$refs.product.doLayout() })

    },
    getOrderFun(){
      ordershengchanList(this.tableQuery).then(res => {
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(error => [
        this.listLoading = false
      ])
    },
    search(){
      this.getOrderFun()
    },
    // 选择客户
    seleceWareHouseFun(row) {
      this.$emit("selectRelatedTasksFun", row)
      this.locationVisible = false
    },




    search() {
      this.getOrderFun()
    },
    reset() {
      this.tableQuery = {
        productDrawingNo: "",
        orderNo: "",
        productionPlanNo: this.planNo,
        orderItems: [
          {
            asc: true,
            column: ''
          }
        ],
        classAttribute: "raw_material",
        pageNum: 1,
        pageSize: 20,
      },
        this.getOrderFun()
    },
  }
}
</script>