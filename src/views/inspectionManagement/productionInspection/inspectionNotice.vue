<template>
  <div class="JNPF-common-layout">
    <!-- <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="派工单" name="dataTable"> -->
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
              <el-input v-model="listQuery.orderNo" placeholder="请输入派工单号" @keyup.enter.native="search()" clearable />
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
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange"
          custom-column>
          <el-table-column prop="productionOrderNo" label="任务单号" min-width="200" sortable="custom" />
          <!-- <el-table-column prop="workNo" label="工单单号" min-width="200" sortable="custom" /> -->
          <el-table-column prop="orderNo" label="工单单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, true)">
                {{ scope.row.orderNo }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="productDrawingNo" label="品名规格" min-width="120" />
          <el-table-column prop="processName" label="工序名称" min-width="120" />
          <el-table-column prop="processName" label="单位" min-width="120" />
          <el-table-column prop="productCode" label="生产数量" min-width="120" />
          <el-table-column prop="productName" label="合格数量" min-width="120" />

          <el-table-column prop="processCode" label="不合格数量" min-width="120" />

          <el-table-column prop="workOrderNo" label="责废数量" min-width="120" />
          <el-table-column prop="productionQuantity" label="料废数量" min-width="140" />
          <el-table-column prop="dispatchQuantity" label="利用数量" min-width="140" />
          <el-table-column prop="completedQuantity" label="返工数量" min-width="120" />
          <el-table-column prop="planStartDate" label="计划开始日期" width="180" sortable="custom" />
          <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" />
          <el-table-column prop="actualStartDate" label="打字内容" width="180" sortable="custom" />
          <el-table-column prop="actualEndDate" label="精度等级" width="180" sortable="custom" />
          <el-table-column prop="actualStartDate" label="振动等级" width="180" sortable="custom" />
          <el-table-column prop="actualEndDate" label="油脂" width="180" sortable="custom" />
          <el-table-column prop="actualStartDate" label="油脂量" width="180" sortable="custom" />
          <el-table-column prop="actualEndDate" label="游隙" width="180" sortable="custom" />
          <el-table-column prop="actualStartDate" label="包装方式" width="180" sortable="custom" />
          <el-table-column prop="actualEndDate" label="班组" width="180" sortable="custom" />
          <el-table-column prop="actualStartDate" label="人员" width="180" sortable="custom" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="180" sortable="custom" />
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
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row, true)">
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
    <!-- </el-tab-pane>
      </el-tabs>
    </div> -->

    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <DetailForm v-if="detailFormVisible" ref="DetailForm" @close="closeForm" :startingStatusList="startingStatusList"
      :workOrderStatusList="workOrderStatusList" />
  </div>
</template>

<script>

import { getWorkList } from '@/api/productOrdes/index'
import Form from '../components/inspectionNoticeForm.vue'
import DetailForm from '@/views/productionOrders/dispatchTicketInquiry/finish_product/Form.vue'
// import DetailForm from './DetailForm.vue'
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
        finishFlag: 0,
        documentStatus: 'submit',
        processingType: 'self_produced',
        orderItems: [{
          "asc": false,
          "column": ""
        }, {
          "asc": false,
          "column": "create_time"
        }],
        pageNum: 1,
        pageSize: 20,

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
    addOrUpdateHandle(row, readOnly) {
      if (readOnly) {
        this.detailFormVisible = true
        console.log(id);
        this.$nextTick(() => { this.$refs.DetailForm.init(id, readOnly) })
      } else {
        this.formVisible = true
        this.$nextTick(() => { this.$refs.Form.init(row, readOnly, 'process', 'notice','QCDH') })
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