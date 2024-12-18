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
                    <el-input v-model="orderForm.orderNo" placeholder="请输入转换单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <ComSelect-list :requestObj="{ type: 'normal' }" :dialogTitle="'请选择仓库'" v-model="orderForm.warehouseName" :method="getWarehouseList" placeholder="请选择仓库" @change="changeWarehouse"></ComSelect-list>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="orderForm.approvalStatus" placeholder="请选择审批状态" filterable clearable>
                      <el-option v-for="(item, index) in approvalStateList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
                <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search"
                  @click="moreQueries()">更多查询</el-button> -->
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <topOpts @add="addSupplier('', 'add')" />
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
              <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange" custom-column>
                <el-table-column prop="orderNo" label="转换单号" width="190" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">{{
                      scope.row.orderNo
                    }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="warehouseName" label="仓库名称" min-width="240" />
                <el-table-column prop="approvalCompletionDate" label="审批完成时间" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="documentStatus" label="单据状态" width="120" fixed="right" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                    <div v-else-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                  </template>
                </el-table-column>
                <el-table-column prop="approvalStatus" label="审批状态" width="120" fixed="right" align="center" v-if="showAppCodeFlag">
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
                <el-table-column prop="submitDate" label="提交时间" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="createByName" label="创建人" width="160"></el-table-column>
                <el-table-column prop="reasonRejection" label="驳回理由" min-width="300" />
                <el-table-column prop="remark" label="备注" min-width="300"></el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus == 'draft' ? false : true" @click="handleDel(scope.row.id)">删除</el-button>
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
              <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize" @pagination="initData" />
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
                    <el-input v-model="linesQuery.orderNo" placeholder="请输入转换单号" @keyup.enter.native="search()" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <ComSelect-list :requestObj="{ type: 'normal' }" :dialogTitle="'选择仓库'" v-model="linesQuery.warehouseName" :method="getWarehouseList" placeholder="请选择仓库" @change="changeWarehousex"></ComSelect-list>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="linesQuery.drawingNo" placeholder="请输入原品名规格" clearable @keyup.enter.native="search()" />
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
                <!-- <el-button style="float: right;margin-right: 20px;" size="mini" type="primary" icon="el-icon-search" @click="visible = true">更多查询</el-button> -->
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <topOpts @add="addSupplier('', 'add')" />
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
              <JNPF-table ref="linesTableData" v-loading="listLoading" :data="linesTableData" :fixedNO="true" custom-column @sort-change="sortChange" :partentOrChild="'child'">
                <el-table-column prop="orderNo" label="转换单号" width="200" sortable="custom">
                  <template slot-scope="scope">
                    <el-link type="primary" @click.native="handleUserRelation(scope.row.modalShiftId, 'look')">
                      {{ scope.row.orderNo }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="warehouseName" label="仓库名称" min-width="200" sortable="custom">
                </el-table-column>
                <el-table-column prop="drawingNo" label="原品名规格" min-width="200" sortable="custom" />
                <el-table-column prop="shelfSpaceName" label="原库位" width="200" />
                <el-table-column prop="originBatchNumber" label="原批次号" width="200" sortable="custom" />
                <el-table-column prop="mainUnit" label="原单位" width="120" />
                <el-table-column prop="num" label="转换数量" width="140" />
                <el-table-column prop="targetProductDrawingNo" label="目标品名规格" min-width="200" sortable="custom" />
                <el-table-column prop="targetShelfSpaceName" label="目标库位" width="200" />
                <el-table-column prop="targetBatchNumber" label="目标批次号" width="200" sortable="custom" />
                <el-table-column prop="targetProductsMainUnit" label="目标单位" width="120" />
                <el-table-column prop="remark" min-width="200" label="备注" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
                <el-table-column prop="createByName" label="创建人" width="120" />
                <el-table-column label="操作" width="180" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true" @click="addOrUpdateHandle(scope.row.id, 'edit')">编辑</el-button>
                    <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus == 'draft' ? false : true" @click="handleDel(scope.row.id)">删除</el-button>
                    <el-dropdown hide-on-click>
                      <span class="el-dropdown-link">
                        <el-button type="text" size="mini">
                          {{ $t('common.moreBtn') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleUserRelation(scope.row.modalShiftId, 'look')">
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
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList" />
  </div>
</template>

<script>
import { withdrawn } from '@/api/basicData/approvalAdministrator'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getWarehouseList, getWarehouseInfo } from '@/api/basicData/index'// 仓库树
import { InventorymodalShiftlist, InventorymodalShiftdele, InventorymodalShiftmxlist } from '@/api/warehouseManagement/modalShift'
import Form from './Form'
import getProjectList from '@/mixins/generator/getProjectList'
import { getWarehouseTree } from '@/api/warehouseManagement/inboundAndOutbound'
export default {
  // name: 'modalShift',
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
      superQueryJson1: [
        {
          prop: 'orderNo',
          label: "转换单号",
          type: 'input'
        },
        {
          prop: 'warehouseName',
          label: "仓库名称",
          type: 'input'
        },
        {
          prop: 'drawingNo',
          label: "原品名规格",
          type: 'input'
        },
        {
          prop: 'shelfSpaceName',
          label: "原库位",
          type: 'input'
        },
        {
          prop: 'originBatchNumber',
          label: "原批次号",
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: "原单位",
          type: 'input'
        },
        {
          prop: 'num',
          label: "转换数量",
          type: 'input'
        },
        {
          prop: 'targetProductDrawingNo',
          label: "目标品名规格",
          type: 'input'
        },
        {
          prop: 'targetShelfSpaceName',
          label: "目标库位",
          type: 'input'
        },
        {
          prop: 'targetBatchNumber',
          label: "目标批次号",
          type: 'input'
        },
        {
          prop: 'targetProductsMainUnit',
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
      superQueryVisible1: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: "转换单号",
          type: 'input'
        },
        {
          prop: 'warehouseName',
          label: "仓库名称",
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
        { // 下拉选
          prop: 'documentStatus',
          label: '单据状态',
          type: 'select',
          options: [
            { label: "草稿", value: "draft" },
            { label: "提交", value: "submit" }
          ] // 注意，此options从接口异步获取，改变值时注意内存地址
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
        {
          prop: 'reasonRejection',
          label: "驳回理由",
          type: 'input'
        },
        {
          prop: 'remark',
          label: "备注",
          type: 'input'
        }
      ],
      superQueryVisible: false,
      linesTotal: 0,
      linesTableData: [],
      createTimeArrfahuo: [],
      getWarehouseList,
      customList: [], // 列表中显示的自定义属性
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      activeName: "orderList",
      documentStateList: [
        { label: "草稿", value: "draft" },
        { label: "提交", value: "submit" },
      ],
      approvalStateList: [
        { label: "审批中", value: "ing" },
        { label: " 审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
      ],
      orderForm: {},
      orderFormlist: {
        projectId: '',
        orderNo: "",
        productName: '',
        originBatchNumber: '',
        targetProductsName: '',
        targetBatchNumber: '',
        warehouseName: '',
        warehouseId: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      linesQuery: {},
      linesQuerylist: {
        projectId: '',
        orderNo: "",
        warehouseName: '',
        approvalStatus: '',
        createByName: '',
        documentStatus: '',
        warehouseId: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      createTimeArr: [],
      total: 0,
      formVisible: false,
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    const res = await this.jnpf.getBusInfo('b064')
    if (res) {
      this.showAppCodeFlag = res.enabledMark
    } else {
      this.showAppCodeFlag = false
    }
    this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
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
          this.orderForm.projectId = this.isProjectSwitch === '1' ? res.data[0].projectId || '' : ''
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
      this.$refs['dataTable'].showDrawer()
    },
    columnSetFun1() {
      this.$refs['linesTableData'].showDrawer()
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
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
    //排序
    sortChange({ prop, order }) {
      let newProp;
      if (this.activeName == "orderList") {
        if (prop === 'partnerCode' || prop === 'partnerName') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }
        this.orderForm.orderItems[0].asc = order !== "descending"
        this.orderForm.orderItems[0].column = order === null ? "" : newProp
      } else {
        if (prop === 'warehouseName' || prop === 'productName' || prop === 'targetProductsName') {
          newProp = prop
        } else {
          newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
        }
        this.linesQuery.orderItems[0].asc = order !== "descending"
        this.linesQuery.orderItems[0].column = order === null ? "" : newProp
      }
      this.initData()
    },
    moreQueries() {
      this.visible = true
    },
    //选择仓库
    changeWarehouse(val, data) {
      if (!val && !data.length) {
        this.orderForm.warehouseId = ''
        this.orderForm.warehouseName = ''
        return
      }
      this.orderForm.warehouseId = data[0].id
      this.orderForm.warehouseName = data[0].name
    },
    //明细选择仓库
    changeWarehousex(val, data) {
      if (!val && !data.length) {
        this.linesQuery.warehouseId = ''
        this.linesQuery.warehouseName = ''
        return
      }
      this.linesQuery.warehouseId = data[0].id
      this.linesQuery.warehouseName = data[0].name
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.search()
      }
    },
    initData() {
      this.listLoading = true
      if (this.activeName == "orderList") {
        InventorymodalShiftlist(this.orderForm).then(res => {
          console.log("res++", res);
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        }).catch(() => {
          this.listLoading = false
        })
      } else {
        InventorymodalShiftmxlist(this.linesQuery).then(res => {
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
        if (this.createTimeArr && this.createTimeArr.length > 0) {
          this.orderForm.startTime = this.createTimeArr[0].replace(/ 0(?!0)/g, " ")
          this.orderForm.endTime = this.createTimeArr[1].replace(/ 0(?!0)/g, " ")
        } else {
          this.orderForm.startTime = ''
          this.orderForm.endTime = ''
        }
        Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
          let item = this.orderForm[key]
          this.orderForm[key] = typeof item === 'string' ? item.trim() : item
        })
        this.orderForm.pageNum = 1 // 重置页码
      } else {
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
        this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
        this.createTimeArr = []
        this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
      } else {
        this.$refs['linesTableData'].$refs.JNPFTable.clearSort()
        this.linesQuery = JSON.parse(JSON.stringify(this.linesQuerylist))
        this.createTimeArrfahuo = []
      }
      this.search()
    },

    addSupplier(id, btntype) {
      this.formVisible = true
      let obj = {
        btnType: btntype,
        warehouseInfo: this.warehouseInfo
      }
      this.$nextTick(() => {
        this.$refs.Form.init(id, obj.btnType, false, obj)
      })
    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        let obj = {
          btnType: btntype,
          warehouseInfo: this.warehouseInfo
        }
        this.$nextTick(() => {
          this.$refs.Form.init(id, obj.btnType, false, obj)
        })
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        InventorymodalShiftdele(id).then(res => {
          this.search()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, btnType) {
      this.formVisible = true
      let obj = {
        btnType: btnType,
        warehouseInfo: this.warehouseInfo
      }
      this.$nextTick(() => {
        this.$refs.Form.init(id, obj.btnType, false, obj)
      })
    },
  }
}
</script>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />

