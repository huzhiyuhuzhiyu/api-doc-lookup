<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productionOrderNo" placeholder="请输入生产订单号" @keyup.enter.native="search()"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.workNo" placeholder="请输入工单号" @keyup.enter.native="search()" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productDrawingNo" placeholder="请输入产品图号" @keyup.enter.native="search()" clearable />
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
          <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
            @click="visible = true">更多查询</el-button>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange"
          custom-column>
          <el-table-column prop="productionOrderNo" label="生产订单号" min-width="200" sortable="custom" />
          <el-table-column prop="orderNo" label="工单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">
                {{ scope.row.orderNo }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="customerProductNo" label="客户物料号" min-width="120" />
          <el-table-column prop="productCode" label="产品编码" min-width="120" />
          <el-table-column prop="productName" label="产品名称" min-width="120" />
          <el-table-column prop="productDrawingNo" label="产品图号" min-width="120" />
          <el-table-column prop="processCode" label="工序编码" min-width="120" />
          <el-table-column prop="processName" label="工序名称" min-width="120" />
          <!-- <el-table-column prop="workOrderNo" label="工作令号" min-width="120" /> -->
          <el-table-column prop="productionQuantity" label="订单生产数量" min-width="140" />
          <el-table-column prop="dispatchQuantity" label="派工生产数量" min-width="140" />
          <el-table-column prop="completedQuantity" label="完工数量" min-width="120" />
          <el-table-column prop="planStartDate" label="计划开始日期" width="180" sortable="custom" />
          <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" />
          <el-table-column prop="actualStartDate" label="实际开始日期" width="180" sortable="custom" />
          <el-table-column prop="actualEndDate" label="实际结束日期" width="180" sortable="custom" />
          <!-- <el-table-column prop="startingStatus" label="开工状态" width="120" align="center" fixed="right"
            sortable="custom">
            <template slot-scope="scope">
              <el-tag type="warning" disable-transitions v-if="scope.row.startingStatus === 'not_started'">未开工</el-tag>
              <el-tag type="primary" disable-transitions
                v-else-if="scope.row.startingStatus === 'in_progress'">开工中</el-tag>
              <el-tag type="success" disable-transitions
                v-else-if="scope.row.startingStatus === 'finished'">已完工</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row)" editText="检验" :hasDel="false">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true)">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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
        <el-form ref="diaForm" :model="listQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="生产订单号">
              <el-input v-model="listQuery.productionOrderNo" placeholder="请输入生产订单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入工单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户物料号">
              <el-input v-model="listQuery.customerProductNo" placeholder="请输入客户物料号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="listQuery.productCode" placeholder="请输入产品编码" clearable />
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
            <el-form-item label="工作令号">
              <el-input v-model="listQuery.workOrderNo" placeholder="请输入工作令号" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="开工状态">
              <el-select v-model="listQuery.startingStatus" placeholder="请选择开工状态" filterable clearable>
                <el-option v-for="(item, index) in startingStatusList" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </span>
    </el-dialog>
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <DetailForm v-if="detailFormVisible" ref="DetailForm" @close="closeForm" :startingStatusList="startingStatusList"
      :workOrderStatusList="workOrderStatusList" />
  </div>
</template>

<script>
import { getWorkList } from '@/api/productOrdes/index'
import Form from '../components/inspectionNoticeForm.vue'
import DetailForm from './DetailForm.vue'
export default {
  components: { Form, DetailForm },
  data() {
    return {
      visible: false,
      detailFormVisible: false,
      activeName: "dataTable",
      tableData: [],
      listLoading: false,
      startingStatusList: [{ label: '未开工', value: 'not_started' }, { label: '开工中', value: 'in_progress' }, { label: '已完工', value: 'finished' }], // 开工状态
      workOrderStatusList: [{ label: '正常', value: 'normal' }, { label: '暂停', value: 'suspend' }, { label: '关闭', value: 'closed' }, { label: '已完成', value: 'finish' }], // 派工单状态
      listQuery: {},
      initListQuery: {
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        actualEed: "",
        actualEsd: "",
        actualSed: "",
        actualSsd: "",
        businessCode: "",
        cooperativePartnerId: '',
        createByName: "",
        demandType: "",
        endTime: "",
        endUpdateTime: "", 
        keyword: "",
        orderNo: "",
        orderType: "",
        pageNum: 1,
        pageSize: 20,
        planEed: "",
        planEsd: "",
        planSed: "",
        planSsd: "",
        processCode: "",
        processInspectFlag: true,
        processName: "",
        processingType: "",
        prodOrderStatus: "",
        productCode: "",
        productDrawingNo: "",
        productName: "",
        productionOrderNo: "",
        receiveStatus: "",
        startTime: "",
        startUpdateTime: "",
        stationTerminalCode: "",
        totalRowFlag: false,
        workOrderNo: "",
        businessCode: 'complete',
      },
      total: 0,
      formVisible: false,
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    initData() {
      this.listLoading = true
      getWorkList(this.listQuery).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search() {
      Object.keys(this.listQuery).forEach(key => {
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listQuery.pageNum = 1
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.search()
    },
    addOrUpdateHandle(id, readOnly) {
      if (readOnly) {
        this.detailFormVisible = true
        this.$nextTick(() => { this.$refs.DetailForm.init(id, 'look') })
      } else {
        this.formVisible = true
        this.$nextTick(() => { this.$refs.Form.init(id, readOnly, 'process', 'notice', 'complete') })
      }
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productionOrderNo' || prop === 'workNo') { newProp = prop }
      else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      this.detailFormVisible = false
      if (isRefresh) { this.initData() }
    },
    handleClick(e) {

    },
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />