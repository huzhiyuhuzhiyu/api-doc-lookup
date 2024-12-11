<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="单据列表" name="orderList">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="form.transferNo" placeholder="请输入拆卸单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model.trim="form.transferByName" placeholder="请输入拆卸人" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="quotationTime" type="daterange" value-format="yyyy-MM-dd" clearable :picker-options="global.timePickerOptions" style="width: 100%;" start-placeholder="请输入拆卸开始日期" end-placeholder="请输入拆卸结束日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                      $t('common.reset') }}
                    </el-button>

                  </el-form-item>

                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <el-button type="primary" icon="el-icon-plus" @click.native="addSupplier('add')" size="mini">
                  新建
                </el-button>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table v-loading="listLoading" ref="tableForm" :data="tableDataList" :fixedNO="true" @sort-change="sortChange" custom-column>
                <el-table-column prop="transferNo" label="拆卸单号" width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                      scope.row.transferNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="transferByName" label="拆卸人" width="120" sortable="custom" />
                <el-table-column prop="transferDate" label="拆卸日期" width="140" sortable="custom" />
                <el-table-column prop="warehouseName" label="仓库" min-width="200" />
                <el-table-column prop="shelfSpaceName" label="库位" width="200" />
                <el-table-column prop="batchNumber" label="批次号" width="200" />
                <el-table-column prop="productCode" label="产品编码" width="200" />
                <el-table-column prop="drawingNo" label="品名规格" min-width="200" />
                <el-table-column prop="num" label="数量" width="160" />
                <el-table-column prop="mainUnit" label="单位(主)" width="160" />

                <el-table-column prop="reasonRejection" label="驳回理由" min-width="300" />
                <el-table-column prop="approvalCompletionDate" label="审批完成时间" width="180" sortable="custom" />
                <el-table-column prop="submitDate" label="提交时间" width="180" sortable="custom" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" width="120" />
                <el-table-column prop="documentStatus" label="单据状态" sortable="custom" width="120" fixed="right" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                    <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column prop="approvalStatus" label="审批状态" width="120" sortable="custom" fixed="right" align="center" v-if="showAppCodeFlag">
                  <template slot-scope="scope">
                    <div v-if="scope.row.approvalStatus == 'ing' && scope.row.documentStatus == 'submit'">
                      <el-tag>审批中</el-tag>
                    </div>
                    <div v-else-if="scope.row.approvalStatus == 'ok' && scope.row.documentStatus == 'submit'">
                      <el-tag type="success">审批通过</el-tag>
                    </div>
                    <div v-else-if="scope.row.approvalStatus == 'rebut' && scope.row.documentStatus == 'submit'">
                      <el-tag type="danger">审批拒绝</el-tag>
                    </div>
                    <div v-else-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'">
                      <el-tag type="warning">审批撤回</el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="300" />
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" @click="addOrUpdateHandle(scope.row, 'edit')" size="mini" :disabled="scope.row.documentStatus == 'draft' ? false : true">编辑</el-button>
                    <el-button type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true" size="mini" @click="handleDel(scope.row.id,)" class="JNPF-table-delBtn">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="(scope.row.approvalStatus === 'rebut' || scope.row.approvalStatus === 'withdrawn') && showAppCodeFlag" @click.native="handleUserRelation(scope.row.id, 'add')">
                          重新提交
                        </el-dropdown-item>
                        <el-dropdown-item v-if="scope.row.approvalStatus === 'ing' && showAppCodeFlag" @click.native="withdrawnHandle(scope.row.id, 'withdrawn')">
                          审批撤回
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                          查看详情
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="form.pageNum" :background="background" :limit.sync="form.pageSize" @pagination="initData" />
            </div>
            <!-- 高级查询 -->
            <SuperQuery :partentOrChild="activeName" :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson" @superQuery="superQuerySearch" @close="superQueryVisible = false" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="明细列表" name="detailList">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.transferNo" placeholder="请输入拆卸单号" @keyup.enter.native="search()" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.transferByName" placeholder="请输入拆卸人" @keyup.enter.native="search()" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="deliveryDatefahuo" type="daterange" value-format="yyyy-MM-dd" clearable :picker-options="global.timePickerOptions" style="width: 100%;" start-placeholder="请输入拆卸开始日期" end-placeholder="请输入拆卸结束日期">
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
                <topOpts @add="addSupplier('add')" />
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="superQueryVisible1 = true" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun1()" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="linesTableData" v-loading="listLoading" :data="linesTableData" fixedNO custom-column @sort-change="sortChange" :partentOrChild="'child'">
                <el-table-column prop="transferNo" label="拆卸单号" width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.transferId, 'look')">
                      {{ scope.row.transferNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="transferByName" label="拆卸人" width="120">
                </el-table-column>
                <el-table-column prop="transferDate" label="拆卸日期" width="180" sortable="custom" />
                <el-table-column prop="masterWarehouseName" label="原仓库" min-width="200" />
                <el-table-column prop="masterShelfSpaceName" label="原库位" width="200" />
                <el-table-column prop="masterBatchNumber" label="原批次号" width="200" sortable="custom" />
                <el-table-column prop="masterProductCode" label="原产品编码" width="200" sortable="custom" />
                <el-table-column prop="masterProductDrawingNo" label="原品名规格" min-width="400" />
                <!-- <el-table-column prop="masterProductSpec" label="原产品规格型号" width="200" /> -->
                <el-table-column prop="masterNum" label="原数量" width="140" />
                <el-table-column prop="masterMainUnit" label="原单位" width="120" />
                <el-table-column prop="productCode" label="目标产品编码" width="200" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="目标品名规格" min-width="400" />
                <!-- <el-table-column prop="productSpec" label="目标产品规格型号" width="200" /> -->
                <el-table-column prop="warehouseName" label="目标仓库" min-width="200" />
                <el-table-column prop="shelfSpaceName" label="目标库位" min-width="200" />
                <el-table-column prop="batchNumber" label="目标批次号" width="200" sortable="custom" />
                <el-table-column prop="num" label="目标数量" width="140" />
                <el-table-column prop="mainUnit" label="目标单位" width="120" />
                <el-table-column prop="remark" min-width="200" label="备注" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" width="120" />
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" @click="addOrUpdateHandlemx(scope.row, 'edit')" size="mini" :disabled="scope.row.documentStatus == 'draft' ? false : true">编辑</el-button>
                    <el-button type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true" size="mini" @click="handleDel(scope.row.transferId,)" class="JNPF-table-delBtn">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleUserRelation(scope.row.transferId, 'look')">
                          查看详情
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="linesTotal" :page.sync="linesQuery.pageNum" :limit.sync="linesQuery.pageSize" @pagination="initData" />
            </div>
            <!-- 高级查询 -->
            <SuperQuery :partentOrChild="activeName" :show="superQueryVisible1" ref="SuperQuery1" :columnOptions="superQueryJson1" @superQuery="superQuerySearch1" @close="superQueryVisible1 = false" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <Form v-if="depFormVisible" ref="depForm" @close="closeForm" />
  </div>
</template>

<script>
import { getWarehouseInfo } from '@/api/basicData/index'// 仓库树
import { getWarehouseTree } from '@/api/warehouseManagement/inboundAndOutbound'
import getProjectList from '@/mixins/generator/getProjectList'
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { InventoryDisassemblylist, InventoryDisassemblydele, InventoryDisassemblymxlist } from '@/api/warehouseManagement/productlistChange'
import Form from './Form'
export default {
  name: 'InventoryDisassembly',
  components: { Form, SuperQuery },
  props: {
    warehouseCode: "",
  },
  mixins: [getProjectList],
  data() {
    return {
      isProjectSwitch: '',
      warehouseInfo: {},
      showAppCodeFlag: true,
      superQueryVisible1: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'transferNo',
          label: "拆卸单号",
          type: 'input'
        },
        {
          prop: 'transferByName',
          label: "拆卸人",
          type: 'input'
        },
        { // 日期选择器（区间）
          prop: 'transferDate',
          label: '拆卸日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'warehouseName',
          label: "仓库",
          type: 'input'
        },
        {
          prop: 'shelfSpaceName',
          label: "库位",
          type: 'input'
        },
        {
          prop: 'batchNumber',
          label: "批次号",
          type: 'input'
        },
        {
          prop: 'productCode',
          label: "产品编码",
          type: 'input'
        },
        {
          prop: 'drawingNo',
          label: "品名规格",
          type: 'input'
        },
        {
          prop: 'num',
          label: "数量",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "单位(主)",
          type: 'input'
        },
        {
          prop: 'reasonRejection',
          label: "驳回理由",
          type: 'input'
        },
        { // 日期时间选择器（区间）
          prop: 'approvalCompletionDate',
          label: '审批完成时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        { // 日期时间选择器（区间）
          prop: 'submitDate',
          label: '提交时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        { // 日期时间选择器（区间）
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        },
        { // 下拉选
          prop: 'documentStatus',
          label: '单据状态',
          type: 'select',
          options: [
            { label: "草稿", value: "draft" },
            { label: "提交", value: "submit" }
          ]
        },
        {
          prop: 'approvalStatus',
          label: "审批状态",
          type: 'select',
          options: [
            { label: '审批中', value: 'ing' },
            { label: '审批通过', value: 'ok' },
            { label: '审批拒绝', value: 'rebut' },
            { label: '审批撤回', value: 'withdrawn' },
          ]
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        }
      ],
      superQueryJson1: [
        {
          prop: 'transferNo',
          label: "拆卸单号",
          type: 'input'
        },
        {
          prop: 'transferByName',
          label: "拆卸人",
          type: 'input'
        },
        { // 日期选择器（区间）
          prop: 'transferDate',
          label: '拆卸日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'masterWarehouseName',
          label: "原仓库",
          type: 'input'
        },
        {
          prop: 'masterShelfSpaceName',
          label: "原库位",
          type: 'input'
        },
        {
          prop: 'masterBatchNumber',
          label: "原批次号",
          type: 'input'
        },
        {
          prop: 'masterProductCode',
          label: "原产品编码",
          type: 'input'
        },
        {
          prop: 'masterProductDrawingNo',
          label: "原品名规格",
          type: 'input'
        },
        {
          prop: 'masterNum',
          label: "原数量",
          type: 'input'
        },
        {
          prop: 'masterMainUnit',
          label: "原单位",
          type: 'input'
        },
        {
          prop: 'productCode',
          label: "目标产品编码",
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: "目标品名规格",
          type: 'input'
        },
        {
          prop: 'warehouseName',
          label: "目标仓库",
          type: 'input'
        },
        {
          prop: 'shelfSpaceName',
          label: "目标库位",
          type: 'input'
        },
        {
          prop: 'batchNumber',
          label: "目标批次号",
          type: 'input'
        },
        {
          prop: 'num',
          label: "目标数量",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "目标单位",
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        },
        { // 日期时间选择器（区间）
          prop: 'createTime',
          label: '创建时间',
          type: 'datetimerange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        }
      ],
      linesTotal: 0,
      linesTableData: [],
      createTimeArrfahuo: [],
      deliveryDatefahuo: [],
      activeName: 'orderList',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      approvalStatusList: [
        { label: "审批中", value: "ing" },
        { label: "审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
      ],
      documentStatusList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],
      depFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [],
      form: {},
      formlist: {
        projectId: '',
        transferType: 'split',
        documentStatus: '',
        approvalStatus: '',
        transferNo: '',
        transferByName: '',
        batchNumber: '',
        productCode: '',
        productName: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
        startTime: "",
        endTime: '',
        transferSd: '',
        transferEd: "",
      },
      linesQuery: {},
      linesQuerylist: {
        projectId: '',
        transferType: 'split',
        transferNo: '',
        startTime: '',
        endTime: '',
        transferByName: '',
        masterProductCode: '',
        masterProductName: '',
        masterBatchNumber: '',
        batchNumber: '',
        productCode: '',
        productName: '',
        transferEd: '',
        transferSd: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
      },
      quotationTime: [],
      submitDate: [],
      listLoading: false,
      total: 0,
      formVisible: false,
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    const res = await this.jnpf.getBusInfo('b063')
    if (res) {
      this.showAppCodeFlag = res.enabledMark
    } else {
      this.showAppCodeFlag = false
    }
    this.form = JSON.parse(JSON.stringify(this.formlist))
    this.linesQuery = JSON.parse(JSON.stringify(this.linesQuerylist))
    this.getWarehouseListFun()
    // this.search()
  },
  watch: {
    activeName() {
      this.reset()
    }
  },
  methods: {
    // 获取仓库
    getWarehouseListFun() {
      getWarehouseTree({ code: this.warehouseCode }).then(res => {
        // 获取仓库详情信息
        getWarehouseInfo(res.data[0].id).then(response => {
          this.form.projectId = this.isProjectSwitch === '1' ? res.data[0].projectId || '' : ''
          this.linesQuery.projectId = this.isProjectSwitch === '1' ? res.data[0].projectId || '' : ''
          this.warehouseInfo = res.data[0]
          this.initData()
        })
      })
    },
    withdrawnHandle(formId) {
      let _data = {
        formId
      }
      this.$confirm('此操作将撤回审批单，是否继续？', this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        withdrawn(_data).then(res => {
          this.$message({
            type: 'success',
            message: "撤回成功",
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    },
    columnSetFun() {
      this.$refs['tableForm'].showDrawer()
    },
    columnSetFun1() {
      this.$refs['linesTableData'].showDrawer()
    },
    superQuerySearch(query) {
      this.form.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    superQuerySearch1(query) {
      this.linesQuery.superQuery = query
      this.superQueryVisible1 = false
      this.search()
    },
    handleClick(e) {
      this.activeName = e.name
      // this.reset()
    },
    moreQueries() {
      this.visible = true
    },
    sortChange({ prop, order }) {
      let newProp;
      if (this.activeName == "orderList") {
        if (prop === 'transferByName') {
          let prop = 'transferBy'
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        } else { newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase()); }
        this.form.orderItems[0].asc = order !== 'descending'
        this.form.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (prop === 'masterBatchNumber' || prop === 'masterProductCode' || prop === 'masterProductName' || prop === 'productCode' || prop === 'productName') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }
        this.linesQuery.orderItems[0].asc = order !== "descending"
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },
    // 关闭新建、编辑页面
    closeForm(isRefresh) {
      this.depFormVisible = false
      if (isRefresh) {
        this.search()
      }
    },
    initData() {
      this.listLoading = true
      if (this.activeName == "orderList") {
        InventoryDisassemblylist(this.form).then(res => {
          this.tableDataList = res.data.records
          this.listLoading = false
          this.total = res.data.total
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        InventoryDisassemblymxlist(this.linesQuery).then(res => {
          this.linesTableData = res.data.records
          this.linesTotal = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    search() {
      if (this.activeName == "orderList") {
        if (this.submitDate && this.submitDate.length > 0) {
          this.form.startTime = this.submitDate[0].replace(/ 0(?!0)/g, " ")
          this.form.endTime = this.submitDate[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.form.startTime = ''
          this.form.endTime = ''
        }
        if (this.quotationTime && this.quotationTime.length > 0) {
          this.form.transferSd = this.quotationTime[0]
          this.form.transferEd = this.quotationTime[1]
        } else {
          this.form.transferSd = ''
          this.form.transferEd = ''
        }
        Object.keys(this.form).forEach(key => { // 清除搜索条件两端空格
          let item = this.form[key]
          this.form[key] = typeof item === 'string' ? item.trim() : item
        })
        // 重置页码
        this.form.pageNum = 1
      } else {
        if (this.deliveryDatefahuo && this.deliveryDatefahuo.length > 0) {
          this.linesQuery.transferSd = this.deliveryDatefahuo[0]
          this.linesQuery.transferEd = this.deliveryDatefahuo[1]
        } else {
          this.linesQuery.transferSd = ''
          this.linesQuery.transferEd = ''
        }
        if (this.createTimeArrfahuo && this.createTimeArrfahuo.length > 0) {
          this.linesQuery.startTime = this.createTimeArrfahuo[0].replace(/ 0(?!0)/g, " ")
          this.linesQuery.endTime = this.createTimeArrfahuo[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.linesQuery.startTime = ''
          this.linesQuery.endTime = ''
        }
        Object.keys(this.linesQuery).forEach(key => { // 清除搜索条件两端空格
          let item = this.linesQuery[key]
          this.linesQuery[key] = typeof item === 'string' ? item.trim() : item
        })
        this.linesQuery.pageNum = 1 // 重置页码
      }
      this.initData()
    },
    reset() {
      if (this.activeName == "orderList") {
        this.$refs['tableForm'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.submitDate = []
        this.quotationTime = []
        this.form = JSON.parse(JSON.stringify(this.formlist))
      } else {
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()
        this.linesQuery = JSON.parse(JSON.stringify(this.linesQuerylist))
        this.createTimeArrfahuo = [],
          this.deliveryDatefahuo = []
      }
      this.search()
    },
    addSupplier(type) {
      this.depFormVisible = true
      let obj = {
        btnType: type,
        warehouseInfo: this.warehouseInfo
      }
      this.$nextTick(() => {
        this.$refs.depForm.init("", obj)
      })
    },
    addOrUpdateHandlemx(res, type) {
      this.depFormVisible = true
      let type1
      if (res.generateFlag) {
        type1 = 'bjkh'
      } else {
        type1 = type
      }
      let id = res.transferId
      let obj = {
        btnType: type1,
        warehouseInfo: this.warehouseInfo
      }
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, obj)
        })
        // }, 600);
      }
    },
    addOrUpdateHandle(res, type) {
      this.depFormVisible = true
      let type1
      if (res.generateFlag) {
        type1 = 'bjkh'
      } else {
        type1 = type
      }
      let id = res.id
      let obj = {
        btnType: type1,
        warehouseInfo: this.warehouseInfo
      }
      if (id) {
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, obj)
        })
        // }, 600);
      }
    },
    handleUsercustom(id, type) {
      this.depFormVisible = true
      let obj = {
        btnType: type,
        warehouseInfo: this.warehouseInfo
      }
      if (id) {
        this.$nextTick(() => {
          this.$refs.depForm.init(id, obj)
        })
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        InventoryDisassemblydele(id).then(res => {
          this.search()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, type) {
      this.depFormVisible = true
      this.$nextTick(() => {
        this.$refs.depForm.init(id, type)
      })
    }
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
