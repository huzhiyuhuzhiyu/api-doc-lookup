<template>
  <div class="JNPF-common-layout">
    <!-- <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="派工单" name="dataTable"> -->
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productionOrderNo" placeholder="生产订单号" @keyup.enter.native="search()"
                clearable />
            </el-form-item>
          </el-col> -->
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.orderNo" placeholder="工单号" @keyup.enter.native="search()" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model="listQuery.productDrawingNo" placeholder="品名规格" @keyup.enter.native="search()"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}
              </el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <div>
            <el-button size="mini" type="primary" @click="scanFun">
              <i class="iconfont icon-saoma"></i>
              扫码检验
            </el-button>
            <el-button :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"
              icon="el-icon-download" @click="exportForm">
              导出
            </el-button>
          </div>
          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true" @sort-change="sortChange"
          custom-column :setColumnDisplayList="columnList">
          <el-table-column prop="productionOrderNo" label="任务单号" min-width="200" sortable="custom">
            <!-- <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, true)">
                {{ scope.row.productionOrderNo }}
              </el-link>
            </template> -->
          </el-table-column>
          <el-table-column prop="orderNo" label="工单单号" min-width="200" sortable="custom" />
          <!-- <el-table-column prop="orderNo" label="报工单号" min-width="200" sortable="custom">
            <template slot-scope="scope">
              <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, true)">
                {{ scope.row.orderNo }}
              </el-link>
            </template>
          </el-table-column> -->
          <el-table-column prop="productDrawingNo" label="品名规格" min-width="120" sortable="custom" />
          <el-table-column prop="processName" label="工序名称" min-width="120" sortable="custom" />
          <el-table-column prop="mainUnit" label="单位" width="60" />
          <el-table-column prop="productionQuantity" label="生产数量" min-width="120" sortable="custom" />
          <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="120" sortable="custom" />

          <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="130" sortable="custom" />

          <el-table-column prop="responsibilityWasteQuantity" label="责废数量" min-width="120" sortable="custom" />
          <el-table-column prop="materialWasteQuantity" label="料废数量" min-width="120" sortable="custom" />
          <el-table-column prop="utilizeQuantity" label="利用数量" min-width="120" sortable="custom" />
          <el-table-column prop="completedQuantity" label="返工数量" min-width="120" />
          <el-table-column prop="planStartDate" label="计划开始日期" width="150" sortable="custom" />
          <el-table-column prop="planEndDate" label="计划结束日期" width="150" sortable="custom" />
          <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" sortable="custom" />
          <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom" />
          <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom" />
          <el-table-column prop="oil" label="油脂" width="100" sortable="custom" />
          <el-table-column prop="oilQuantity" label="油脂量" width="100" sortable="custom" />
          <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" />
          <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom" />
          <el-table-column prop="workGroupName" label="班组" width="100" sortable="custom" />
          <el-table-column prop="personName" label="人员" width="100" sortable="custom" />
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
          <el-table-column prop="createByName" label="创建人" width="100" sortable="custom" />
          <el-table-column label="操作" width="60" fixed="right">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row)" editText="检验" :hasDel="false">
                <!-- <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrUpdateHandle(scope.row, true)">
                      查看详情
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
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
  
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    ]
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <el-dialog title="扫码录入" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :show-close="true" :visible.sync="scanDialog" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px"
      @close="closeScanDiaFun()">
      <div class="scand">
        <div class="box">
          <el-input v-model="scanResult" ref="inputRef" placeholder="请扫工单码"
            @keyup.enter.native="getProductFun()"></el-input>
          <div class="tip">说明：扫工单码会自动匹配需要检验的产品。</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getWorkList } from '@/api/productOrdes/index'
import Form from '../components/inspectionNoticeForm.vue' 
// import DetailForm from './DetailForm.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  components: { Form, SuperQuery, ExportForm },
  data() {
    return {
      columnList: [
        'sealingCoverTyping',
        'accuracyLevel',
        'vibrationLevel',
        'oil',
        'oilQuantity',
        'clearance',
        'packagingMethod',
        'createByName'
      ],
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'productionOrderNo',
          label: '任务单号',
          type: 'input'
        },
        {
          prop: 'orderNo',
          label: '工单单号',
          type: 'input'
        },
        // {
        //   prop: 'orderNo',
        //   label: '报工单号',
        //   type: 'input'
        // },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'processName',
          label: '工序名称',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },
        {
          prop: 'productionQuantity',
          label: '生产数量',
          type: 'input'
        },
        {
          prop: 'qualifiedQuantity',
          label: '合格数量',
          type: 'input'
        },
        {
          prop: 'unqualifiedQuantity',
          label: '不合格数量',
          type: 'input'
        },
        {
          prop: 'responsibilityWasteQuantity',
          label: '责废数量',
          type: 'input'
        },
        {
          prop: 'materialWasteQuantity',
          label: '料废数量',
          type: 'input'
        },
        {
          prop: 'utilizeQuantity',
          label: '利用数量',
          type: 'input'
        },
        // {
        //   prop: 'reworkQuantity',
        //   label: '返工数量',
        //   type: 'input'
        // },
        {
          prop: 'planStartDate',
          label: '计划开始日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'planEndDate',
          label: '计划结束日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'sealingCoverTyping',
          label: '打字内容',
          type: 'input'
        },
        {
          prop: 'accuracyLevel',
          label: '精度等级',
          type: 'input'
        },
        {
          prop: 'vibrationLevel',
          label: '振动等级',
          type: 'input'
        },
        {
          prop: 'oil',
          label: '油脂',
          type: 'input'
        },
        {
          prop: 'oilQuantity',
          label: '油脂量',
          type: 'input'
        },
        {
          prop: 'clearance',
          label: '游隙',
          type: 'input'
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'input'
        },
        {
          prop: 'workGroupName',
          label: '班组',
          type: 'input'
        },
        {
          prop: 'personName',
          label: '人员',
          type: 'input'
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'createByName',
          label: '创建人',
          type: 'input'
        }
      ],
      exportFormVisible: false,
      visible: false,
      detailFormVisible: false,
      activeName: 'dataTable',
      tableData: [],
      listLoading: false,
      startingStatusList: [
        { label: '未开工', value: 'not_started' },
        { label: '开工中', value: 'in_progress' },
        { label: '已完工', value: 'finished' }
      ], // 开工状态
      workOrderStatusList: [
        { label: '正常', value: 'normal' },
        { label: '暂停', value: 'suspend' },
        { label: '关闭', value: 'closed' },
        { label: '已完成', value: 'finish' }
      ], // 派工单状态
      listQuery: {},
      initListQuery: {
        finishFlag: 0,
        documentStatus: 'submit',
        processingType: 'self_produced',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      formVisible: false,
      scanDialog: false,
      scanResult: ''
    }
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.initData()
  },
  methods: {
    scanFun() {
      this.scanDialog = true
      this.$nextTick(() => {
        this.$refs.inputRef.$refs.input.focus()
      })
    },
    closeScanDiaFun() {
      this.scanDialog = false
      this.scanResult = ''
      this.listQuery.orderNo = ''
    },
    getProductFun() {
      console.log(21341234)
      console.log(this.scanResult)

      this.listQuery.orderNo = this.scanResult
      this.listLoading = true

      getWorkList(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records
          this.listQuery.productDrawingNo = this.tableData[0].productDrawingNo

          this.total = res.data.total
          this.listLoading = false
          this.scanDialog = false
          if (this.tableData.length == 1) {
            this.formVisible = true
            this.$nextTick(() => {
              this.$refs.Form.init(this.tableData[0], false, 'process', 'notice', 'QCDH')
            })
          }
        })
        .catch(() => {
          this.listLoading = false
        })

      this.listLoading = true
      this.scanResult = ''
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.dataTable.columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i]
        }
        console.log(includeFieldMap)
        let _data = {
          ...this.listQuery,
          exportType: '1018',
          exportName: '生产巡检待检工单',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
          totalRowFlag: true
        }
        excelExport(_data)
          .then((res) => {
            this.exportFormVisible = false
            if (!res.data.url) return
            this.jnpf.downloadFile(res.data.url)
          })
          .catch(() => { })
      }
    },
    initData() {
      this.listLoading = true
      getWorkList(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search() {
      Object.keys(this.listQuery).forEach((key) => {
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
      this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(row, readOnly, 'process', 'notice', 'QCDH')
        })
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productionOrderNo'  ||prop === 'productDrawingNo' || prop === 'processName' ||prop === 'workGroupName' || prop === 'personName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    closeForm(isRefresh) {
      this.formVisible = false
      this.detailFormVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    handleClick(e) { }
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
<style lang="scss" scoped>
.scand ::v-deep.el-input__inner {
  height: 60px;
  line-height: 60px;
  font-size: 20px !important;
  font-weight: 600;
  border-color: #3fb9f8;
}

.scand .box {
  padding: 40px 20px;
}

.scand .tip {
  margin-top: 10px;
  font-size: 18px;
}
</style>