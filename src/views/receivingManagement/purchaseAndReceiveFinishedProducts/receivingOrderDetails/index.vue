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
              <topOpts @add="addSupplier('', 'add')" :addText="'创建收货单'">
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
            @selection-change="handleSelectionChange" customKey="JNPFTableKey_331310">
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
            <el-table-column prop="receivedQuantity" label="收货数量" width="120" sortable="custom" />

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
            <el-table-column prop="colour" :label="$store.getters.colour"  width="130" sortable="custom"
              v-if="colourFlag === '1'"></el-table-column>
            <el-table-column prop="ordersNo" label="订单号" width="190" sortable="custom" />
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
import { getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap } from '@/api/masterDataManagement/index'
import { purPurchaseReceiptReturnGoodsDetailList } from '@/api/purchasingManagement/purchaseInquirySheet'
import {
  getpurPurchaseReceiptReturnGoodsdetail,
  addpurPurchaseReceiptReturnGoods,
  editpurPurchaseReceiptReturnGoods,
  deletepurPurchaseReceiptReturnGoods
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import { excelExport, getOrderFiledMap } from '@/api/basicData/index'
import { getBimBusinessDetail } from '@/api/basicData/index'
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
        notificationType: 'procure',
        classAttribute: 'finish_product',
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
        // receiptInboundFlag:1
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
    if (this.isDeputyUnitSwitch === '1') {
      this.superQueryJson.forEach(item => {
        if (item.prop === 'mainUnit') {
          item.label = '单位(主)'
        }
      })
      this.superQueryJson.splice(7, 0, {
        prop: 'deputyUnit',
        label: '单位(副)',
        type: 'input'
      })

    }

    this.orderForm = JSON.parse(JSON.stringify(this.initOrderForm))

    this.search('basic')
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
    advancedQueryFuns() {
      // sealingCoverTyping //打字内容
      //     accuracyLevel //精度等级
      //     vibrationLevel //振动等级
      //     oil //油脂
      //     oilQuantity //油脂量
      //     clearance //游隙
      //     packagingMethod //包装方式
      //     specialRequire //特殊要求
      //     material // 保持架材质
      //     colour  //  颜色
      let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'mainUnit')
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
        prop === 'sealingCoverTyping' ||
        prop === 'accuracyLevel' ||
        prop === 'vibrationLevel' ||
        prop === 'oilQuantity' ||
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
      this.superForm = JSON.parse(JSON.stringify(this.initOrderForm))
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
      }
      this.search('basic')
    },
    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype, false, [],'outInboundWarehouse')
      })
    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        console.log(id)
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype, false, [],'outInboundWarehouse')
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
        this.$refs.Form.init(id, btnType, false, [],'outInboundWarehouse')
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
        exportName: '成品采购收货单明细',
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
        console.log(this.bimProductAttributesObj, 'this.bimProductAttributesObj')
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
