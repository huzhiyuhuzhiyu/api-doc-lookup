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
                <el-date-picker v-model="deliverDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                  start-placeholder="收货开始日期" end-placeholder="收货结束日期" clearable></el-date-picker>
              </el-form-item>
            </el-col>
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
        <div class="JNPF-common-layout-main JNPF-flex-main">
          <div class="JNPF-common-head">
            <div>
              <topOpts @add="addSupplier('', 'add')">
                <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm('dataTable')">
                  导出
                </el-button>
<!--                <el-button  :disabled="tableData.length > 0 ? false : true" size="mini" type="primary"-->
<!--                  icon="iconfont-menu  icon-chehui" @click="withdrawFun">撤回</el-button>-->
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
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" :fixedNO="true"
            :setColumnDisplayList="columnList" @sort-change="sortChange" custom-column
            :checkSelectable="checkSelectable" @selection-change="handleSelectionChange" hasC customKey="JNPFTableKey_496782">
            <el-table-column prop="orderNo" label="通知单单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.id, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="partnerCode" label="供应商编码" min-width="200" sortable="custom" />
            <el-table-column prop="partnerName" label="供应商名称" min-width="200" sortable="custom" />
            <el-table-column prop="salesman" label="操作员" width="100" sortable="custom" />
            <el-table-column prop="deliverDate" label="收货日期" width="120" sortable="custom"></el-table-column>

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
                  @click="addOrUpdateHandle(scope.row.id, 'edit')">
                  编辑
                </el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn" :disabled="scope.row.documentStatus == 'draft' || scope.row.deliveryStatus == 'canceled' ? false : true
                  " @click="handleDel(scope.row.id)">
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
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.id, 'look')">
                      查看详情
                    </el-dropdown-item>
<!--                    <el-dropdown-item @click.native="addSupplier(scope.row.id, 'copy')">-->
<!--                      复制通知单-->
<!--                    </el-dropdown-item>-->
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

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList" />

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import {
  purPurchaseReceiptReturnGoodsList,
  deleteQuotationsendlist,
  getQuotationdatasenddatalist,
  Cancelshipmentlist,
  Cancelshipmentlinelist,
  mergelist,
  splitlist,
  batchWithdrawalOrder
} from '@/api/purchasingAndOutsourcingOrders'
import {
  getpurPurchaseReceiptReturnGoodsdetail,
  addpurPurchaseReceiptReturnGoods,
  editpurPurchaseReceiptReturnGoods,
  deletepurPurchaseReceiptReturnGoods
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import { UserListAll } from '@/api/permission/user'
import SuperQuery from '@/components/SuperQuery/index.vue'
import Form from './Form'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  name: 'foreigntradenotice',
  components: { Form, SuperQuery, ExportForm },
  mixins: [getProjectList],
  props: {
    queryObject: {
      type: Object,
      default: () => ({
        sourceList: ['sale_order_finished_product']
      })
    }
  },
  data() {
    return {
      isProjectSwitch: '',
      tableDataFlag: false,
      basicQuery: {},
      superQuery: {},
      searchList: [
        { field: 'orderNo', fieldValue: '', label: '通知单单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
      ],
      superForm: {},
      superQueryVisible: false,
      columnList: [],
      deliverDateArr: [],
      exportFormVisible: false,
      qxbtnLoading: false,
      hbbtnLoading: false,
      btnLoading: false,
      linesTotal: 0,
      linesTableData: [],
      createTimeArrfahuo: [],
      deliveryDatefahuo: [],
      customList: [], // 列表中显示的自定义属性
      title: '更多查询',
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
      detailFlag: false,
      exchangeList: [{ label: '正常发货', value: false }, { label: '换货发货', value: true }],
      shipmentsStateList: [{ label: '未完成', value: 'undelivered' }, { label: '已完成', value: 'delivered' }],
      orderStateList: [{ label: '待检验', value: 'unInspect' }, { label: '已检验', value: 'inspected' }],
      isfullReceiptFlag: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
      documentStateList: [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }],
      approvalStateList: [
        { label: '审批中', value: 'ing' },
        { label: ' 审批通过', value: 'ok' },
        { label: '审批拒绝', value: 'rebut' }
      ],
      departMentList: [
        { label: '送货', value: 'deliver_goods' },
        { label: '自提', value: 'self_pickup' },
        { label: '快递', value: 'express_delivery' },
        { label: '货运', value: 'freight_transport' },
        { label: '到付', value: 'collect_payment' }
      ],
      paymentMethodList: [],
      paymentCycleList: [],
      orderForm: {},
      orderFormlist: {
        ...this.queryObject,
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
        notificationTypeList: [],
        orderItems: [
          {
            asc: false,
            column: 'create_time'
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
        totalRowFlag: false
      },

      detailTotal: 0,
      salespersonList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      createTimeArr: [],
      deliveryDateArr: [],

      total: 0,
      diagramVisible: false,
      formVisible: false,
      selectArr: [],
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '通知单单号',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: '供应商编码',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerName',
          label: '供应商名称',
          type: 'input'
        },
        {
          prop: 'salesman',
          label: '操作员',
          type: 'input'
        },
        {
          prop: 'deliverDate',
          label: '收货日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'documentStatus',
          label: '单据状态',
          type: 'select',

          options: [
            { label: '草稿', value: 'draft' },
            { label: '提交', value: 'submit' },

          ]
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
      ]
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')

    this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.superForm = this.orderForm
    this.search('basic')
    // this.getAttributeline()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },

  methods: {
    withdrawFun() {
      if (!this.selectArr.length) return this.$message.error("请选择您要撤回的数据")
      const idArray = this.selectArr.map(item => item.id);
      this.$confirm("您确定撤回所选择的数据吗?", "提示", {
        type: 'warning'
      }).then(() => {
        batchWithdrawalOrder(idArray).then(res => {
          this.$message.success('撤回成功')
          this.initData()
        })
      }).catch(() => {

      })

    },
    //明细列表取消发货
    Cancelshipmentline(id) {
      this.$confirm('您确认取消选中的发货通知单吗（已备货商品需手动处理）？', this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          Cancelshipmentlinelist(id).then((res) => {
            this.$message.success('取消成功')
            this.initData()
          })
        })
        .catch(() => { })
    },
    //禁用复选框
    checkSelectable(row) {
      if (row.documentStatus == 'draft' ) return false
      return true
    },
    // 选中得数据
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //批量取消发货
    Cancelshipment() {
      if (!this.selectArr.length) return this.$message.error('请先选择数据')
      let hasItemList = []
      this.selectArr.map((i) => {
        if (i.outboundQuantity > 0) hasItemList.push(i.orderNo)
      })
      if (hasItemList.length) return this.$message.error(`已出库的订单：${hasItemList.join('、')}不能取消发货`)
      this.$confirm('您确认取消选中的发货通知单吗（已备货商品需手动处理）？', this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          let a = this.selectArr.map((item) => {
            return item.id
          })
          this.qxbtnLoading = true
          Cancelshipmentlist(a)
            .then((res) => {
              this.qxbtnLoading = false
              this.$message.success('取消成功')
              this.initData()
            })
            .catch(() => {
              this.qxbtnLoading = false
            })
        })
        .catch(() => { })
    },

    handleClick(e) {
      this.activeName = e.name
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'partnerCode' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName') {
        if (prop === 'createByName') {
          newProp = 'create_by'
        } else {
          newProp = prop
        }
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      this.superForm.orderItems[0].asc = order !== 'descending'
      this.superForm.orderItems[0].column = order === null ? '' : newProp

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
      purPurchaseReceiptReturnGoodsList(this.superForm)
        .then((res) => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    superQuerySearch(query) {
      this.superQuery = query
      this.superQueryVisible = false
      this.search('super')
    },
    search(type) {
      if (this.deliverDateArr.length > 0) {
        this.superForm.deliverDateStart = this.deliverDateArr[0]
        this.superForm.deliverDateEnd = this.deliverDateArr[1]
      } else {
        this.superForm.deliverDateStart = ''
        this.superForm.deliverDateEnd = ''
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
      this.deliverDateArr = []
      this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
      this.searchList = [
        { field: 'orderNo', fieldValue: '', label: '通知单单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'partnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 }
      ]
      this.superForm = JSON.parse(JSON.stringify(this.orderForm))
      this.search('basic')
    },
    addSupplier(id, btntype) {
      // if (this.selectArr.length === 0) {
      //   this.$message.error('请选择通知单')
      //   return
      // }
      // const firstSource = this.selectArr[0].source
      // const hasDifferentSource = this.selectArr.some(item => item.source !== firstSource)
      // if (hasDifferentSource) {
      //   this.$message.error('只能选择相同来源的明细订单')
      //   return
      // }
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype, false, [],'',this.queryObject.sourceList)
      })
    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
        console.log(id)
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype, false, [])
        })
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
    //确认收货
    confirmreceipt(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
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
        exportType: '1072',
        exportName: '成品采购收货单',
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
