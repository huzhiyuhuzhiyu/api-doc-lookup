<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName">
        <!-- 主表 -->
        <el-tab-pane label="单据列表" name="dataTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.orderNo" placeholder="请输入检验单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.originOrderNo" placeholder="请输入来源单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="listQuery.inspectorName" placeholder="请输入检验人" @keyup.enter.native="search()"
                      clearable />
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
              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
                @sort-change="sortChange" custom-column>
                <el-table-column prop="orderNo" label="检验单号" min-width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.id, true, scope.row)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="originOrderNo" label="来源单号" min-width="200" />
                <el-table-column prop="inspectorName" label="检验人" min-width="120" sortable="custom" />
                <el-table-column prop="inspectionDate" label="检验日期" width="120" sortable="custom" />
                <el-table-column prop="reasonRejection" label="驳回理由" min-width="120" />
                <el-table-column prop="approvalCompletionDate" label="审批完成时间" width="180" sortable="custom" />
                <el-table-column prop="submitDate" label="提交时间" min-width="180" sortable="custom" />
                <el-table-column prop="unqualifiedFlag" label="是否有不合格" min-width="140">
                  <template slot-scope="scope">{{ scope.row.unqualifiedFlag ? '是' : '否' }}</template>
                </el-table-column>
                <el-table-column prop="handleFlag" label="不合格是否处理" min-width="140">
                  <template slot-scope="scope">{{ scope.row.handleFlag ? '是' : '否' }}</template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="200" />
                <el-table-column prop="createByName" label="创建人" min-width="120" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom" align="center"
                  fixed="right">
                  <template slot-scope="scope">
                    <el-tag type="warning" disable-transitions v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
                    <el-tag type="success" disable-transitions
                      v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" align="center"
                  fixed="right">
                  <template slot-scope="scope">
                    <el-tag type="warning" disable-transitions
                      v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus !== 'draft'">审批中</el-tag>
                    <el-tag type="success" disable-transitions
                      v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus !== 'draft'">审批通过</el-tag>
                    <el-tag type="danger" disable-transitions
                      v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus !== 'draft'">审批拒绝</el-tag>
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.id)" @del="handleDel(scope.row.id)"
                      :editDisabled="scope.row.documentStatus === 'submit'"
                      :delDisabled="scope.row.documentStatus === 'submit'">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.id, true, scope.row)">
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
        <!-- 明细表 -->
        <el-tab-pane label="明细列表" name="linesTable">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.orderNo" placeholder="请输入检验单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.originOrderNo" placeholder="请输入来源单号" @keyup.enter.native="search()"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.inspectorName" placeholder="请输入检验人" @keyup.enter.native="search()"
                      clearable />
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
              <JNPF-table ref="linesDataTable" v-loading="listLoading" :data="linesTableData" :fixedNO="true"
                @sort-change="sortChange" custom-column  :partentOrChild="'child'">
                <el-table-column prop="orderNo" label="检验单号" min-width="200" sortable="custom" fixed="left">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="addOrUpdateHandle(scope.row.inspectionId, true, scope.row)">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="originOrderNo" label="来源单号" min-width="200" sortable="custom" fixed="left" />
                <el-table-column prop="inspectorName" label="检验人" min-width="120" sortable="custom" fixed="left" />
                <el-table-column prop="inspectionDate" label="检验日期" width="120" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" min-width="120" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" min-width="120" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" min-width="400" sortable="custom" />
                <el-table-column prop="routingName" label="工艺路线名称" min-width="140" v-if="pageData.showRouting" />
                <el-table-column prop="processName" label="工序名称" min-width="120" v-if="pageData.showProcess" />
                <el-table-column prop="inspectionMethod" label="检验方式" min-width="120"
                  :formatter="inspectionMethodFormatter" />
                <el-table-column prop="inspectionQuantity" label="报检数量" min-width="120" />
                <el-table-column prop="mainUnit" label="单位" min-width="120" />
                <el-table-column prop="inspectionResults" label="检验结果" min-width="120" sortable="custom"
                  :formatter="inspectionResultsFormatter" />
                <el-table-column prop="samplingQuantity" label="检验数量" min-width="120" />
                <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="120" />
                <el-table-column prop="remark" label="备注" min-width="200" />
                <el-table-column prop="createByName" label="创建人" min-width="120" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <tableOpts @edit="addOrUpdateHandle(scope.row.inspectionId)"
                      @del="handleDel(scope.row.inspectionId)" :editDisabled="scope.row.documentStatus === 'submit'"
                      :delDisabled="scope.row.documentStatus === 'submit'">
                      <el-dropdown hide-on-click>
                        <span class="el-dropdown-link">
                          <el-button type="text" size="mini">
                            {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="addOrUpdateHandle(scope.row.inspectionId, true, scope.row)">
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
        <el-form ref="diaForm" v-model="listQuery" label-width="120px" label-position="top"
          v-if="activeName === 'dataTable'">
          <el-col :span="12">
            <el-form-item label="检验单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入检验单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model="listQuery.originOrderNo" placeholder="请输入来源单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验人">
              <el-input v-model="listQuery.inspectorName" placeholder="请输入检验人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验日期">
              <el-date-picker v-model="listQuery.inspectionDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择检验开始日期" end-placeholder="请选择检验结束日期"
                :picker-options="global.timePickerOptions.shortcuts">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单据状态">
              <el-select v-model="listQuery.documentStatus" placeholder="请选择单据状态" clearable style="width: 100%;">
                <el-option v-for="item in documentStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="审批状态">
              <el-select v-model="listQuery.approvalStatus" placeholder="请选择审批状态" clearable style="width: 100%;">
                <el-option v-for="item in approvalStatusList" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker v-model="listQuery.createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;" start-placeholder="请选择创建开始时间" end-placeholder="请选择创建结束时间"
                :picker-options="global.timePickerOptions" :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
        <el-form ref="diaForm" v-model="linesQuery" label-width="120px" label-position="top" v-else>
          <el-col :span="12">
            <el-form-item label="检验单号">
              <el-input v-model="linesQuery.orderNo" placeholder="请输入检验单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源单号">
              <el-input v-model="linesQuery.originOrderNo" placeholder="请输入来源单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验人">
              <el-input v-model="linesQuery.inspectorName" placeholder="请输入检验人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验日期">
              <el-date-picker v-model="linesQuery.inspectionDateArr" type="daterange" value-format="yyyy-MM-dd"
                style="width: 100%;" start-placeholder="请选择检验开始日期" end-placeholder="请选择检验结束日期"
                :picker-options="global.timePickerOptions.shortcuts">
              </el-date-picker>
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
            <el-form-item label="检验结果">
              <el-select v-model="linesQuery.inspectionResults" placeholder="请选择检验结果" clearable style="width: 100%;">
                <el-option v-for="item in inspectionResultsList" :key="item.value" :label="item.label"
                  :value="item.value" />
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
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
  </div>
</template>

<script>
import { getInspectionList, deleteInspectionData, getInspectionLinesList } from '@/api/inspectionManagement/index' // 检验单
import { documentStatusList, approvalStatusList, inspectionResultsList, inspectionMethodList } from '../data.js'
import Form from '../components/inspectionNoticeForm.vue'
export default {
  components: { Form },
  props: {
    pageData: { // 页面配置
      type: Object,
      required: true,
      default: {
        type: '', // 通知单类型
        businessCode: '', // 业务编码
        showRouting: false, // 是否显示工艺路线
        showProcess: false, // 是否显示工序
      }
    }
  },
  data() {
    return {
      visible: false,
      activeName: "dataTable",
      formVisible: false,
      listLoading: false,
      documentStatusList, // 单据状态
      approvalStatusList, // 审批状态
      inspectionResultsList, // 检验结果
      inspectionMethodList, // 检验方法

      tableData: [],
      listQuery: {},
      initListQuery: {
        orderNo: "",
        originOrderNo: "",
        inspectorName: "",
        documentStatus: "",
        approvalStatus: "",
        notificationType: this.pageData.type,
        businessCode: this.pageData.businessCode,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        createTimeArr: [],
        inspectionDateArr: []
      },
      total: 0,

      linesTableData: [],
      linesQuery: {},
      initLinesQuery: {
        notificationType: this.pageData.type,
        businessCode: this.pageData.businessCode,
        orderNo: "",
        originOrderNo: "",
        inspectorName: "",
        productCode: "",
        productName: "",
        inspectionResults: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        pageNum: 1,
        pageSize: 20,
        startAndEndTime: [],
        inspectionDateArr: []
      },
      linesTotal: 0,
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.linesQuery = JSON.parse(JSON.stringify(this.initLinesQuery))
    this.initData()
  },
  watch: { activeName() { this.initData() } },
  methods: {
    initData() {
      this.listLoading = true
      if (this.activeName === 'dataTable') {
        getInspectionList(this.listQuery).then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        }).catch(() => { this.listLoading = false })
      } else {
        getInspectionLinesList(this.linesQuery).then(res => {
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
        }).catch(() => { this.listLoading = false })
      }
    },
    search() {
      this.visible = false
      if (this.activeName === 'dataTable') {
        this.jnpf.searchTimeFormat(this.listQuery, 'createTimeArr', 'startTime', 'endTime')
        this.jnpf.searchTimeFormat(this.listQuery, 'inspectionDateArr', 'inspectionStartDate', 'inspectionEndDate')
        Object.keys(this.listQuery).forEach(key => { this.listQuery[key] = typeof this.listQuery[key] === 'string' ? this.listQuery[key].trim() : this.listQuery[key] })
        this.listQuery.pageNum = 1
      } else {
        this.jnpf.searchTimeFormat(this.linesQuery, 'createTimeArr', 'startTime', 'endTime')
        this.jnpf.searchTimeFormat(this.linesQuery, 'inspectionDateArr', 'inspectionStartDate', 'inspectionEndDate')
        Object.keys(this.linesQuery).forEach(key => { this.linesQuery[key] = typeof this.linesQuery[key] === 'string' ? this.linesQuery[key].trim() : this.linesQuery[key] })
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
    addOrUpdateHandle(id, readOnly, data) {
      this.formVisible = true
      this.$nextTick(() => { this.$refs.Form.init(id, readOnly, this.pageData.type, data, this.pageData.businessCode) })
    },
    sortChange({ prop, order }) {
      let newProp
      if (this.activeName === 'dataTable') {
        if (prop === 'inspectorName') { newProp = 'inspector_id' }
        else if ([].includes(prop)) { newProp = prop }
        else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.listQuery.orderItems[0].asc = order !== 'descending'
        this.listQuery.orderItems[0].column = order === null ? "" : newProp
        this.initData()
      } else {
        if (['inspectorName', 'productCode', 'productName', 'createTime'].includes(prop)) { newProp = prop }
        else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.linesQuery.orderItems[0].asc = order === 'ascending'
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) { this.initData() }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteInspectionData(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    inspectionResultsFormatter(row) {
      let option = this.inspectionResultsList.find(item => item.value === row.inspectionResults)
      return option ? option.label : row.inspectionResults
    },
    inspectionMethodFormatter(row) {
      let option = this.inspectionMethodList.find(item => item.value === row.inspectionMethod)
      return option ? option.label : row.inspectionMethod
    },
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />