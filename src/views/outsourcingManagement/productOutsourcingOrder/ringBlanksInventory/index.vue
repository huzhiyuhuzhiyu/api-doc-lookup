<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4" v-if="isProductNameSwitch === '1'">
              <el-form-item>
                <el-input v-model.trim="listQuery.productName" placeholder="毛坯名称" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listQuery.productDrawingNo" placeholder="毛坯规格" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listQuery.batchNumber" placeholder="批次号" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-date-picker v-model="time" type="datetimerange" range-separator="至" start-placeholder="入库开始时间"
                  end-placeholder="入库结束时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <topOpts @add="addSupplier('', 'add')" addText="生成外协订单">
              <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm('tableForm')">
                导出
              </el-button>
            </topOpts>

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
          <JNPF-table v-if="tableFlag" @selection-change="handeleFinshData" hasC highlight-current-row :fixedNO="true"
            ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column
            :checkSelectable="checkSelectable" :setColumnDisplayList="columnList" customKey="JNPFTableKey_131807">
            <el-table-column prop="projectName" label="所属项目" width="120"
              v-if="isProjectSwitch === '1'"></el-table-column>
            <el-table-column prop="productCode" label="毛坯编码" width="150" sortable="custom" />
            <el-table-column prop="productName" label="毛坯名称" min-width="180" sortable="custom"
              v-if="isProductNameSwitch === '1'" />
            <el-table-column prop="productDrawingNo" label="毛坯规格" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="productCategoryName" label="毛坯分类" width="120" sortable="custom" />
            <el-table-column prop="batchNumber" label="批次号" min-width="180" sortable="custom" />
            <el-table-column prop="weight" label="重量(kg)" width="90" />
            <el-table-column prop="proportion" label="比重" width="80" />
            <el-table-column prop="discount" label="折扣" width="80" />
            <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch === '1' ? '单位(主)' : '单位'"
              :width="isDeputyUnitSwitch === '1' ? 85 : 60" />
            <el-table-column prop="deputyUnit" label="单位(副)" width="85" v-if="isDeputyUnitSwitch === '1'" />
            <el-table-column prop="inventoryQuantity" label="库存数量" width="120" sortable="custom" />
            <el-table-column prop="latestStorageTime" label="最新入库时间" width="220" sortable="custom" />
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
            :limit.sync="listQuery.pageSize" @pagination="initData"></pagination>
        </div>
      </div>
    </div>

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <Form v-if="formVisible" ref="form" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { inventoryList } from '@/api/purchasingAndOutsourcingOrders/index'
import moment from 'moment'
import Form from '../ringBlankStock/Form.vue'
import { excelExport } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getBimBusinessDetail } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  name: 'ringBlanksInventory',
  components: { ExportForm, Form, SuperQuery },
  mixins: [getProjectList],

  data() {
    return {
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      isDeputyUnitSwitch: '',
      tableFlag: false,
      exportFormVisible: false,
      superQueryVisible: false,
      superQueryJson: [
        {
          prop: 'productCode',
          label: '毛坯编码',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '毛坯规格',
          type: 'input'
        },
        {
          prop: 'productCategoryName',
          label: '毛坯分类',
          type: 'input'
        },

        {
          prop: 'batchNumber',
          label: '批次号',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },

        {
          prop: 'latestStorageTime',
          label: '入库日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        }
      ],
      printVisible: false,
      formVisible: false,
      title: '更多查询',
      background: true, //分页器背景颜色
      visible: false,
      btnLoading: false,
      detailVisible: false,
      withdrawnVisible: false,
      tableDataList: [],
      detailTableData: [],
      flag: true,
      activeName: 'orderList',
      listLoading: false,
      statusList: [
        {
          label: '审批中',
          value: 'ing'
        },
        {
          label: '审批通过',
          value: 'ok'
        },
        {
          label: '审批拒绝',
          value: 'rebut'
        },
        { label: '审批撤回', value: 'withdrawn' }
      ],
      listQuery: {
        approvalStatus: '', //审批状态:审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerCode: '', //供应商编码
        cooperativePartnerName: '', // 	供应商名称
        createByName: '',
        delivery: '', //发货方式(外协) 送货 deliver_goods、自提 self_pickup、快递 express_delivery、货运 freight_transport、到付 collect_payment
        deliveryEndDate: '', //交货结束日期
        deliveryStartDate: '',
        deliveryDate: '',
        endTime: '',
        orderNo: '', //订单号
        // orderType: 'external', //	订单类型 采购 procure、外协 external
        ringBlankQueryFlag: 1,
        productSource: '', //产品来源
        availableBatch:true,
        classAttribute: '',
        outFlag: 1,
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        ringBlankQueryFlag: 1,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'latest_storage_time'
          }
        ]
        // receivingStatus: 'receiving'
      },
      time: null,
      total: 0,
      computedValue: 0,
      computedValue2: 0,
      createRequirementDate: [],
      deliveryDate: [],
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now()
        // },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上个月',
            onClick(picker) {
              const end = new Date(moment(new Date().getTime()).format('YYYY-MM-01 00:00:00'))
              const start = new Date()
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      selectData: [],
      pages: 0, // 总页数
      printData: [], // 表格数据
      printForm: {}, // 表单数据
      //	收货状态 待收货 receiving、已收货 received,可用值:received,receiving,returned,returning
      receiptReturnType: [{ label: '未完成', value: 'receiving' }, { label: '已完成', value: 'received' }],
      columnList: [
        'cooperativePartnerCode',
        'excludingTaxTotalAmount',
        'taxAmount',
        'receivingStatus',
        'createByName',
        // 'weight',
        // 'proportion',
        // 'discount'
      ]
    }
  },
  async created() {
    await this.getDeputyUnit()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')

    if (this.isDeputyUnitSwitch === '1') {
      this.superQueryJson.forEach(item => {
        if (item.prop === 'mainUnit') {
          item.label = '单位(主)'
        }
      })
      this.superQueryJson.splice(5, 0, {
        prop: 'deputyUnit',
        label: '单位(副)',
        type: 'input'
      })

    }
    if (this.isProductNameSwitch === '1') {
      this.superQueryJson.splice(1, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.initData()
  },

  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    getDeputyUnit() {
      let obj = {
        businessCode: 'deputyUnit',
        configKey: `outDeputyUnit`
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isDeputyUnitSwitch = res.data.configValue1
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    // 导出
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter((item) => !!item.label && !!item.prop)
      columnList = columnList.map((item) => {
        return { label: item.label, prop: item.prop }
      })
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i]
      }
      const targetListQuery = this.listQuery
      let _data = {
        ...targetListQuery,
        exportType: '1211',
        exportName: '套圈毛坯库存查询',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then((res) => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    checkSelectable(row) {
      return true
      // return row.receivingStatus == 'not_finished'
    },
    // 选中列表的数据 将其带到生成订单下面表单表格中
    handeleFinshData(val) {
      this.selectData = val
    },

    columnSetFun() {
      this.$refs.tableForm.showDrawer()
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productDrawingNo' || prop === 'productCode' || prop === 'productCategoryName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },

    initData() {
      this.listLoading = true
      if (this.time && this.time.length > 0) {
        this.listQuery.lsSd = this.time[0] 
        this.listQuery.lsEd = this.time[1] 
      } else {
        this.listQuery.lsSd = ''
        this.listQuery.lsEd = ''
      }
      inventoryList(this.listQuery)
        .then((res) => {
          console.log(res, '外协订单列表')
          this.tableDataList = res.data.records
          this.tableFlag = true

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
      this.$refs['tableForm'].$refs.JNPFTable.clearSort()
      this.listQuery = {
        approvalStatus: '', //审批状态:审批中ing 审批通过ok 审核未通过rebut,可用值:ing,no,ok,rebut,wait
        cooperativePartnerCode: '', //供应商编码
        cooperativePartnerName: '', // 	供应商名称
        createByName: '',
        delivery: '', //发货方式(外协) 送货 deliver_goods、自提 self_pickup、快递 express_delivery、货运 freight_transport、到付 collect_payment
        deliveryEndDate: '', //交货结束日期
        deliveryStartDate: '',
        deliveryDate: '',
        endTime: '',
        availableBatch:true,
        orderNo: '', //订单号
        // orderType: 'external', //	订单类型 采购 procure、外协 external
        ringBlankQueryFlag: 1,
        productSource: '', //产品来源
        outFlag: 1,
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'latest_storage_time'
          }
        ]
        // receivingStatus: 'receiving'
      }
      this.time = []
      this.deliveryDate = []
      this.$refs.SuperQuery.conditionList = []
      this.search()
    },

    addSupplier(id, type) {
      if (this.selectData.length === 0) {
        return this.$message({
          message: '请选择你要生成的外协订单',
          type: 'error',
          duration: 1500
        })
      } else {
        let tempList = JSON.parse(JSON.stringify(this.selectData))
        let hasItemList = []

        let msg = this.selectData.every(item => item.externalProductsId)
        console.log(msg, 'ooo')
        if (msg) {
          this.formVisible = true
          this.$nextTick(() => {
            console.log(this.$refs, 'this.$refs')
            this.$refs.form.init(this.selectData, 'add', this.isProjectSwitch,'external')
          })
        } else {
          this.$message.error(`请配置毛坯产品所对应主产品的BOM！`)
        }
      }
    }
  }
}
</script>
