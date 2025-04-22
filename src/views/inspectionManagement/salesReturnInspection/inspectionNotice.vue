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
            <el-col :span="4" v-if="isProductNameSwitch === '1'">
              <el-form-item>
                <el-input v-model="listQuery.productName" placeholder="产品名称" @keyup.enter.native="search()" clearable />
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
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head" style="padding:8px">
            <div>
              <el-button size="mini" type="primary" @click="handleBatch">批量检验</el-button>
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
          <JNPF-table v-if="tableDataFlag" ref="dataTable" hasC @selection-change="handleSelectionChange" 
           :data="tableData" :fixedNO="true" @sort-change="sortChange"
            custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="orderNo" label="单号" min-width="200" sortable="custom">
              <template slot-scope="scope">
                <el-link type="primary" @click.native="addOrUpdateHandle(scope.row, true)">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="partnerName" label="客户名称" min-width="150" />
            <el-table-column prop="partnerCode" label="客户编码" min-width="140" sortable="custom" />
            <el-table-column prop="deliverDate" label="退货日期" width="120" />
            <el-table-column prop="projectName" label="所属项目" width="120"
              v-if="isProjectSwitch === '1'"></el-table-column>
            <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
            <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="140" sortable="custom" />
            <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />

            <el-table-column prop="mainUnit" label="单位" width="60" />
            <el-table-column prop="deliveryQuantity" label="退货数量" min-width="120" sortable="custom" />
            <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  min-width="120" sortable="custom" />
            <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel"  min-width="120" sortable="custom" />
            <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" sortable="custom" />
            <el-table-column prop="oil" label="油脂" min-width="100" sortable="custom" />
            <el-table-column prop="oilQuantity" label="油脂量" min-width="100" sortable="custom" />
            <el-table-column prop="clearance" label="游隙" min-width="100" sortable="custom" />
            <el-table-column prop="packagingMethod" label="包装方式" min-width="120" sortable="custom" />
            <el-table-column prop="specialRequire" :label="$store.getters.specialRequire"  width="120" sortable="custom" />
            <el-table-column prop="material" label="材质" width="130" sortable="custom"></el-table-column>
            <el-table-column prop="colour" :label="$store.getters.colour"  width="130" sortable="custom"></el-table-column>
            <el-table-column prop="ordersNo" label="订单号" min-width="200" sortable="custom" />
            <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
            <el-table-column prop="createByName" label="创建人" min-width="100" />
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
    <!-- 批量检验 -->
    <el-dialog v-if="analyseDialog" title="批量检验" :close-on-click-modal="false" append-to-body
      :visible.sync="analyseDialog" class="JNPF-dialog JNPF-dialog_center" lock-scroll width="400px">
      <el-row :gutter="15" style="margin-top: 0px;">
        <el-form ref="elForm" :model="dataForm" label-position="top" :rules="dataFormRules">
          <el-row :gutter="30">
            <el-col :sm="24">
                <el-form-item prop="inspectionResults" label="检验结果">
                  <el-select v-model="dataForm.inspectionResults"placeholder="请选择检验结果" clearable
                    style="width: 100%;">
                    <el-option v-for="(item, index) in [
                      {value: 'qualified',label: '合格'},
					            {value: 'unqualified',label: '不合格'}]" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
          </el-row>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="analyseDialog = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
          {{ $t('common.submitButton') }}
        </el-button>
      </span>
    </el-dialog>
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
import { getbimProductAttributesList, getbimProductAttributes, getbimProductsModelList,getbimProductAttributesListMap } from '@/api/masterDataManagement/index'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
import { batchInspectionData } from '@/api/inspectionManagement/index' // 检验单
import { getUnitData } from '@/api/basicData/materialSettings'
import { getCooperativeData } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'

export default {
  components: { Form, DetailForm, SuperQuery, ExportForm },
  mixins: [getProjectList],

  data() {
    return {
      isProjectSwitch: '',
      tableDataFlag: false,
      superQueryVisible: false,
      exportFormVisible: false,
      selectedData:[],
      analyseDialog:false,
      dataForm:{
        inspectionResults:'',
      },
      dataFormRules: {
        inspectionResults: [{ required: true, message: '检验结果不能为空', trigger: 'change' }],
      },
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
  async created() {
    await this.getProductClassFun()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    this.superQueryJson.forEach(tc => {
      if (tc.prop === 'standardValue') {
        let arr = []
        this.bimProductAttributesObj.pa008.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        tc.options = arr
      } else if (tc.prop === 'sealingCoverTyping') {
        let arr = []
        this.bimProductAttributesObj.pa007.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        tc.options = arr
      } else if (tc.prop === 'accuracyLevel') {
        let arr = []
        this.bimProductAttributesObj.pa006.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        tc.options = arr
      } else if (tc.prop === 'vibrationLevel') {
        let arr = []
        this.bimProductAttributesObj.pa005.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        tc.options = arr
      } else if (tc.prop === 'oil') {
        let arr = []
        this.bimProductAttributesObj.pa002.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        tc.options = arr
      } else if (tc.prop === 'oilQuantity') {
        let arr = []
        this.bimProductAttributesObj.pa003.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        tc.options = arr
      } else if (tc.prop === 'clearance') {
        let arr = []
        this.bimProductAttributesObj.pa001.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        tc.options = arr
      } else if (tc.prop === 'packagingMethod') {
        let arr = []
        this.bimProductAttributesObj.pa015.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        tc.options = arr
      } else if (tc.prop === 'specialRequire') {
        let arr = []
        this.bimProductAttributesObj.pa016.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        tc.options = arr
      } else if (tc.prop === 'material') {
        let arr = []
        this.bimProductAttributesObj.pa021.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        tc.options = arr
        console.log(tc, 'kk')
      } else if (tc.prop === 'colour') {
        let arr = []
        this.bimProductAttributesObj.pa010.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        tc.options = arr
      } else if (tc.prop === 'processName') {
        let arr = []
        this.bimProductAttributesObj.pa006.forEach((item) => {
          let obj = {
            label: item.name,
            value: item.name
          }
          arr.push(obj)
        })
        tc.options = arr
      } else if (tc.prop === 'mainUnit') {
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
          tc.options = arr
        })
      }
    })
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

    this.tableDataFlag = true
    this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))

    this.initData()
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
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
    handleSelectionChange(val) {
      this.selectedData = val
    },
    handleBatch() {
      if (!this.selectedData.length) return this.$message.error('请至少选择一条检验数据')

    
      this.btnLoading = false
      this.analyseDialog = true
    },
    async dataFormSubmit() {
      this.btnLoading = true
      let submitFlag = true

      const form_1 = this.$refs.elForm
      const valid_1 = await form_1.validate().catch((err) => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.jnpf.focusErrValidItem(form_1.fields)
      }
      this.bathData = this.selectedData.map(item => {
					return {
            calculationDirection: item.calculationDirection,
						deputyUnit: item.deputyUnit,
						docId: item.purchaseReceiptReturnGoodsId,
						docLineId: item.id,
						docNo: item.orderNo,
						documentStatus: 'submit',
						inspectionDate: this.jnpf.dateFormat(new Date().getTime(),
							'YYYY-MM-DD'),
						inspectionMethod: 'all',
						inspectionQuantity: item.deliveryQuantity,
						inspectorId: this.userInfo.userId,
						mainUnit: item.mainUnit,
						notificationType: 'sale_back',
						processId: item.processId,
						productsId: item.productsId,
						ratio: item.ratio,
						remark: item.remark,
						// unqualifiedQuantity: this.inspectionResults === 'qualified' ?
						// 	0 : item.deliveryQuantity
					}
		  })
      if (submitFlag) {
        let _data = {
					inspectionCategory: 'procure',
					inspectionList: this.bathData,
					inspectionResults: this.dataForm.inspectionResults
				}

        batchInspectionData(_data)
          .then((res) => {
            this.$message.success('批量检验成功')
            this.selectedData = []
            this.$refs.dataTable.$refs.JNPFTable.clearSelection()
            this.analyseDialog = false
            this.dataForm = {
              inspectionResults: '',
            }
            this.search()
          })
          .catch((err) => {
            this.btnLoading = false
          })
      } else {
        this.btnLoading = false
      }
    },
    getProductFun() {
      console.log(21341234)
      console.log(this.scanResult)

      this.listQuery.productCode = this.scanResult
      this.listLoading = true

      getQuotationdatasenddatalist(this.listQuery)
        .then((res) => {
          this.tableData = res.data.records
          this.listQuery.productDrawingNo = this.tableData[0].productDrawingNo

          this.total = res.data.total
          this.listLoading = false
          this.scanDialog = false
          if (this.tableData.length == 1) {
            this.formVisible = true
            this.$nextTick(() => {
              this.$refs.Form.init(this.tableData[0], false, 'sale_back', 'notice', 'QCDH')
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
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
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
      })
    },
    initData() {
      this.listLoading = true
      if (this.isProjectSwitch === '1') {
        this.listQuery.projectId = this.userInfo.projectId
      }
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
          this.$refs.DetailForm.init(row.returnDeliveryNoticeId, 'look',false,'outInboundWarehouse')
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
        prop === 'createByName' ||
        prop === 'sealingCoverTyping' ||
        prop === 'accuracyLevel' ||
        prop === 'vibrationLevel' ||
        prop === 'oilQuantity' ||
        prop === 'ordersNo' ||
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