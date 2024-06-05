<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.orderNo" placeholder="请输入工单号" clearable @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productionOrderNo" placeholder="请输入生产订单号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.workOrderNo" placeholder="请输入工作令号" clearable
                @keyup.enter.native="search()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                {{ $t('common.reset') }}
              </el-button>
            </el-form-item>
          </el-col>
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
            icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <JNPF-table v-loading="listLoading" highlight-current-row fixedNO ref="tableForm" :data="tableData"
          @sort-change="sortChange" custom-column>
          <el-table-column prop="orderNo" label="工单号" min-width="200" sortable="custom"  >
           <template slot-scope="scope">
            <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                scope.row.orderNo
              }}</el-link>
           </template>

          </el-table-column>
          <el-table-column prop="productName" label="产品名称" min-width="180"  />
          <el-table-column prop="productDrawingNo" label="产品图号" min-width="180"  />
          <el-table-column prop="processCode" label="工序编码" min-width="120"  />
          <el-table-column prop="processName" label="工序名称" min-width="120" sortable="custom"  />
          <el-table-column prop="productionOrderNo" label="生产订单号" min-width="180" />
          <!-- <el-table-column prop="workOrderNo" label="工作令号" min-width="120" /> -->
          <el-table-column prop="workOrderQuantity" label="订单生产数量" min-width="120" >
            <template slot-scope="scope">
              <div >{{ scope.row.workOrderQuantity? scope.row.workOrderQuantity:0}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="dispatchedQuantity" label="已派工数量" min-width="120" />
          <el-table-column prop="orderQuantity" label="外协下单数量" min-width="120" />
          <el-table-column prop="completedQuantity" label="完成数量" min-width="100" />
          <el-table-column prop="industrialWasteQuantity" label="工废数量" min-width="100" />
          <!-- <el-table-column prop="planStartDate" label="计划开始日期" width="180" sortable="custom" /> -->
          <!-- <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" /> -->
          <el-table-column prop="actualStartDate" label="实际开始时间" width="180" sortable="custom" />
          <el-table-column prop="actualEndDate" label="实际结束时间" width="180" sortable="custom" />
          <el-table-column prop="firstFlag" label="是否首道工序" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.firstFlag == '1'">是</div>
              <div v-else-if="scope.row.firstFlag == '0'">否</div>
            </template>
          </el-table-column>
          <el-table-column prop="stockFlag" label="是否入库" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.stockFlag == '1'">是</div>
              <div v-else-if="scope.row.stockFlag == '0'">否</div>
            </template>
          </el-table-column>
          <el-table-column prop="reportFlag" label="是否报工" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.reportFlag == '1'">是</div>
              <div v-else-if="scope.row.reportFlag == '0'">否</div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="pickingFlag" label="是否领料" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.pickingFlag == '1'">是</div>
              <div v-else-if="scope.row.pickingFlag == '0'">否</div>
            </template>
          </el-table-column> -->
          <el-table-column prop="firstInspection" label="是否首检" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.firstInspection == '1'">是</div>
              <div v-else-if="scope.row.firstInspection == '0'">否</div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="checkFlag" label="是否检验工序" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.checkFlag == '1'">是</div>
              <div v-else-if="scope.row.checkFlag == '0'">否</div>
            </template>
          </el-table-column> -->
          <el-table-column prop="lastFlag" label="是否末道工序" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.lastFlag == '1'">是</div>
              <div v-else-if="scope.row.lastFlag == '0'">否</div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="orderType" label="工单类型" min-width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.orderType == 'normal'">正常订单</div>
              <div v-else-if="scope.row.orderType == 'rework'">返工订单</div>
            </template>
          </el-table-column> -->
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" min-width="120" />
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <tableOpts :hasDel="false" @edit="handleUserRelation(scope.row.id, 'look')" :editText="'查看详情'" >
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="listQuery" label-position="top">
          <el-col :span="12">
            <el-form-item label="工单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入工单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产订单号">
              <el-input v-model="listQuery.productionOrderNo" placeholder="请输入生产订单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作令号">
              <el-input v-model="listQuery.workOrderNo" placeholder="请输入工作令号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="listQuery.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="listQuery.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序编码">
              <el-input v-model="listQuery.processCode" placeholder="请输入工序编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工序名称">
              <el-input v-model="listQuery.processName" placeholder="请输入工序名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始日期">
              <el-date-picker v-model="listQuery.planStartTime" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期"
                :picker-options="global.timePickerOptions.shortcuts" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划结束日期">
              <el-date-picker v-model="listQuery.planEndTime" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期"
                :picker-options="global.timePickerOptions.shortcuts" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际开始日期">
              <el-date-picker v-model="listQuery.actualStartTime" type="datetimerange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际结束日期">
              <el-date-picker v-model="listQuery.actualEndTime" type="datetimerange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择开始时间" end-placeholder="请选择结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.startAndEndTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="请选择开始时间" end-placeholder="请选择创建时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']" clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </span>
    </el-dialog>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />

  </div>
</template>
<script>
import { getWorkPage } from "@/api/productOrdes/index"
import Form from './Form'

export default {
  components: { Form, },

  data() {
    return {
      formVisible: false,
      visible: false,
      tableData: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        actualEed: "", // 实际结束-结束时间
        actualEsd: "", //	实际结束-开始时间
        actualSed: "", // 实际开工-结束时间
        actualSsd: "", // 实际开工-开始时间
        startTime: "",
        endTime: "",
        orderItems: [{
          asc: true,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        orderNo: "",
        orderType: "", // 订单类型 正常订单 normal、返工订单 rework
        demandType: "", // 需求类型 成品 finish_product、半成品 semi_finished
        pageNum: 1,
        pageSize: 20,
        planEed: "", // 计划结束-结束时间
        planEsd: "", // 计划结束-开始时间
        planSed: "", // 计划开工-结束时间
        planSsd: "", // 计划开工-开始时间
        processCode: "",
        processName: "",
        productCode: "",
        productDrawingNo: "",
        productName: "",
        productionOrderNo: "",
        workOrderNo: "",
        processingType: "",
        planStartTime: [],
        planEndTime: [],
        actualStartTime: [],
        actualEndTime: [],
        businessCode:"assemble",
        startAndEndTime: [],
      },
      total: 0,
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'processName') { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    initData() {
      this.listLoading = true
      getWorkPage(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      this.listLoading = true
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.searchTimeFormat("planStartTime", "planSsd", "planSed")
      this.searchTimeFormat("planEndTime", "planEsd", "planEed")
      this.searchTimeFormat("actualStartTime", "actualSsd", "actualSed")
      this.searchTimeFormat("actualEndTime", "actualEsd", "actualEed")
      this.searchTimeFormat("startAndEndTime", "startTime", "endTime")
      this.initData()
    },
    reset() {
      console.log(" this.$refs['tableForm'].$refs", this.$refs['tableForm'].$refs);
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.initData()
    },
    handleUserRelation(id,type){
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type)
      })
    },
    // 关闭明细页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) { this.initData() }
    },
    /**
     * 搜索日期格式化
     * @param {Array} dateArr - 日期数组
     * @param {String} startTime - 对应开始日期
     * @param {String} endTime - 对应结束日期
    **/
    searchTimeFormat(dateArr, startTime, endTime) {
      if (this.listQuery[dateArr] && this.listQuery[dateArr].length > 0) {
        this.listQuery[startTime] = this.listQuery[dateArr][0].replace(/ 0(?!0)/g, " ")
        this.listQuery[endTime] = this.listQuery[dateArr][1].replace(/ 0(?!0)/g, " ")
      } else {
        this.listQuery[startTime] = ""
        this.listQuery[endTime] = ""
      }
    }
  }
}
</script>
<style scoped>
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
</style>
  