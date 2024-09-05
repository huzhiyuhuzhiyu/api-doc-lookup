<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <el-row class="JNPF-common-search-box" :gutter="10">
          <el-form @submit.native.prevent>
            <el-col :span="3">
              <el-form-item>
                <el-input v-model="orderForm.orderNo" @keyup.enter.native="search()" placeholder="订单号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-date-picker v-model="orderForm.deliveryStartTime" type="date" value-format="yyyy-MM-dd"
                  style="width: 100%;" placeholder="收货开始日期" clearable></el-date-picker>
                -
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-date-picker v-model="orderForm.deliveryEndDate" type="date" value-format="yyyy-MM-dd"
                  style="width: 100%;" placeholder="收货结束日期" clearable></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button class="btnBox" size="mini" @click="btnsearch1()">已延期</el-button>
                <el-button class="btnBox" size="mini" @click="btnsearch2()">近3天</el-button>
                <el-button class="btnBox" size="mini" @click="btnsearch3()">近7天</el-button>
                <el-button class="btnBox" size="mini" @click="btnsearch4()">近30天</el-button>
              </el-form-item>
            </el-col>

            <el-col :span="4">
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
          <div class="JNPF-common-head">
            <!-- <topOpts @add="addSupplier('', 'add')"> -->
            <el-button type="primary" size="mini" icon="el-icon-download" @click="exportForm('dataTable')">
              导出
            </el-button>
            <!-- </topOpts> -->
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
            :setColumnDisplayList="columnList" @sort-change="sortChange" custom-column>
            <el-table-column prop="orderNo" label="订单号" width="180" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="handleUserRelation(scope.row.purchaseOrderId, 'look')">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="180" sortable="custom" />
            <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="180" sortable="custom" />
            <el-table-column prop="drawingNo" label="品名规格" min-width="200" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" min-width="140" sortable="custom" />
            <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" min-width="120" />
            <el-table-column prop="purchaseQuantity" label="数量" min-width="100" sortable="custom" />
            <el-table-column prop="waitReceiptNum" label="待收货数量" min-width="130" sortable="custom" />
            <el-table-column prop="deputyUnit" label="单位(副)" min-width="140" sortable="custom" />
            <el-table-column prop="purchaseQuantity2" label="数量(副)" min-width="150" sortable="custom" />
            <el-table-column prop="deliveryDate" label="交货日期" min-width="140" sortable="custom" />
            <el-table-column prop="standardValue" label="规值" min-width="180" sortable="custom" />
            <el-table-column prop="sealingCoverTyping" min-width="140" label="打字内容" sortable="custom" />
            <el-table-column prop="accuracyLevel" label="精度等级" min-width="140" sortable="custom" />
            <el-table-column prop="vibrationLevel" label="振动等级" min-width="140" sortable="custom" />
            <el-table-column prop="oil" label="油脂" min-width="120" sortable="custom" />
            <el-table-column prop="oilQuantity" label="油脂量" min-width="140" sortable="custom" />
            <el-table-column prop="clearance" label="游隙" min-width="120" sortable="custom" />
            <el-table-column prop="packagingMethod" label="包装方式" min-width="140" sortable="custom" />
            <el-table-column prop="remark" label="备注" min-width="120" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" min-width="120" sortable="custom" />
            <el-table-column label="操作" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                  @click.native="handleUserRelation(scope.row.purchaseOrderId, 'look')">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData">
            <!-- <div class="text">
              <span>合计数量:{{ totalNum }}</span>
            </div> -->
          </pagination>
        </div>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" :customList="customList" />

    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <OrderFollow v-if="orderFollowVisible" ref="orderFollow" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  </div>
</template>

<script>
import { UserListAll } from '@/api/permission/user'
import { excelExport } from '@/api/basicData/index'
import {
  getsaleOrderList,
  getsaleOrderDetailList,
  deleteOrders,
  getAttributeline,
  getSaleordersTotal,
  getOrderLineReport
} from '@/api/salesManagement/assemblyOrders'
import { purchaseOrderReport } from '@/api/purchasingAndOutsourcingOrders/index'
import Form from '../../purchaseOrders/purchaseOrder/Form.vue'
import OrderFollow from '../../../salesManagement/orderManagement/orderList/orderFollow'
import UserRelationList from '../../../salesManagement/orderManagement/orderList/userRelation'
import SuperQuery from '@/components/SuperQuery/index.vue'
import moment from 'moment'
import ExportForm from '@/components/no_mount/ExportBox/index'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
export default {
  name: 'carrierProfile',
  components: { Form, UserRelationList, ExportForm, OrderFollow, SuperQuery },
  data() {
    return {
      columnList: ['cooperativePartnerCode', 'departmentName', 'productName', 'createTime'],
      deliveryDateArr: [],
      orderFollowVisible: false,
      superQueryVisible: false,
      productFormVisible: false,
      exportFormVisible: false,
      customList: [], // 列表中显示的自定义属性
      tableData: [],
      treeLoading: false,
      listLoading: false,
      detailFlag: false,

      orderForm: {
        // approvalStatus: 'ok',
        // documentStatus: 'submit',
        // orderState: 'not_finish',
        classAttribute: 'finish_product',
        orderType: 'procure',
        deliveryEndDate: '',
        deliveryStartTime: '',
        // extensionFlag: 1,
        // deliverQueryFlag: 1,
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          }
        ],

        superQuery: {}
      },

      detailTotal: 0,

      gradeList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      total: 0,
      diagramVisible: false,
      formVisible: false,
      totalNum: 0,
      filterText: '',
      totalDataForm: {},
      dateRange: [null, new Date()], //
      superQueryJson: [
        {
          prop: 'orderNo',
          label: '订单号',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerCode',
          label: '客户编码',
          type: 'input'
        },
        {
          prop: 'cooperativePartnerName',
          label: '客户名称',
          type: 'input'
        },

        {
          prop: 'drawingNo',
          label: '品名规格',
          type: 'input'
        },

        {
          prop: 'productName',
          label: '产品名称',
          type: 'input',
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
          prop: 'purchaseQuantity',
          label: '数量',
          type: 'input'
        },
        {
          prop: 'waitReceiptNum',
          label: '待收货数量',
          type: 'input'
        },
        {
          prop: 'deputyUnit',
          label: '单位(副)',
          type: 'input'
        },
        {
          prop: 'purchaseQuantity2',
          label: '数量(副)',
          type: 'input'
        },
        {
          prop: 'deputyUnit',
          label: '交货日期',
          type: 'input'
        },
        {
          prop: 'assistantNum',
          label: '数量(副)',
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
          prop: 'standardValue',
          label: '规值',
          type: 'input'
        },
        {
          prop: 'sealingCoverTyping',
          label: '打字内容',
          type: 'select',
          options: []
        },
        {
          prop: 'accuracyLevel',
          label: '精度等级',
          type: 'select',
          options: []
        },
        {
          prop: 'vibrationLevel',
          label: '振动等级',
          type: 'select',
          options: []
        },

        {
          prop: 'oil',
          label: '油脂',
          type: 'select',
          options: []
        },
        {
          prop: 'oilQuantity',
          label: '油脂量',
          type: 'select',
          options: []
        },
        {
          prop: 'clearance',
          label: '游隙',
          type: 'select',
          options: []
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: []
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
        },
      ]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },

  mounted() {
    this.getProductClassFun()
  },
  created() {
    // 默认设置为近3天
    const end = new Date()
    const start = new Date()
    end.setDate(end.getDate() + 3)
    this.deliveryDateArr = ['', end]
    this.orderForm.deliveryStartTime = ''
    this.orderForm.deliveryEndDate = this.dateFun(this.deliveryDateArr[1])
    this.dataFormSubmit()
    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {

    // 获取合计数据
    getOrderLineReportFun() {
      getOrderLineReport(this.orderForm).then((res) => {

        this.totalNum = res.data.total ? res.data.total.num : 0
      })
    },
    dateFun(dateStr) {
      const date = new Date(dateStr)

      // 获取年份、月份和日期
      const year = date.getFullYear() // 获取年份
      const month = String(date.getMonth() + 1).padStart(2, '0') // 获取月份 (注意：月份从0开始，因此加1，并补齐两位数)
      const day = String(date.getDate()).padStart(2, '0') // 获取日期，并补齐两位数

      // 拼接成年月日格式
      const formattedDate = `${year}-${month}-${day}`

      return formattedDate
    },
    btnsearch1() {
      let end = new Date()
      let start = new Date()
      this.deliveryDateArr = ['', end]
      this.orderForm.deliveryStartTime = ''
      this.orderForm.deliveryEndDate = this.dateFun(this.deliveryDateArr[1])
      this.dataFormSubmit()
    },
    // 为近3天
    btnsearch2() {
      const end = new Date()
      const start = new Date()
      end.setDate(end.getDate() + 3)
      this.deliveryDateArr = ['', end]
      this.orderForm.deliveryStartTime = ''
      this.orderForm.deliveryEndDate = this.dateFun(this.deliveryDateArr[1])
      this.search()
    },
    // 为近7天
    btnsearch3() {
      let end = new Date()
      let start = new Date()

      end.setDate(end.getDate() + 7)

      this.deliveryDateArr = ['', end]
      this.orderForm.deliveryStartTime = ''
      this.orderForm.deliveryEndDate = this.dateFun(this.deliveryDateArr[1])
      this.search()
    },
    // 为近30天
    btnsearch4() {
      let end = new Date()
      let start = new Date()
      end.setDate(end.getDate() + 30)

      this.deliveryDateArr = ['', end]
      this.orderForm.deliveryStartTime = ''
      this.orderForm.deliveryEndDate = this.dateFun(this.deliveryDateArr[1])
      this.search()
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },

    //
    filterateLabel(row, column, cellValue) {
      if (!cellValue) return ''
      if (cellValue.includes(':')) {
        return cellValue.replace(/:(.*?)(,|$)/g, '$2')
      } else {
        return cellValue
      }
    },

    sortChange({ prop, order }) {
      let newProp
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase())
      }
      if (prop == 'createByName') {
        newProp = 'create_by'
      }
      this.orderForm.orderItems[0].asc = order === 'ascending'
      this.orderForm.orderItems[0].column = order === null ? '' : newProp
      this.initData()
    },

    dataFormSubmit() {
      this.orderForm.pageNum = 1
      Object.keys(this.orderForm).forEach((key) => {
        // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })

      this.initData()
    },

    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false
      this.orderFollowVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    initData() {
      this.listLoading = true
      purchaseOrderReport(this.orderForm)
        .then((res) => {
          this.tableData = res.data.page.records
          this.getOrderLineReportFun()
          this.total = res.data.page.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },

    search() {
      this.dataFormSubmit()
    },

    reset() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      // 默认设置为近3天
      const end = new Date()
      const start = new Date()

      end.setDate(end.getDate() + 3)
      this.deliveryDateArr = [start, end]
      this.orderForm = {
        approvalStatus: 'ok',
        documentStatus: 'submit',
        orderState: 'not_finish',
        deliveryEndDate: this.dateFun(this.deliveryDateArr[1]),
        deliveryStartTime: this.dateFun(this.deliveryDateArr[0]),
        extensionFlag: 1,
        deliverQueryFlag: 1,
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 't1.create_time'
          }
        ],

        superQuery: {}
      }
      this.$refs.SuperQuery.conditionList = []
      this.search()
    },

    // 订单跟踪
    orderFollow(id) {
      this.orderFollowVisible = true
      this.$nextTick(() => {
        this.$refs.orderFollow.init(id)
      })
    },
    addSupplier(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    getCopyOrders(id, btntype) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype)
      })
    },
    addOrUpdateHandle(id, btntype) {
      this.formVisible = true
      if (id) {
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
          deleteOrders(id).then((res) => {
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
        exportType: '1003',
        exportName: '待收货订单',
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

      let obj1 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa007",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };

      getbimProductAttributesList(obj1).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'sealingCoverTyping');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj2 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa006",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };


      getbimProductAttributesList(obj2).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'accuracyLevel');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa005",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj3).then(res => {

        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'vibrationLevel');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa002",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj4).then(res => {



        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'oil');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj5 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa003",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj5).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'oilQuantity');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj6 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa001",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };

      getbimProductAttributesList(obj6).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'clearance');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })
      let obj7 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa015",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj7).then(res => {
        let arr = []
        res.data.records.forEach(item => {
          let obj = {
            label: item.name,
            value: item.name,
          }
          arr.push(obj)
        });
        let oilObj = this.superQueryJson.find(item => item.prop === 'packagingMethod');

        if (oilObj) {
          // 将options赋值为5  
          oilObj.options = arr;
        }
      })


      // 获取税率(数据字典)
      getbimProductAttributes("585438081021126405").then(res => {
        res.data.list.forEach(item => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log("税率", this.taxRateList);
      })

    },
  }
}
</script>
<style scoped>
.el-tab-pane {
  height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

.el-tabs {
  height: 100%;
}

.el-tabs__nav-scroll {
  padding-left: 10px;
}

.JNPF-common-search-box {
  padding: 8px !important;

  margin-bottom: 5px;
}

.JNPF-common-head {
  padding: 8px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #ebeef5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

.aaa ::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
  margin-bottom: 0;
  padding-left: 10px !important;
  background: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding-bottom: 0;
}

.btnBox {
  padding: 7px 10px;
}
</style>
