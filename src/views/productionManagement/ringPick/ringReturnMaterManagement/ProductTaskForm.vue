<template>

  <el-dialog title="选择生产任务" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="customerVisible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center selectProcess" width="70%" append-to-body
    @close="customerVisible = false">

    <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="orderForm.orderNo" placeholder="生产任务单号" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-select v-model="orderForm.orderType" placeholder="生产任务类型" style="width: 100%;">
                  <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-input v-model="orderForm.productDrawingNo" placeholder="型号" clearable
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
          <JNPF-table v-loading="listLoading" :data="tableDataList" :fixedNO="true" customKey="JNPFTableKey_941850">
            <el-table-column prop="orderNo" label="生产任务单号" min-width="200" sortable="custom"> </el-table-column>
            <el-table-column prop="orderType" label="生产任务类型" min-width="160" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.orderType == 'normal'">正常任务</div>
                <div v-if="scope.row.orderType == 'rework'">返工任务</div>
                <div v-if="scope.row.orderType == 'manually'">新建任务</div>
                <div v-if="scope.row.orderType == 'flipping'">翻库任务</div>
                <div v-if="scope.row.orderType == 'transit'">在制任务</div>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
              v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="productDrawingNo" label="型号" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="mainUnit" label="单位" width="80" />
            <el-table-column prop="productionQuantity" label="生产数量" min-width="140" sortable="custom" />
            <el-table-column prop="planStartDate" label="计划开始日期" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="planEndDate" label="计划结束日期" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom"></el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="selectFun(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="getbatchNumList(id)" />
        </div>
      </div>
    </div>

  </el-dialog>
</template>
<script>
import { ordershengchanList, addOrderNum } from '@/api/productOrdes/index.js'
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  mixins: [getProjectList],
  data() {
    return {
      orderTypeList: [
        { label: "正常任务", value: "normal" },
        { label: "返工任务", value: "rework" },
      ],
      customerVisible: false,

      orderForm: {
        productsDrawingNo: "",
        productionPlanNo: "",
        orderType: "",
        pageNum: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        classAttribute: "semi_finished",
        pickingStatus: "not_finished",
        orderStatus: "normal",
        materialFlag: 1,

      },
      listLoading: false,
      total: 0,
      tableDataList: [],
      isProjectSwitch: "",
      id: "",
      isProductNameSwitch: "",

    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')

    await this.getProductNameSwitch('product', 'enable_productName')


  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    init(id) {
      this.id = id
      this.customerVisible = true
      this.getbatchNumList(id)
    },
    // 选择批次
    selectFun(row) {
      this.$emit("selectProductTask", row,)
      this.customerVisible = false
    },
    getbatchNumList(id) {
      this.listLoading = true
      this.orderForm.projectId = id
      ordershengchanList(this.orderForm).then(res => {
        console.log("工艺路线", res);
        this.tableDataList = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },

    search() {
      this.getbatchNumList(this.id)
    },
    reset() {
      this.form = {
        code: "",
        name: "",
        documentStatus: "submit",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        },],
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
