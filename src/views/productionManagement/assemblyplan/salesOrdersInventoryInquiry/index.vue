<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4" v-if="isProductNameSwitch === '1'">
              <el-form-item>
                <el-input v-model.trim="listQuery.orderNo" placeholder="订单号" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listQuery.cooperativePartnerName" placeholder="客户名称" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model.trim="listQuery.productDrawingNo" placeholder="品名规格" clearable
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
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <topOpts @add="addSupplier('', 'add')" addText="新建任务">
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
          <JNPF-table @selection-change="handeleFinshData" hasC v-if="tableFlag" highlight-current-row :fixedNO="true"
            ref="tableForm" :data="tableDataList" @sort-change="sortChange" custom-column
            :checkSelectable="checkSelectable" :setColumnDisplayList="columnList">
            <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
              v-if="isProjectSwitch == 1" />
            <el-table-column prop="orderNo" label="订单号" width="160" sortable="custom" />
            <el-table-column prop="cooperativePartnerName" label="客户名称" width="150" sortable="custom" />
            <el-table-column prop="cooperativePartnerCode" label="客户编码" width="150" sortable="custom" />
            <el-table-column prop="productCode" label="产品编码" width="150" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" width="120"
              v-if="isProductNameSwitch === '1'"></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="180" sortable="custom"></el-table-column>
            <el-table-column prop="productCategoryName" label="产品分类" width="120" sortable="custom" />
            <el-table-column prop="pairingModeName" label="配对方式" width="160" sortable="custom" />

            <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch === '1' ? '单位(主)' : '单位'"
              :width="isDeputyUnitSwitch === '1' ? 85 : 60" />
            <el-table-column prop="deputyUnit" label="单位(副)" width="85" v-if="isDeputyUnitSwitch === '1'" />
            <!-- <el-table-column prop="weight" label="重量(kg)" width="90" />
            <el-table-column prop="proportion" label="比重" width="80" />
            <el-table-column prop="discount" label="折扣" width="80" /> -->
            <el-table-column prop="num" label="订单数量" width="120" sortable="custom" />
            <el-table-column prop="inventoryQuantity" label="库存数量" width="120" sortable="custom" />
            <el-table-column prop="availableQuantity" label="可用数量" width="120" sortable="custom" />
            <el-table-column prop="occupancyQuantity" label="占用数量" width="120" sortable="custom" />
            <el-table-column prop="batchNumber" label="批次号" min-width="180" sortable="custom" />
            <el-table-column prop="warehouseName" label="仓库" width="120" sortable="custom" />
            <el-table-column prop="shelfSpaceName" label="库位" width="120" sortable="custom" />
            <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" sortable="custom"
              v-if="sealingCoverTypingFlag == 1" />
            <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom"
              v-if="accuracyLevelFlag == 1" />
            <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"
              v-if="vibrationLevelFlag == 1" />
            <el-table-column prop="oil" label="油脂" width="100" sortable="custom" v-if="oilFlag == 1" />
            <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom" v-if="oilQuantityFlag == 1" />
            <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" v-if="clearanceFlag == 1" />
            <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"
              v-if="packagingMethodFlag == 1" />
            <el-table-column prop="specialRequire" label="特殊要求" width="120" sortable="custom"
              v-if="specialRequireFlag == 1" />
            <el-table-column prop="material" label="保持架材质" width="130" sortable="custom"
              v-if="materialFlag == 1"></el-table-column>
            <el-table-column prop="colour" label="颜色" width="120" sortable="custom"
              v-if="colourFlag == 1"></el-table-column>
            <el-table-column prop="latestStorageTime" label="最新入库时间" width="220" sortable="custom" />
          </JNPF-table>
          <pagination :total="total" :page.sync="listQuery.pageNum" :background="background"
            :limit.sync="listQuery.pageSize" @pagination="initData">
          </pagination>
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
import Form from '../finishedProductInventoryInquiry/Form.vue'
import { excelExport, getOrderFiledMap } from '@/api/basicData/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getSalesOrdersInventoryLineReport } from '@/api/basicData/index' // 仓库
import { getBimBusinessDetail } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { getbimProductAttributesListMap } from '@/api/masterDataManagement/index'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'salesOrdersInventoryInquiry',
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
          prop: 'orderNo',
          label: '订单号',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerName',
          label: '客户名称',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: '客户编码',
          type: 'input'
        },
        {
          prop: 'productCode',
          label: '产品编码',
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: '品名规格',
          type: 'input'
        },

        {
          prop: 'productCategoryName',
          label: '产品分类',
          type: 'input'
        },
        {
          prop: 'pairingModeName',
          label: '配对方式',
          type: 'input'
        },
        {
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },
        {
          prop: 'num',
          label: '订单数量',
          type: 'input'
        },
        {
          prop: 'inventoryQuantity',
          label: '库存数量',
          type: 'input'
        },
        {
          prop: 'availableQuantity',
          label: '可用数量',
          type: 'input'
        },
        {
          prop: 'occupancyQuantity',
          label: '占用数量',
          type: 'input'
        },
        {
          prop: 'batchNumber',
          label: '批次号',
          type: 'input'
        },

        {
          prop: 'batchNumber',
          label: '批次号',
          type: 'input'
        },
        {
          prop: 'warehouseName',
          label: '仓库',
          type: 'input'
        },
        {
          prop: 'shelfSpaceName',
          label: '库位',
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
        orderNo: "",
        cooperativePartnerName: "",
        productDrawingNo: "",
        pageNum: 1,
        pageSize: 20,
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
      },
      time: null,
      total: 0,
      computedValue: 0,
      computedValue2: 0,
      createRequirementDate: [],

      selectData: [],
      pages: 0, // 总页数
      columnList: ['weight', 'proportion', 'discount', 'cooperativePartnerCode', 'productCode'],
      inventoryQuantityNum: 0,
      occupancyQuantityNum: 0,
      availableQuantityNum: 0,
      // 属性字段  控制属性字段显示隐藏
      accuracyLevelFlag: '',
      clearanceFlag: '',
      oilFlag: '',
      oilQuantityFlag: '',
      packagingMethodFlag: '',
      sealingCoverTypingFlag: '',
      specialRequireFlag: '',
      vibrationLevelFlag: '',
      materialFlag: '',
      colourFlag: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  async created() {
    await this.getDeputyUnit()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    if (this.isDeputyUnitSwitch === '1') {
      let mainUnitIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'mainUnit')
      this.superQueryJson.forEach((item) => {
        if (item.prop === 'mainUnit') {
          item.label = '单位(主)'
        }
      })
      this.superQueryJson.splice(mainUnitIndex + 1, 0, {
        prop: 'deputyUnit',
        label: '单位(副)',
        type: 'input'
      })
    }
    if (this.isProductNameSwitch === '1') {
      let productCodeIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'productCode')
      this.superQueryJson.splice(productCodeIndex + 1, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    await this.getProductClassFun()
    await this.getOrderFiledMap()
    await this.advancedQueryFuns()
    this.initData()
  },

  methods: {
    async getOrderFiledMap() {
      await getOrderFiledMap('sale').then((res) => {
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
        this.materialFlag = res.data.material
        this.colourFlag = res.data.colour
      })
    },
    async getProductClassFun() {
      // 产品属性
      await getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })
    },
    advancedQueryFuns() {
      // sealingCoverTyping //打字内容
      //     accuracyLevel //精度等级
      //     vibrationLevel //振动等级
      //     oil //油脂
      //     oilQuantity //油脂量
      //     clearance //游隙
      //     packagingMethod //包装方式
      //     specialRequire //特殊要求
      //     material //保持架材质
      //     colour //颜色
      let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'shelfSpaceName')
      if (this.colourFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'colour',
          label: '颜色',
          type: 'select',
          options: this.bimProductAttributesList.pa010.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.materialFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'material',
          label: '保持架材质',
          type: 'select',
          options: this.bimProductAttributesList.pa021.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.specialRequireFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'specialRequire',
          label: '特殊要求',
          type: 'select',
          options: this.bimProductAttributesList.pa016.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.packagingMethodFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: this.bimProductAttributesList.pa015.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.clearanceFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'clearance',
          label: '游隙',
          type: 'select',
          options: this.bimProductAttributesList.pa001.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.oilQuantityFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'oilQuantity',
          label: '油脂量',
          type: 'select',
          options: this.bimProductAttributesList.pa003.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.oilFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'oil',
          label: '油脂',
          type: 'select',
          options: this.bimProductAttributesList.pa002.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.vibrationLevelFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'vibrationLevel',
          label: '振动等级',
          type: 'select',
          options: this.bimProductAttributesList.pa005.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.accuracyLevelFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'accuracyLevel',
          label: '精度等级',
          type: 'select',
          options: this.bimProductAttributesList.pa006.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.sealingCoverTypingFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'sealingCoverTyping',
          label: '打字内容',
          type: 'select',
          options: this.bimProductAttributesList.pa007.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
    },
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
        exportType: '1243',
        exportName: '销售订单库存查询',
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
      if (
        // prop === 'productDrawingNo' ||
        // prop == 'productDrawingNo' ||
        prop === 'productCode'
      ) {
        newProp = prop
      } else if (
        prop === 'warehouseName'
      ) {
        newProp = 'ware_house_name'
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.listQuery.orderItems[0].asc = order !== 'descending'
      this.listQuery.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },

    initData() {
      this.listLoading = true
      if (this.isProjectSwitch === '1') {
        if (this.userInfo.projectId === '1') {
          this.listQuery.projectId = ''
        } else {
          this.listQuery.projectId = this.userInfo.projectId
        }

      }
      getSalesOrdersInventoryLineReport(this.listQuery)
        .then((res) => {
          console.log(res, '外协订单列表')
          this.tableDataList = res.data.records.map(item => {
            if (!item.inventoryQuantity) {
              item.inventoryQuantity = 0
            }
            if (!item.availableQuantity) {
              item.availableQuantity = 0
            }
            if (!item.occupancyQuantity) {
              item.occupancyQuantity = 0
            }
            return item
          })
          console.log(this.tableDataList, 'this.tableDataList')
          this.tableFlag = true

          this.total = res.data.total
          this.inventoryQuantityNum = res.data.total ? res.data.total.inventoryQuantity : 0
          this.occupancyQuantityNum = res.data.total ? res.data.total.occupancyQuantity : 0
          this.availableQuantityNum = res.data.total ? res.data.total.availableQuantity : 0
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
        orderNo: "",
        cooperativePartnerName: "",
        productDrawingNo: "",
        pageNum: 1,
        pageSize: 20,
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
      }

      this.$refs.SuperQuery.conditionList = []
      this.search()
    },

    addSupplier(id, type) {
      if (!this.selectData.length) return this.$message.error('请选择你要新建的任务数据')
      if (this.selectData.length > 1) return this.$message.error('只能选择一条数据')
      console.log(this.selectData[0].inventoryQuantity, 'this.selectData[0].inventoryQuantity')
      if (Number(this.selectData[0].inventoryQuantity) === 0) {
        return this.$message({
          message: '请选择库存数量不为0的销售订单',
          type: 'error',
          duration: 1500
        })
      } else {
        this.formVisible = true
        this.$nextTick(() => {
          console.log(this.$refs, 'this.$refs')
          this.$refs.form.init(this.selectData, 'add', this.isProjectSwitch)
        })
      }
    }
  }
}
</script>
