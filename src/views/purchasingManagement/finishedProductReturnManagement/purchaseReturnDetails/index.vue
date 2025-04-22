<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderForm.orderNo" placeholder="单号" clearable @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderForm.partnerName" placeholder="供应商名称" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="4" v-if="isProductNameSwitch === '1'">
              <el-form-item>
                <el-input v-model.trim="orderForm.productName" placeholder="产品名称" clearable
                  @keyup.enter.native="search()" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-date-picker v-model="orderDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                  start-placeholder="退货开始日期" end-placeholder="退货结束日期" clearable></el-date-picker>
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
            @selection-change="handleSelectionChange">
            <el-table-column prop="orderNo" label="单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary"
                  @click.native="handleUserRelation(scope.row.purchaseReceiptReturnGoodsId, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="partnerName" label="供应商名称" width="200" sortable="custom" />
            <el-table-column prop="partnerCode" label="供应商编码" width="200" sortable="custom" />
            <el-table-column prop="deliverDate" label="退货日期" width="120" sortable="custom"></el-table-column>
            <el-table-column prop="projectName" label="所属项目" width="120" sortable="custom"
              v-if="isProjectSwitch === '1'"></el-table-column>
            <el-table-column prop="productCode" label="产品编码" width="140" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" width="160" sortable="custom" />
                <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
            <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch === '1' ? '单位(主)' : '单位'"
              :width="isDeputyUnitSwitch === '1' ? 85 : 60" />
            <el-table-column prop="deputyUnit" label="单位(副)" width="85" v-if="isDeputyUnitSwitch === '1'" />
            <el-table-column prop="receivedQuantity" label="退货数量" width="160" sortable="custom" />

            <el-table-column prop="sealingCoverTyping" min-width="140" :label="$store.getters.sealingCoverTyping"  sortable="custom"
              v-if="sealingCoverTypingFlag === '1'" />
            <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  min-width="120" sortable="custom"
              v-if="accuracyLevelFlag === '1'" />
            <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" sortable="custom"
              v-if="vibrationLevelFlag === '1'" />
            <el-table-column prop="oil" label="油脂" min-width="120" sortable="custom" v-if="oilFlag === '1'" />
            <el-table-column prop="oilQuantity" label="油脂量" min-width="140" sortable="custom"
              v-if="oilQuantityFlag === '1'" />
            <el-table-column prop="clearance" label="游隙" min-width="120" sortable="custom"
              v-if="clearanceFlag === '1'" />
            <el-table-column prop="packagingMethod" label="包装方式" min-width="120" sortable="custom"
              v-if="packagingMethodFlag === '1'" />
            <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  min-width="120" sortable="custom"
              v-if="specialRequireFlag === '1'" />
            <el-table-column prop="material" label="材质" width="130" sortable="custom"
              v-if="materialFlag === '1'"></el-table-column>
            <el-table-column prop="colour" :label="$store.getters.colour"  width="130"
              v-if="colourFlag === '1'"></el-table-column>
            <el-table-column prop="ordersNo" label="订单号" width="200" sortable="custom" v-if="$store.getters.configData.return.purchase_order" />
            <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
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
import Form from '../purchaseReturnNote/Form.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesObj, getbimProductAttributes, getbimProductAttributesListMap } from '@/api/masterDataManagement/index'
import { purPurchaseReceiptReturnGoodsDetailList } from '@/api/purchasingManagement/purchaseInquirySheet'
import {
  getpurPurchaseReceiptReturnGoodsdetail,
  addpurPurchaseReceiptReturnGoods,
  editpurPurchaseReceiptReturnGoods,
  deletepurPurchaseReceiptReturnGoods
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import { excelExport } from '@/api/basicData/index'
import { getBimBusinessDetail, getOrderFiledMap } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  components: { Form, ExportForm, SuperQuery },
  mixins: [getProjectList],

  data() {
    return {
      isProjectSwitch: '',
      isProductNameSwitch: '',
      tableDataFlag: false,
      isDeputyUnitSwitch: '',
      tableFlag: false,
      superQueryVisible: false,
      columnList: ['createByName'],
      orderDateArr: [],
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
      exchangeList: [{ label: '退货', value: false }, { label: '换货', value: true }],
      shipmentsStateList: [{ label: '待发货', value: 'undelivered' }, { label: '已发货', value: 'delivered' }],
      orderStateList: [{ label: '待检验', value: 'unInspect' }, { label: '已检验', value: 'inspected' }],
      isfullReceiptFlag: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
      documentStateList: [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }],

      approvalStateList: [
        { label: '审批中', value: 'ing' },
        { label: ' 审批通过', value: 'ok' },
        { label: '审批拒绝', value: 'rebut' }
      ],

      departMentList: [
        { lebel: '送货', value: 'deliver_goods' },
        { lebel: '自提', value: 'self_pickup' },
        { lebel: '快递', value: 'express_delivery' },
        { lebel: '货运', value: 'freight_transport' },
        { lebel: '到付', value: 'collect_payment' }
      ],
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
        classAttribute: 'finish_product',
        notificationType: 'procure',
        notificationTypeList: [],
        orderItems: [
          {
            asc: true,
            column: ''
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
        receiptReturnType: 'back',
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
        totalRowFlag: false
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
          label: '单号',
          type: 'input'
        },
        {
          prop: 'partnerName',
          label: '客户名称',
          type: 'input'
        },
        {
          prop: 'partnerCode',
          label: '客户编码',
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
          prop: 'mainUnit',
          label: '单位',
          type: 'input'
        },
        {
          prop: 'deliveryQuantity',
          label: '退货数量',
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
      ],
      // 属性字段  控制属性字段显示隐藏
      accuracyLevelFlag: "",
      clearanceFlag: "",
      oilFlag: "",
      oilQuantityFlag: "",
      packagingMethodFlag: "",
      sealingCoverTypingFlag: "",
      specialRequireFlag: "",
      vibrationLevelFlag: "",
      materialFlag: '',
      colourFlag: '',
      bimProductAttributesObj: {}
    }
  },
  async created() {
    await this.getOrderFiledMap()
    await this.getDeputyUnit()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'receivedQuantity')
    // if (this.processFlag === '1') {
    //   this.superQueryJson.splice(classIndex + 1, 0, {
    //     prop: 'processName',
    //     label: '工序',
    //     type: 'select',
    //     options: this.processList.map((item) => {
    //       return {
    //         label: item.name,
    //         value: item.name
    //       }
    //     })
    //   })
    // }
    if (this.colourFlag === '1') {
      this.superQueryJson.splice(classIndex + 1, 0, {
        prop: 'colour',
        label: '颜色',
        type: 'select',
        options: this.bimProductAttributesObj.pa010.map((item) => {
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
        label: '材质',
        type: 'select',
        options: this.bimProductAttributesObj.pa021.map((item) => {
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
        options: this.bimProductAttributesObj.pa016.map((item) => {
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
        options: this.bimProductAttributesObj.pa015.map((item) => {
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
        options: this.bimProductAttributesObj.pa001.map((item) => {
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
        options: this.bimProductAttributesObj.pa003.map((item) => {
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
        options: this.bimProductAttributesObj.pa002.map((item) => {
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
        options: this.bimProductAttributesObj.pa005.map((item) => {
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
        options: this.bimProductAttributesObj.pa006.map((item) => {
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
        options: this.bimProductAttributesObj.pa007.map((item) => {
          return {
            label: item.name,
            value: item.name
          }
        })
      })
    }

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

    this.orderForm = JSON.parse(JSON.stringify(this.initOrderForm))

    this.search()
  },
  watch: {
    activeName() {
      this.search()
    }
  },
  mounted() {
    this.getProductClassFun()
  },
  methods: {
    getOrderFiledMap() {
      getOrderFiledMap('purchase').then((res) => {
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
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
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
        [
          'orderNo',
          'partnerName',
          'partnerCode',
          'productCode',
          'productName',
          'productDrawingNo',
          'projectName',
          'productCategoryName',
          'createByName',
          'sealingCoverTyping',
          'accuracyLevel',
          'vibrationLevel',
          'oilQuantity',
          'ordersNo',
          'documentStatus',
          'createTime'
        ].includes(prop)
      ) {
        if (prop === 'createByName') {
          newProp = 'createBy'
        } else {
          newProp = prop
        }
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
        this.search()
      }
    },
    initData() {
      this.listLoading = true
      this.orderForm.inspectionFlag=false
      purPurchaseReceiptReturnGoodsDetailList(this.orderForm)
        .then((res) => {
          this.tableData = res.data.records
          this.tableFlag = true
          if (this.isDeputyUnitSwitch === '1') {

          }
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search() {
      if (this.orderDateArr && this.orderDateArr.length > 0) {
        this.orderForm.deliverDateStart = this.orderDateArr[0]
        this.orderForm.deliverDateEnd = this.orderDateArr[1]
      } else {
        this.orderForm.deliverDateStart = ''
        this.orderForm.deliverDateEnd = ''
      }
      if (this.createTimeArr && this.createTimeArr.length > 0) {
        this.orderForm.startTime = this.createTimeArr[0].replace(/ 0(?!0)/g, ' ')
        this.orderForm.endTime = this.createTimeArr[1].replace(/ 0(?!0)/g, ' ')
      } else {
        this.orderForm.startTime = ''
        this.orderForm.endTime = ''
      }
      Object.keys(this.orderForm).forEach((key) => {
        // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码

      this.initData()
    },
    reset() {
      this.tableFlag = true
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.createTimeArr = []
      this.orderDateArr = []
      this.orderForm = JSON.parse(JSON.stringify(this.initOrderForm))
      this.$refs.SuperQuery.conditionList = []
      this.search()
    },
    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        console.log(id)
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype)
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
        this.$refs.Form.init(id, btnType, false, 'outInboundWarehouse')
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
        exportName: '退货通知单明细',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then((res) => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesObj = res.data
      })
      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log('税率', this.taxRateList)
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
