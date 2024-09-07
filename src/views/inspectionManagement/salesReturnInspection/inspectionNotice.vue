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
                <el-input v-model="listQuery.partnerName" placeholder="供应商名称" @keyup.enter.native="search()"
                  clearable />
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
            <el-table-column prop="orderNo" label="单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, true)">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="partnerName" label="客户名称" min-width="120" />
            <el-table-column prop="partnerCode" label="客户编码" min-width="120" sortable="custom" />
            <el-table-column prop="deliverDate" label="退货日期" width="180" />
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="140" sortable="custom" />
            <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" min-width="140" />
            <el-table-column prop="deliveryQuantity" label="退货数量" min-width="140" sortable="custom" />
            <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="140" sortable="custom" />
            <el-table-column prop="accuracyLevel" label="精度等级" min-width="140" sortable="custom" />
            <el-table-column prop="vibrationLevel" label="振动等级" min-width="140" sortable="custom" />
            <el-table-column prop="oil" label="油脂" min-width="140" sortable="custom" />
            <el-table-column prop="oilQuantity" label="油脂量" min-width="140" sortable="custom" />
            <el-table-column prop="clearance" label="游隙" min-width="140" sortable="custom" />
            <el-table-column prop="packagingMethod" label="包装方式" min-width="140" sortable="custom" />
            <el-table-column prop="ordersNo" label="订单号" min-width="140" sortable="custom" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" min-width="120" />
            <el-table-column prop="remark" min-width="200" label="备注" />
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <tableOpts @edit="addOrUpdateHandle(scope.row)" editText="检验" :hasDel="false">
                  <el-dropdown hide-on-click>
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
                  </el-dropdown>
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
  </div>
</template>

<script>
import { getQuotationdatasendlist, getQuotationdatasenddatalist } from '@/api/salesManagement'
import {
  purPurchaseReceiptReturnGoodsDetailList,
  linesReceiptReturn
} from '@/api/purchasingManagement/purchaseInquirySheet'
import Form from '../components/inspectionNoticeForm.vue'
import DetailForm from '@/views/salesManagement/shippingnotice/returnSalesmemo/Form.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { getbimProductAttributesList, getbimProductAttributes, getbimProductsModelList } from '@/api/masterDataManagement/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { getUnitData } from '@/api/basicData/materialSettings'
export default {
  components: { Form, DetailForm, SuperQuery, ExportForm },
  data() {
    return {
      superQueryVisible: false,
      exportFormVisible: false,
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
          prop: 'deliveryQuantity',
          label: '退货数量',
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
          prop: 'ordersNo',
          label: '订单号',
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
        },
        {
          prop: 'remark',
          label: '备注',
          type: 'input'
        }
      ],
      columnList: ['partnerCode', 'productCode', 'createByName'],
      visible: false,
      detailFormVisible: false,
      activeName: 'dataTable',
      tableData: [],
      listLoading: false,
      listQuery: {},
      initListQuery: {
        // approvalStatus: 'ok', // 审批状态
        documentStatus: 'submit', // 单据状态
        // fullReceiptFlag: false, // 是否已全部收货 0否1是
        returnDeliveryType: 'back',
        inspectionStatus: 'unInspect', // 检验状态 待检验 unInspect、已检验 inspected
        notifyType: 'sale', //	通知单类型 外协通知 external、销售通知 sale,可用值:external,external_process,picking,procure,sale
        // deliveryStatus: "not_returned", // 退发货状态 待发货 undelivered 、已发货 delivered 、待退货 not_returned 、已退货 returned
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
        createTimeArr: [],
        orderNo: '',
        pageNum: 1,
        pageSize: 20,
        canceledFlag: true // 过滤掉取消的单据
      },
      linesTableData: [],
      linesTotal: 0,
      linesQuery: {},

      total: 0,
      formVisible: false
    }
  },
  watch: {
    activeName() {
      this.initData()
    }
  },
  mounted() {
    this.getProductClassFun()
  },
  created() {
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))

    this.initData()
  },
  methods: {
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
      let obj8 = {
        pageNum: 1,
        pageSize: 100
      }
      getUnitData(obj8).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        // let oilObj = this.superQueryJson.find((item) => item.prop === 'mainUnit')
        this.superQueryJson.forEach((tc) => {
          if (tc.prop === 'mainUnit') {
            tc.options = arr
          }
        })
      })
      let obj9 = {
        pageNum: -1,
        pageSize: 20
      }
      getbimProductsModelList(obj9).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.model,
            value: item.model
          }
          arr.push(obj)
        })
        let modelObj = this.superQueryJson.find((item) => item.prop === 'model')

        if (modelObj) {
          // 将options赋值为5
          modelObj.options = arr
        }
      })

      let obj10 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa011',
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
      getbimProductAttributesList(obj10).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let brandObj = this.superQueryJson.find((item) => item.prop === 'brand')

        if (brandObj) {
          // 将options赋值为5
          brandObj.options = arr
        }
      })

      let obj11 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa013',
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
      getbimProductAttributesList(obj11).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'structureType')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
      })
      let obj12 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa012',
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
      getbimProductAttributesList(obj12).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'sealingCoverStructure')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
      })
      let obj13 = {
        pageNum: -1,
        pageSize: 20,
        type: 'supplier'
      }
      getCooperativeData(obj13).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.id
          }
          arr.push(obj)
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'steelBallManufacturer')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
      })
      let obj14 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa014',
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
      getbimProductAttributesList(obj14).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'noise')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
      })
      let obj15 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa004',
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
      getbimProductAttributesList(obj15).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'holder')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
      })

      let obj16 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa010',
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
      getbimProductAttributesList(obj16).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'colour')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
      })

      let obj17 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: 'pa009',
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
      getbimProductAttributesList(obj17).then((res) => {
        let arr = []
        res.data.records.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        let tcObj = this.superQueryJson.find((item) => item.prop === 'aperture')

        if (tcObj) {
          // 将options赋值为5
          tcObj.options = arr
        }
      })

      // 获取税率(数据字典)
      getbimProductAttributes('585438081021126405').then((res) => {
        res.data.list.forEach((item) => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
      })
    },
    initData() {
      this.listLoading = true

      getQuotationdatasenddatalist(this.listQuery)
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
      if (this.listQuery.createTimeArr && this.listQuery.createTimeArr.length) {
        this.listQuery.startTime = this.listQuery.createTimeArr[0].replace(/ 0(?!0)/g, ' ')
        this.listQuery.endTime = this.listQuery.createTimeArr[1].replace(/ 0(?!0)/g, ' ')
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
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
          this.$refs.DetailForm.init(row.returnDeliveryNoticeId, 'look')
        })
      } else {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.Form.init(row, readOnly, 'sale_back', 'notice', 'QCDH')
        })
      }
    },
    sortChange({ prop, order }) {
      let newProp
      if (
        prop === 'shipperName' ||
        prop === 'partnerCode' ||
        prop === 'partnerName' ||
        prop === 'productCode' ||
        prop === 'productName' ||
        prop === 'productDrawingNo' ||
        prop === 'createByName'
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
<!-- <style src="@/assets/scss/tabs-list.scss" lang="scss" scoped /> -->
