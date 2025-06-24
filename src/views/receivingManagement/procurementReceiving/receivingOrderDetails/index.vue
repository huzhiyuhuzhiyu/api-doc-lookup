<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <template v-for="item in searchList">
              <el-col :span="item.searchType === 3 ? 6 : 4">
                <el-form-item>
                  <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label" clearable
                    @keyup.enter.native="search('basic')" />

                  <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                    clearable>
                    <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                      :value="item2.value"></el-option>
                  </el-select>
                  <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                    :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                    :type="item.dateType"
                    :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                </el-form-item>
              </el-col>
            </template>

            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
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
            <div>
              <topOpts @add="addSupplier('', 'add')">
                <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm('dataTable')">
                  导出
                </el-button>
              </topOpts>
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

          <JNPF-table v-if="tableFlag" ref="dataTable" :data="tableData" :fixedNO="false" @sort-change="sortChange"
            custom-column :checkSelectable="checkSelectable" :setColumnDisplayList="columnList"
            @selection-change="handleSelectionChange" customKey="JNPFTableKey_457856">
            <el-table-column prop="orderNo" label="通知单单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="handleUserRelation(scope.row.purchaseReceiptReturnGoodsId, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="partnerName" label="供应商名称" width="200" sortable="custom" />
            <el-table-column prop="deliverDate" label="收货日期" width="120" sortable="custom"></el-table-column>
            <el-table-column prop="projectName" label="所属项目" width="120"
              v-if="isProjectSwitch === '1'"></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" width="160" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" />
            <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />

            <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch === '1' ? '单位(主)' : '单位'"
              :width="isDeputyUnitSwitch === '1' ? 85 : 60" />
            <el-table-column prop="deputyUnit" label="单位(副)" width="85" v-if="isDeputyUnitSwitch === '1'" />
            <el-table-column prop="weight" label="重量" min-width="120" />
          <el-table-column prop="proportion" label="比重" min-width="120" />
          <el-table-column prop="discount" label="折扣" min-width="120" />
            <el-table-column prop="receivedQuantity" label="收货数量" width="120" sortable="custom" />
            <el-table-column prop="receiptQuantity" label="入库数量" width="120" sortable="custom">
              <template slot-scope="scope">
                      <el-link type="primary" @click.native="viewFun(scope.row)">
                        {{ scope.row.receiptQuantity }}
                      </el-link>
                    </template>
            </el-table-column>
            <el-table-column prop="qualifiedQuantity" label="检验合格数量" width="140" sortable="custom" />
            <el-table-column prop="unqualifiedQuantity" label="检验不合格数量" width="150" sortable="custom" />

            <el-table-column prop="ordersNo" label="订单号" width="190" sortable="custom" />
            <AttributeColumns :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'purchase'" />
            <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="inspectionStatus" label="检验状态" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.inspectionStatus === 'unInspect'"><el-tag type="warning">待检验</el-tag></div>
                <div v-if="scope.row.inspectionStatus === 'inspecting'"><el-tag>检验中</el-tag></div>
                <div v-if="scope.row.inspectionStatus === 'inspected'"><el-tag type="success">已检验</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
            <el-table-column prop="createByName" label="创建人" width="100" sortable="custom" />

            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                  @click="addOrUpdateHandle(scope.row.purchaseReceiptReturnGoodsId, 'edit')">
                  编辑
                </el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus == 'draft' || scope.row.deliveryStatus == 'canceled' ? false : true
                  " @click="handleDel(scope.row.purchaseReceiptReturnGoodsId)">
                  删除
                </el-button>
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button type="text" size="mini">
                      {{ $t('common.moreBtn') }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="handleUserRelation(scope.row.purchaseReceiptReturnGoodsId, 'look')">
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="addSupplier(scope.row.purchaseReceiptReturnGoodsId, 'copy')">
                      复制通知单
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <InventQuityForm v-if="InventQuityFormVisible" ref="InventQuityFormRef"></InventQuityForm>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import {
  getQuotationdatasendlist,
  deleteQuotationsendlist,
  getQuotationdatasenddatalist,
  Cancelshipmentlist,
  Cancelshipmentlinelist
} from '@/api/salesManagement'
import ExportForm from '@/components/no_mount/ExportBox/index'
import Form from '../receivingAdvice/Form.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes } from '@/api/masterDataManagement/index'
import { purPurchaseReceiptReturnGoodsDetailList } from '@/api/purchasingManagement/purchaseInquirySheet'
import {
  getpurPurchaseReceiptReturnGoodsdetail,
  addpurPurchaseReceiptReturnGoods,
  editpurPurchaseReceiptReturnGoods,
  deletepurPurchaseReceiptReturnGoods
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import InventQuityForm from '@/views/warehouseManagement/finishedProductWarehouseManagement/inventory/Form.vue'
import { excelExport } from '@/api/basicData/index'
import { getBimBusinessDetail, getOrderFiledMap } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  components: { Form, ExportForm, SuperQuery,InventQuityForm },
  mixins: [getProjectList],
  data() {
    return {
      InventQuityFormVisible:false,
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      isDeputyUnitSwitch: '',
      tableFlag: false,
      basicQuery: {},
      superQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '通知单单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 }
      ],
      superForm: {},
      superQueryVisible: false,
      columnList: ['createByName'],
      linesTotal: 0,
      linesTableData: [],
      createTimeArrfahuo: [],
      exportFormVisible: false,
      deliveryDatefahuo: [],
      visible: false,
      detailVisible: false,
      treeData: [],
      tableData: [],
      detailTableData: [],
      treeLoading: false,
      listLoading: false,
      authorizeFormVisible: false,
      userRelationListVisible: false,
      organizeIdTree: [],
      activeName: 'orderList',
      salespersonList: [],
      detailFlag: false,

      paymentMethodList: [],
      paymentCycleList: [],
      orderForm: {},
      initOrderForm: {
        approvalStatus: '',
        createByName: '',
        deliverDate: '',
        deliverDateEnd: '',
        deliverDateStart: '',
        documentStatus: '',
        endTime: '',
        endUpdateTime: '',
        inspectionStatus: '',
        keyword: '',
        notificationType: 'procure',
        classAttribute: 'other',
        notificationTypeList: [],
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        orderNo: '',
        packingStatus: '',
        pageNum: 1,
        pageSize: 20,
        partnerCode: '',
        partnerName: '',
        productCode: '',
        productDrawingNo: '',
        productName: '',
        receiptReturnType: 'receipt',
        receivingStatus: '',
        salesman: '',
        startTime: '',
        startUpdateTime: '',
        superQuery: {
          condition: [
            {
              field: '',
              fieldValue: '',
              symbol: ''
            }
          ],
          matchLogic: ''
        },
        totalRowFlag: false,
        // receiptInboundFlag: 1
      },

      detailTotal: 0,
      salespersonList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      createTimeArr: [],
      // deliveryDateArr: [],
      orderDateArr: [],
      total: 0,
      diagramVisible: false,
      formVisible: false,
      btnLoading: false,
      selectArr: [],

      superQueryJson: [
        {
          prop: 'orderNo',
          label: '通知单单号',
          type: 'input'
        },
        {
          prop: 'partnerName',
          label: '供应商名称',
          type: 'input'
        },
        {
          prop: 'deliverDate',
          label: '退货日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
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
          type: 'input'
        },
        {
          prop: 'ordersNo',
          label: '订单号',
          type: 'input'
        },

        {
          prop: 'documentStatus',
          label: '单据状态',
          type: 'select',
          options: [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }]
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
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        }
      ]
    }
  },
  async created() {
    await this.getOrderFiledMap()
    await this.getDeputyUnit()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')

    if (this.isDeputyUnitSwitch === '1') {
      this.superQueryJson.forEach((item) => {
        if (item.prop === 'mainUnit') {
          item.label = '单位(主)'
        }
      })
      this.superQueryJson.splice(6, 0, {
        prop: 'deputyUnit',
        label: '单位(副)',
        type: 'input'
      })
    }
    if (this.isProductNameSwitch === '1') {
      this.searchList.push({
        field: 'productName',
        fieldValue: '',
        label: '产品名称',
        symbol: 'like',
        searchType: 1,
        width: 120
      })
      this.superQueryJson.splice(4, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }

    this.orderForm = JSON.parse(JSON.stringify(this.initOrderForm))
    this.superForm = this.orderForm
    this.search('basic')
  },
  methods: {
    // 查看库存明细
    viewFun(row) {
      this.InventQuityFormVisible = true
      this.$nextTick(() => {
        this.$refs.InventQuityFormRef.init(row, 'inventoryFlag', "", row.projectId)
      })
    },
    getOrderFiledMap() {
      getOrderFiledMap('purchase').then((res) => {
        this.standardValueFlag = res.data.standardValue
        this.materialFlag = res.data.material
        this.colourFlag = res.data.colour
        this.processFlag = res.data.process
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
      })
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    getDeputyUnit() {
      let obj = {
        businessCode: 'deputyUnit',
        configKey: `procureDeputyUnit`
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isDeputyUnitSwitch = res.data.configValue1
      })
    },
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },

    //禁用复选框
    checkSelectable(row) {
      if (
        row.documentStatus == 'submit' &&
        row.deliveryStatus == 'not_returned' &&
        row.receivedQuantity == 0 &&
        row.inspectionStatus !== 'inspected'
      )
        return true
      return false
    },
    // 选中得数据
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //批量取消退货
    Cancelshipment() {
      if (!this.selectArr.length) return this.$message.error('请先选择数据')
      this.$confirm('您确认取消选中的退货通知单吗？', this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          let a = this.selectArr.map((item) => {
            return item.id
          })
          Cancelshipmentlist(a).then((res) => {
            this.$message.success('取消成功')
            this.initData()
          })
        })
        .catch(() => { })
    },
    handleClick(e) {
      this.activeName = e.name
    },

    //排序
    sortChange({ prop, order }) {
      let newProp
      if (
        prop === 'partnerCode' ||
        prop === 'orderNo' ||
        prop === 'ordersNo' ||
        prop === 'partnerName' ||
        prop === 'createByName' ||
        prop === 'productCode' ||
        prop === 'productName' ||
        prop === 'productDrawingNo' ||
        prop === 'documentStatus' ||
        prop === 'createTime' ||
        prop === 'createByName'||
        prop=='productCategoryName'
      ) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.orderForm.orderItems[0].asc = order !== 'descending'
      this.orderForm.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.search('basic')
      }
    },
    initData() {
      this.listLoading = true
      if (this.isProjectSwitch === '1') {
        this.orderForm.projectId = this.userInfo.projectId
      }
      this.superForm = this.orderForm
      purPurchaseReceiptReturnGoodsDetailList(this.superForm)
        .then((res) => {
          this.tableData = res.data.records
          this.tableFlag = true

          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search(type) {
      if (this.orderDateArr && this.orderDateArr.length > 0) {
        this.superForm.rdsDate = this.orderDateArr[0]
        this.superForm.rdeDate = this.orderDateArr[1]
      } else {
        this.superForm.rdsDate = ''
        this.superForm.rdeDate = ''
      }
      if (this.createTimeArr && this.createTimeArr.length > 0) {
        this.superForm.startTime = this.createTimeArr[0].replace(/ 0(?!0)/g, ' ')
        this.superForm.endTime = this.createTimeArr[1].replace(/ 0(?!0)/g, ' ')
      } else {
        this.superForm.startTime = ''
        this.superForm.endTime = ''
      }
      Object.keys(this.superForm).forEach((key) => {
        // 清除搜索条件两端空格
        let item = this.superForm[key]
        this.superForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.superForm.pageNum = 1 // 重置页码
      // 区分 配置查询  和 高级查询  同时存在 高级查询覆盖配置查询
      if (type === 'basic') {
        this.basicQuery = {
          matchLogic: 'AND',
          condition: this.searchList
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm.superQuery = this.basicQuery
      }
      if (type === 'super') {
        this.superForm.superQuery = this.superQuery
      }
      this.initData()
    },
    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.createTimeArr = []
      this.orderDateArr = []
      this.orderForm = JSON.parse(JSON.stringify(this.initOrderForm))
      this.searchList = [
        { field: 'orderNo', fieldValue: '', label: '出入库单号', symbol: 'like', searchType: 1, width: 120 },
        {
          field: 'cooperativePartnerName',
          fieldValue: '',
          label: '供应商名称',
          symbol: 'like',
          searchType: 1,
          width: 120
        },
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 }
      ]
      if (this.isProductNameSwitch === '1') {
        this.searchList.push({
          field: 'productName',
          fieldValue: '',
          label: '产品名称',
          symbol: 'like',
          searchType: 1,
          width: 120
        })
        this.superQueryJson.splice(5, 0, {
          prop: 'productName',
          label: '产品名称',
          type: 'input'
        })
      }
      this.superForm = JSON.parse(JSON.stringify(this.orderForm))

      this.search('basic')
    },
    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype, false, [], 'outInboundWarehouse')
      })
    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        console.log(id)
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype, false)
        })
        // }, 600);
      }
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          deletepurPurchaseReceiptReturnGoods(id).then((res) => {
            this.initData()
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1500
            })
          })
        })
        .catch(() => { })
    },
    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType, false, [], 'outInboundWarehouse')
      })
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
      const targetListQuery = this.orderForm
      let _data = {
        ...targetListQuery,
        exportType: '1073',
        exportName: '采购收货单明细',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then((res) => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    }
  }
}
</script>
<!-- <style src="@/assets/scss/tabs-list.scss" lang="scss" scoped /> -->
<style lang="scss" scoped>
:v-deep .el-table__body-wrapper {
  height: auto !important;
}
</style>
