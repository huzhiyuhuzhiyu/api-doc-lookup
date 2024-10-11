<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="listQuery.orderNo" placeholder="单号" @keyup.enter.native="search()" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-date-picker v-model="time" type="datetimerange" align="right" start-placeholder="开始日期"
                  end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" :align="left">
                </el-date-picker>
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
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                  {{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head" style="padding:10px">
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
                <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                  @click="columnSetFun()" />
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
              </el-tooltip>
            </div>
          </div>
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="单号" min-width="200" sortable="custom"></el-table-column>
            <el-table-column prop="receiveType" label="退料类型" min-width="110" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.receiveType == 'order'">订单物料</div>
                <div v-if="scope.row.receiveType == 'process'">工序物料</div>
              </template>
            </el-table-column>
            <el-table-column prop="operationDate" label="退料日期" width="180" sortable="custom" />
            <el-table-column prop="personName" label="退料人" width="100" sortable="custom" />
            <el-table-column prop="productionOrderNo" label="任务单号" min-width="200" sortable="custom" />
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="160" sortable="custom" />
            <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" min-width="60" />
            <el-table-column prop="num" label="退料数量" min-width="120" sortable="custom" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" min-width="100" sortable="custom" />
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row)" editText="检验" :hasDel="false">

                </tableOpts>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <DetailForm v-if="detailFormVisible" ref="DetailForm" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <el-dialog title="扫码录入" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
      :show-close="true" :visible.sync="scanDialog" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px"
      @close="closeScanDiaFun()">
      <div class="scand">
        <div class="box">
          <el-input v-model="scanResult" ref="inputRef" placeholder="请扫产品码"
            @keyup.enter.native="getProductFun()"></el-input>
          <div class="tip">说明：扫产品码会自动匹配需要检验的产品。</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { WithdrawalList, deleteWithdrawal, WithdrawalmxList } from '@/api/productOrdes/index'
import Form from '../components/inspectionNoticeForm.vue'
// import DetailForm from '@/views/externalProcessManagement/outsourceMaterial/outsourcingReturnMaterial/Form.vue'
import DetailForm from './DetailForm.vue'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
export default {
  components: { Form, DetailForm, SuperQuery, ExportForm },
  data() {
    return {
      detailFormVisible: false,
      activeName: 'dataTable',
      exportFormVisible: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '单号',
          type: 'input'
        },
        {
          prop: 'receiveType',
          label: '退料类型',
          type: 'select',
          options: [{ label: '订单物料', value: 'order' }, { label: '工序物料', value: 'process' }]
        },

        {
          prop: 'operationDate',
          label: '退料日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'personName',
          label: '退料人',
          type: 'input'
        },
        {
          prop: 'productionOrderNo',
          label: '任务单号',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'select'
        },
        {
          prop: 'num',
          label: '退料数量',
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
      columnList: ['personName', 'productionOrderNo', 'productCode', 'createByName'],
      tableData: [],
      listLoading: false,
      listQuery: {},
      time: null,
      initListQuery: {
        // approvalStatus: 'ok', // 审批状态
        documentStatus: 'submit', // 单据状态
        inspectionStatus: 'unInspect', // 检验状态 待检验 unInspect、已检验 inspected
        notifyType: 'back',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: ''
          }
        ],
        createTimeArr: [],
        orderNo: '',
        pageNum: 1,
        pageSize: 20
      },
      linesTableData: [],
      linesTotal: 0,
      linesQuery: {},

      total: 0,
      formVisible: false,
      scanDialog: false,
      scanResult: ''
    }
  },
  watch: {
    activeName() {
      this.initData()
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
      this.listQuery.productCode = ''
    },
    getProductFun() {
      console.log(21341234)
      console.log(this.scanResult)

      this.listQuery.productCode = this.scanResult
      this.listLoading = true

      WithdrawalmxList(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records
          this.listQuery.productDrawingNo = this.tableData[0].productDrawingNo

          this.total = res.data.total
          this.listLoading = false
          this.scanDialog = false
          if (this.tableData.length == 1) {
            this.formVisible = true
            this.$nextTick(() => {
              this.$refs.Form.init(this.tableData[0], false, 'produce', 'notice', 'QCDH')
            })
          }
        })
        .catch(() => {
          this.listLoading = false
        })

      this.listLoading = true
      this.scanResult = ''
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
          exportType: '1073',
          exportName: '采购待检收货单',
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
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },

    initData() {
      if (this.time) {
        this.listQuery.operationSd = this.time[0]
        this.listQuery.operationEd = this.time[1]
      } else {
        this.listQuery.operationSd = ''
        this.listQuery.operationEd = ''
      }
      this.listLoading = true

      WithdrawalmxList(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
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
      if (readOnly) {
        this.detailFormVisible = true
        this.$nextTick(() => {
          this.$refs.DetailForm.init(row.id, 'look')
        })
      } else {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(row, readOnly, 'produce', 'notice', 'QCDH')
        })
      }
    },
    sortChange({ prop, order }) {
      let newProp
      if (
        [
          'personName',
          'productionOrderNo',

          'productDrawingNo',
          'productCode',
          'createByName'
        ].includes(prop)
      ) {
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
    }
  }
}
</script>
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