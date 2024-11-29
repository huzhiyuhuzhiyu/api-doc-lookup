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
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="orderForm.productDrawingNo" placeholder="品名规格" clearable
                  @keyup.enter.native="search()" />
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
              <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="addSupplier('', 'add')">
                新建
              </el-button>
              <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm('dataTable')">
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
          <JNPF-table v-if="tableFlag" ref="dataTable" :data="tableData" :fixedNO="true" @sort-change="sortChange"
            custom-column :checkSelectable="checkSelectable" @selection-change="handleSelectionChange" hasC
            :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.returnDeliveryNoticeId, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="partnerName" label="供应商名称" width="200" sortable="custom" />
            <el-table-column prop="partnerCode" label="供应商编码" width="200" sortable="custom" />
            <el-table-column prop="deliverDate" label="发料日期" width="180" sortable="custom"></el-table-column>
            <el-table-column prop="projectName" label="所属项目" width="120"
              v-if="isProjectSwitch === '1'"></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" width="160" sortable="custom" />
            <el-table-column prop="productCode" label="产品编码" width="160" sortable="custom" />
            <el-table-column prop="processName" label="工序名称" width="160" sortable="custom" />
            <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch === '1' ? '单位(主)' : '单位'"
              :width="isDeputyUnitSwitch === '1' ? 85 : 60" />
            <el-table-column prop="deputyUnit" label="单位(副)" width="85" v-if="isDeputyUnitSwitch === '1'" />
            <el-table-column prop="deliveryQuantity" label="订单数量" width="160" sortable="custom" />
            <el-table-column prop="deliveryDate" label="交货日期" width="120" sortable="custom" />
            <el-table-column prop="documentStatus" label="单据状态" width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag></div>
                <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" :disabled="scope.row.documentStatus == 'draft' ? false : true"
                  @click="addOrUpdateHandle(scope.row.returnDeliveryNoticeId, 'edit')">
                  编辑
                </el-button>
                <el-button size="mini" type="text" class="JNPF-table-delBtn"
                  :disabled="scope.row.documentStatus == 'draft' ? false : true"
                  @click="handleDel(scope.row.returnDeliveryNoticeId)">
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
                    <el-dropdown-item @click.native="handleUserRelation(scope.row.returnDeliveryNoticeId, 'look')">
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="addSupplier(scope.row.id, 'copy')">
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

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import {
  getQuotationdatasendlist,
  deleteQuotationsendlist,
  getQuotationdatasenddatalist,
  Cancelshipmentlist,
  Cancelshipmentlinelist,
  mergelist,
  splitlist,
  getOutlineDatalist
} from '@/api/salesManagement'
import { UserListAll } from '@/api/permission/user'
import Form from '../materialsIssueNotice/Form'
import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getBimBusinessDetail } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  name: 'foreigntradenotice',
  components: { Form, SuperQuery, ExportForm },
  mixins: [getProjectList],

  data() {
    return {
      isProjectSwitch: '',
      tableDataFlag: false,
      isDeputyUnitSwitch: '',
      tableFlag: false,
      columnList: ['partnerCode', 'productCode'],
      superQueryVisible: false,
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
      salespersonList: [],
      detailFlag: false,
      exchangeList: [{ label: '正常发料', value: false }, { label: '换货发料', value: true }],
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
        externalFlag: 1,
        returnDeliveryType: 'delivery',
        orderNo: '',
        partnerCode: '',
        partnerName: '',
        rdsDate: '',
        rdeDate: '',
        inspectionStatus: '',
        documentStatus: '',
        createByName: '',
        approvalStatus: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        superQuery: {},
        orderItems: [
          {
            asc: true,
            column: 'order_no'
          }
        ]
      },
      linesQuery: {},

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
      orderDateArr: [],
      total: 0,
      diagramVisible: false,
      formVisible: false,
      selectArr: [],
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '单号',
          type: 'input'
        },
        {
          prop: 'partnerName',
          label: '供应商名称',
          type: 'input'
        },
        {
          prop: 'partnerCode',
          label: '供应商编码',
          type: 'input'
        },
        {
          prop: 'deliverDate',
          label: '发料日期',
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
          prop: 'deliveryQuantity',
          label: '订单数量',
          type: 'input'
        },
        {
          prop: 'deliveryDate',
          label: '交货日期',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          pickerOptions: this.global.timePickerOptions
        },
        {
          prop: 'documentStatus',
          label: '单据状态',
          type: 'select',
          options: [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }]
        }
      ]
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
  
    this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.getDeputyUnit()
    this.search()
    // this.getAttributeline()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
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
    getDeputyUnit() {
      let obj = {
        businessCode: 'deputyUnit',
        configKey: `outDeputyUnit`
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isDeputyUnitSwitch = res.data.configValue1
      })
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      let obj1 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa007',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj1).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'sealingCoverTyping')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj2 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa006',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj2).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'accuracyLevel')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa005',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj3).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'vibrationLevel')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa002',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj4).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'oil')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj5 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa003',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj5).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'oilQuantity')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj6 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa001',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }

      getbimProductAttributesList(obj6).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'clearance')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })
      let obj7 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa015',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'code'
          }
        ]
      }
      getbimProductAttributesList(obj7).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let oilObj = this.superQueryJson.find((item) => item.prop === 'packagingMethod')

        if (oilObj) {
          // 将options赋值为5
          oilObj.options = arr
        }
      })

      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log('税率', this.taxRateList)
      })
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    //明细列表取消发料
    Cancelshipmentline(id) {
      this.$confirm('您确认取消选中的发料通知单吗（已备货商品需手动处理）？', this.$t('common.tipTitle'), {
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
      if (row.deliveryStatus !== 'not_finished' || row.documentStatus == 'draft') return false
      return true
    },
    // 选中得数据
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //批量取消发料
    Cancelshipment() {
      if (!this.selectArr.length) return this.$message.error('请先选择数据')
      let hasItemList = []
      this.selectArr.map((i) => {
        if (i.outboundQuantity > 0) hasItemList.push(i.orderNo)
      })
      if (hasItemList.length) return this.$message.error(`已出库的订单：${hasItemList.join('、')}不能取消发料`)
      this.$confirm('您确认取消选中的发料通知单吗（已备货商品需手动处理）？', this.$t('common.tipTitle'), {
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
    //合并订单
    mergeorderNo() {
      if (this.selectArr.length < 2) return this.$message.error('请先选择多条订单数据')
      let hasItemList = []
      this.selectArr.map((i) => {
        if (i.stockStatus == 'finished') hasItemList.push(i.orderNo)
      })
      if (hasItemList.length) return this.$message.error(`已经备货的订单：${hasItemList.join('、')}不能合并`)
      if (this.selectArr.some((item) => item.partnerCode !== this.selectArr[0].partnerCode))
        return this.$message.error('所选订单客户不同')
      this.$confirm('确定合并所选订单', this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          let a = this.selectArr.map((item) => {
            return item.id
          })
          this.hbbtnLoading = true
          mergelist(a)
            .then((res) => {
              this.hbbtnLoading = false
              this.$message.success('合并成功')
              this.initData()
            })
            .catch(() => {
              this.hbbtnLoading = false
            })
        })
        .catch(() => { })
    },
    //拆分订单
    splitorderNo(row) {
      if (row.stockStatus == 'finished') return this.$message.error(`该订单已经备货不能拆分`)
      this.$confirm('确定拆分所选订单', this.$t('common.tipTitle'), {
        type: 'warning'
      })
        .then(() => {
          splitlist(row.id).then((res) => {
            this.$message.success('拆分成功')
            this.initData()
          })
        })
        .catch(() => { })
    },
    handleClick(e) {
      this.activeName = e.name
    },
    sortChange({ prop, order }) {
      let newProp
      if (
        prop === 'partnerCode' ||
        prop === 'partnerName' ||
        prop === 'shipperName' ||
        prop === 'createByName' ||
        prop === 'productDrawingNo' ||
        prop === 'productCode' ||
        prop === 'processName'
      ) {
        if (prop === 'createByName') {
          newProp = 'create_by'
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
      getOutlineDatalist(this.orderForm)
        .then((res) => {
          this.tableData = res.data.records
          this.tableFlag = true
          if (this.isDeputyUnitSwitch === '1') {
            this.superQueryJson = [
              {
                prop: 'orderNo',
                label: '单号',
                type: 'input'
              },
              {
                prop: 'partnerName',
                label: '供应商名称',
                type: 'input'
              },
              {
                prop: 'partnerCode',
                label: '供应商编码',
                type: 'input'
              },
              {
                prop: 'deliverDate',
                label: '发料日期',
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
                prop: 'processName',
                label: '工序名称',
                type: 'input'
              },
              {
                prop: 'mainUnit',
                label: '单位(主)',
                type: 'input'
              },
              {
                prop: 'deputyUnit',
                label: '单位(副)',
                type: 'input'
              },
              {
                prop: 'deliveryQuantity',
                label: '订单数量',
                type: 'input'
              },
              {
                prop: 'deliveryDate',
                label: '交货日期',
                type: 'daterange',
                valueFormat: 'yyyy-MM-dd HH:mm:ss',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期',
                pickerOptions: this.global.timePickerOptions
              },
              {
                prop: 'documentStatus',
                label: '单据状态',
                type: 'select',
                options: [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }]
              }
            ]
          } else {
            this.superQueryJson = [
              {
                prop: 'orderNo',
                label: '单号',
                type: 'input'
              },
              {
                prop: 'partnerName',
                label: '供应商名称',
                type: 'input'
              },
              {
                prop: 'partnerCode',
                label: '供应商编码',
                type: 'input'
              },
              {
                prop: 'deliverDate',
                label: '发料日期',
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
                prop: 'deliveryQuantity',
                label: '订单数量',
                type: 'input'
              },
              {
                prop: 'deliveryDate',
                label: '交货日期',
                type: 'daterange',
                valueFormat: 'yyyy-MM-dd HH:mm:ss',
                startPlaceholder: '开始日期',
                endPlaceholder: '结束日期',
                pickerOptions: this.global.timePickerOptions
              },
              {
                prop: 'documentStatus',
                label: '单据状态',
                type: 'select',
                options: [{ label: '草稿', value: 'draft' }, { label: '提交', value: 'submit' }]
              }
            ]
          }
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    search() {
      if (this.orderDateArr && this.orderDateArr.length > 0) {
        this.orderForm.rdsDate = this.orderDateArr[0]
        this.orderForm.rdeDate = this.orderDateArr[1]
      } else {
        this.orderForm.rdsDate = ''
        this.orderForm.rdeDate = ''
      }
      if (this.deliveryDateArr && this.deliveryDateArr.length > 0) {
        this.orderForm.dfsTime = this.deliveryDateArr[0].replace(/ 0(?!0)/g, ' ')
        this.orderForm.dfeDate = this.deliveryDateArr[1].replace(/ 0(?!0)/g, ' ')
      } else {
        this.orderForm.dfsTime = ''
        this.orderForm.dfeDate = ''
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
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.createTimeArr = []
      this.orderDateArr = []
      this.deliveryDateArr = []
      this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))

      this.search()
    },
    addSupplier(id, btntype) {
      console.log(id, btntype)
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
          deleteQuotationsendlist(id).then((res) => {
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
        this.$refs.Form.init(id, btnType)
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
        exportType: this.exportTableRef === '1061',
        exportName: this.exportTableRef === '发料通知单明细',
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
