<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName">
        <el-tab-pane label="单据列表" name="dataTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.orderNo" placeholder="请输入处理单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.inspectionOrderNo" placeholder="请输入检验单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="listQuery.createTimeArr" type="datetimerange"
                      value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;" start-placeholder="请选择创建开始时间"
                      end-placeholder="请选择创建结束时间" :picker-options="global.timePickerOptions"
                      :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
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
              <div class="JNPF-common-head">
                <el-page-header @back="$emit('close', true)" :content="'报废入库'" />
                <el-button size="mini" @click="handleBatch" type="primary">批量入库</el-button>
              </div>
              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
                @sort-change="sortChange" custom-column hasC @selection-change="currentChange">
                <el-table-column prop="orderNo" label="处理单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="inspectionOrderNo" label="检验单号" min-width="200" sortable="custom" />
                <el-table-column prop="inspectorName" label="检验人" min-width="120" />
                <el-table-column prop="inspectionDate" label="检验日期" width="180" sortable="custom" />
                <el-table-column prop="description" label="处理说明" min-width="180" />
                <el-table-column prop="remark" label="备注" min-width="200" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" min-width="120" />
                <el-table-column label="操作" width="140" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.id)" :editText="'入库'" :hasDel="false">
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
        </el-tab-pane>
        <el-tab-pane label="明细列表" name="linesTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.orderNo" placeholder="请输入处理单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.inspectionOrderNo" placeholder="请输入检验单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="linesQuery.treatmentResults" placeholder="请选择处理结果" clearable style="width: 100%;">
                      <el-option v-for="item in inspectionResultsList.filter(o => !o.disabled)" :key="item.value"
                        :label="item.label" :value="item.value"></el-option>
                    </el-select>
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
              <div class="JNPF-common-head">
                <el-page-header @back="$emit('close', true)" :content="'报废入库'" />
                <el-button size="mini" @click="handleBatch" type="primary">批量入库</el-button>
              </div>

              <JNPF-table ref="linesDataTable" v-loading="listLoading" :data="linesTableData" fixedNO
                @sort-change="sortChange" custom-column hasC @selection-change="currentChange">
                <el-table-column prop="orderNo" label="处理单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.unqualifiedId, true)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="inspectionOrderNo" label="检验单号" min-width="200" sortable="custom" />
                <el-table-column prop="description" label="处理说明" min-width="180" />
                <el-table-column prop="productCode" label="产品编码" min-width="120" />
                <el-table-column prop="productName" label="产品名称" min-width="120" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="400" sortable="custom" />
                <el-table-column prop="routingName" label="工艺路线名称" min-width="140" />
                <el-table-column prop="processName" label="工序名称" min-width="120" />
                <!-- <el-table-column prop="inspectionQuantity" label="报检数量" min-width="120" />
                <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="120" />
                <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="120" /> -->
                <el-table-column prop="deliveryQuantity" label="待入库数量" min-width="120" />
                <el-table-column prop="mainUnit" label="单位" min-width="120" />
                <el-table-column prop="treatmentResults" label="处理结果" min-width="120" sortable="custom"
                  :formatter="treatmentResultsFormat" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" min-width="120" />
                <el-table-column label="操作" width="140" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.unqualifiedId)" editText="入库" :hasDel="false">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.unqualifiedId, true)">
                            查看详情
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </tableOpts>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="linesTotal" :page.sync="linesQuery.pageNum" :limit.sync="linesQuery.pageSize"
                @pagination="initData" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
    <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1000px">
      <el-row :gutter="20">
        <!-- 明细表 -->
        <el-form v-model="linesQuery" label-width="120px" label-position="top">
          <el-col :span="12">
            <el-form-item label="处理单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入检验单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验单号">
              <el-input v-model="linesQuery.inspectionOrderNo" placeholder="请输入检验单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="linesQuery.productCode" placeholder="请输入产品编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="linesQuery.productName" placeholder="请输入产品名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品图号">
              <el-input v-model="linesQuery.productDrawingNo" placeholder="请输入产品图号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理结果">
              <el-select v-model="linesQuery.treatmentResults" placeholder="请选择处理结果" clearable style="width: 100%;">
                <el-option v-for="item in inspectionResultsList.filter(o => !o.disabled)" :key="item.value"
                  :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="linesQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']">
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
    <Form v-if="formVisible" ref="Form" @close="closeForm" :originTypeList="originTypeList" />
    <DetailForm v-if="detailFormVisible" ref="DetailForm" @close="closeForm" />
  </div>
</template>

<script>
import { getQcUnqualifiedList, deleteQcUnqualifiedData, getQcUnqualifiedLinesList } from '@/api/inspectionManagement/index' // 检验单

import Form from '../Form.vue'
import DetailForm from '@/views/inspectionManagement/components/defectiveProductHandlingForm.vue'

export default {
  components: { Form, DetailForm },
  props: {
    originTypeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      activeName: "dataTable",
      tableData: [],
      listLoading: false,
      inspectionResultsList: [
        { label: '合格', value: 'qualified', disabled: true },
        { label: '不合格', value: 'unqualified', disabled: true },
        { label: '让步接收', value: 'concessive_acceptance', disabled: true },
        { label: '报废', value: 'discard' },
        { label: '挑选', value: 'select' }
      ],
      approvalStatusList: [{ label: "审批中", value: "ing" }, { label: "审批通过", value: "ok" }, { label: "审批拒绝", value: "rebut" }],
      inspectionMethodList: [{ label: '全检', value: 'all' }, { label: '抽检', value: 'spot_check' }],
      listQuery: {},
      initListQuery: {
        scrapReceiptStatus: "not_received",
        documentStatus: 'submit',
        approvalStatus: "ok",
        createByName: "",
        inspectionOrderNo: "",
        notificationType: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        showScrap: true,
        createTimeArr: []
      },
      linesTableData: [],
      linesQuery: {},
      linesTotal: 0,
      initLinesQuery: {
        scrapReceiptStatus: "not_received",
        documentStatus: 'submit',
        approvalStatus: "ok",
        createByName: "",
        inspectionOrderNo: "",
        documentType: "inbound", // 单据类型
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        orderNo: "",
        pageNum: 1,
        pageSize: 20,
        createTimeArr: [], // 创建时间
        showScrap: true,
      },
      total: 0,
      formVisible: false,
      detailFormVisible: false,
      selectedData: [],
      linesSelectedData: [],
    }
  },
  watch: {
    activeName() {
      this.selectedData = []
      this.linesSelectedData = []
      this.initData()
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery));
    this.initData()
  },
  methods: {
    initData() {
      this.listLoading = true
      if (this.activeName === 'dataTable') {
        getQcUnqualifiedList(this.listQuery).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        getQcUnqualifiedLinesList(this.linesQuery).then(res => {
          this.linesTableData = res.data.records.map(row => ({
            ...row,
            deliveryQuantity: this.jnpf.math('subtract', [row.scrapQuantity, row.scrapReceiptQuantity]) // 入库数量 = 报废数量 - 报废已入库数量
          }))
          this.linesTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => { this.listLoading = false })
      }
    },
    search() {
      this.listLoading = true
      if (this.activeName === 'dataTable') {
        this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
        Object.keys(this.listQuery).forEach(key => {
          let item = this.listQuery[key]
          this.listQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.listQuery.pageNum = 1
      } else {
        this.jnpf.searchTimeFormat(this.linesQuery, 'createTimeArr', 'startTime', 'endTime')
        Object.keys(this.linesQuery).forEach(key => {
          let item = this.linesQuery[key]
          this.linesQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.linesQuery.pageNum = 1
      }
      this.initData()
    },
    reset() {
      if (this.activeName === 'dataTable') {
        this.$refs['dataTable'].$refs.JNPFTable.clearSort()
        this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
      } else {
        this.$refs['linesDataTable'].$refs.JNPFTable.clearSort()
        this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery));
      }
      this.initData()
    },
    addOrUpdateHandle(id, readOnly) {
      if (readOnly) {
        this.detailFormVisible = true
        this.$nextTick(() => { this.$refs.DetailForm.init(id, 'look', 'produce') })
      } else {
        this.formVisible = true
        this.$nextTick(() => { this.$refs.Form.init(id, readOnly, 'inbound_scrap') })
      }
    },
    currentChange(val) {
      if (this.activeName === 'dataTable') {
        this.selectedData = val
      } else {
        this.linesSelectedData = val
      }
    },
    handleBatch() {
      if (this.activeName === 'dataTable') {
        if (!this.selectedData.length) return this.$message.error('请先选择要入库的数据')
        this.formVisible = true
        this.$nextTick(() => { this.$refs.Form.init(this.selectedData, false, 'inbound_scrap_batch') })
      } else {
        if (!this.linesSelectedData.length) return this.$message.error('请先选择要入库的数据')
        this.formVisible = true
        this.$nextTick(() => { this.$refs.Form.init(this.linesSelectedData, false, 'inbound_scrap_batch') })
      }
    },
    sortChange({ prop, order }) {
      let newProp
      if (this.activeName === 'dataTable') {
        if (['inspectorName', 'inspectionOrderNo'].includes(prop)) { newProp = prop }
        else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (['partnerCode', 'partnerName', 'productName', 'createTime', 'orderNo', 'inspectionOrderNo', 'productDrawingNo'].includes(prop)) { newProp = prop }
        else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.linesQuery.orderItems[0].asc = order === 'ascending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      this.detailFormVisible = false
      if (isRefresh) { this.initData() }
    },

    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteQcUnqualifiedData(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    sourceTypeFormatter(row) {
      let data = this.originTypeList.find(item => item.value === row.sourceType)
      return data ? data.label : row.sourceType
    },
    treatmentResultsFormat(row) {
      let option = this.inspectionResultsList.find(item => item.value === row.treatmentResults)
      return option ? option.label : row.treatmentResults
    }
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />