<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <JNPF-tableQuery :listQuery="orderForm" :systemSearchView="systemSearchView" tableRef="dataTable" />
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <div>
<!--              <el-button size="mini" type="primary" icon="el-icon-printer"-->
<!--                @click="printFlowCard('p023')">打印-->
<!--              </el-button>-->
<!--              <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTable')">-->
<!--                导出-->
<!--              </el-button>-->
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip effect="dark" content="数据排序设置" placement="top">
                <el-link icon="icon-ym icon-ym-generator-flow JNPF-common-head-icon" :underline="false"
                  @click="$refs.dataTable.showSortDrawer()" />
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
          <JNPF-table ref="dataTable" @selection-change="handeleProductInfoData" :hasC="false" :data="tableData" :fixedNO="true" v-if="isProjectSwitchFlag" custom-column
            :setColumnDisplayList="columnList" customKey="JNPFTableKey_852046" show-summary :summary-method="getSummaries" :listQuery="orderForm" @queryChange="initData"
            :queryJson="superQueryJson">
            <el-table-column prop="orderNo" label="预录入单号" min-width="200">
              <template slot-scope="scope">
                <el-link type="primary" :underline="false" @click="viewFun(scope.row.id)">
                  {{ scope.row.orderNo }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="hsCode" label="海关编号" min-width="200" />
            <el-table-column prop="cooperativePartnerName" label="境内发货人" min-width="200" />
            <el-table-column prop="foreignConsignee" label="境外收货人" min-width="200" />
            <el-table-column prop="transportMethod" label="运输方式" min-width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.transportMethod === 'by_sea'">BY Sea</span>
                <span v-else-if="scope.row.transportMethod === 'by_train'">BY Train</span>
                <span v-else-if="scope.row.transportMethod === 'by_dhl'">BY DHL</span>
                <span v-else-if="scope.row.transportMethod === 'by_ups'">BY UPS</span>
                <span v-else-if="scope.row.transportMethod === 'by_tnt'">BY TNT</span>
                <span v-else-if="scope.row.transportMethod === 'by_air'">BY Air</span>
                <span v-else>{{ scope.row.transportMethod }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="contractAgreementNo" label="合同协议号" min-width="200" />
            <el-table-column prop="tradingCountry" label="贸易国(地区)" min-width="200" />
            <el-table-column prop="destinationCountry" label="运抵国(地区)" min-width="200" />
            <el-table-column prop="packageCount" label="件数" min-width="200" />
            <el-table-column prop="grossWeight" label="毛重(千克)" min-width="200" />
            <el-table-column prop="exportDate" label="出口日期" min-width="200" />
            <el-table-column prop="createTime" label="创建时间" width="180" />
            <el-table-column prop="createByName" label="创建人" width="120" />
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="withdrawFun(scope.row)" :disabled="false">撤回</el-button>
                <el-button size="mini" type="text" @click="handlePrint(scope.row)">打印</el-button>
              </template>
            </el-table-column>

          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize" @pagination="initData()">
          </pagination>
        </div>
      </div>

    </div>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <Form v-if="formVisible" ref="Form" @close="closeForm" />
    <PrintDialogPro ref="PrintDialogPro" />
  </div>
</template>

<script>
import PrintDialogPro from '@/components/no_mount/PrintDialogPro/index.vue'
import { getWorkReportList, revokeReport, updateReport, detailordershengchan } from "@/api/productOrdes/index.js"
import ExportForm from '@/components/no_mount/ExportBox/index'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getPrintList } from '@/api/system/printDev'
import { getPrintBusInfo } from '@/api/system/printDev'
import InspectionDetail from '@/views/inspectionManagement/reportWorkInspection/inspectionFormManagementDetail.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { excelExport } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { getSalaryDetailList } from '@/api/salaryManagement'
import userTransfer from '@/components/JNPF-userTransfer'
import tenantMinix from "@/mixins/generator/TenantMinix"
import Form from "@/views/salesManagement/shipmentNote/shippingBill/Form.vue"
import { getSummaries } from "@/utils";
import { getDeclaredList, revokeDeclared } from "@/api/masterDataManagement/productManage";

export default {
  name: 'ringReportRecord',
  components: { SuperQuery, ExportForm, userTransfer, InspectionDetail, PrintBrowse, PrintDialog, Form, PrintDialogPro },
  mixins: [getProjectList, tenantMinix],
  props: {
    queryParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      systemSearchView: [{
        matchLogic: "AND", // 条件逻辑（固定）*
        fullName: "默认视图", // 视图名称*
        conditionJson: { // 视图内容配置*
          condition: [
            {
              prop: 'orderNo',
              symbol: 'like',
              fixed: true
            },
          ],
          // keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
          pageSize: 20, // 每页条数*
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "createTime"
          }]
        },
      }],
      apiTotalData: null,
      summaryMapping: {},
      workOrderData: [],
      printList: [],
      selectArr: [],
      printVisible: false,
      workOrderVisible: false,
      printBrowseVisible: false,
      workOrderRule: {
        productionQuantity: [{ required: true, message: '请输入生产数量', trigger: 'blur' }],
        enCode: [{ required: true, message: '请选择打印模版', trigger: 'change' }]
      },
      workOrderForm: {
        productionQuantity: '',
        enCode: ''
      },
      printQuery: {
        category: 'Productionmanage'
      },
      inspectionDetailVisible: false,
      columnList: ["productsCode",],
      superQueryVisible: false,
      exportFormVisible: false,
      analyseDialog: false,
      dataForm: {
        producerId: '',
        qualifiedQuantity: null,
        responsibilityWasteQuantity: null,
        materialWasteQuantity: null,
        unqualifiedQuantity: null,
        reportingQuantity: null
      },
      dataFormRules: {
        producerId: [{ required: true, message: '生产人不能为空', trigger: 'change' }],
        qualifiedQuantity: [
          { required: true, message: '合格数量不能为空', trigger: 'blur' }
        ],
        responsibilityWasteQuantity: [
          { required: true, message: '责废数量不能为空', trigger: 'blur' }
        ],
        materialWasteQuantity: [
          { required: true, message: '料废数量不能为空', trigger: 'blur' }
        ],
        reportingTime: [{ required: true, message: '报工时间不能为空', trigger: 'change' }]
      },
      btnLoading: false,
      reportDate: [],
      title: "更多查询",
      visible: false,
      tableData: [],
      listLoading: false,
      selectData: [], // 选中的数据 带到form页
      totalQualifiedQuantity: 0,
      orderForm: {},
      totalData: {},
      total: 0,
      formVisible: false,
      superQueryJson: [],
      requestArr: [
        {
          prop: "aperture",
          typeCode: "pa009"
        },

      ],
      isProjectSwitchFlag: false,
      isProjectSwitch: '',
    }
  },

  computed: {
    ...mapGetters(['userInfo'])
  },

  async created() {
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
  },
  mounted() {
    this.getProductClassFun()
  },
  methods: {
    getSummaries(param) {
      return getSummaries(param, this)
    },
    handleSelectWork(val) {
      if (val.length) {
        this.workOrderData.forEach(item => {
          if (item.id != val[0].id) {
            item.selectFlag = true
          }
        });
        this.selectWorkOrder = val
      } else {
        this.workOrderData.forEach(item => {
          item.selectFlag = false
        });
      }
    },
    closePrint() {
      this.printVisible = false
    },
    // 选择模版弹窗
    printView(enCode) {
      if (!this.selectArr.length) return this.$message.error("请选择您要打印的数据!")
      if (this.selectArr.length > 1) return this.$message.error("打印只支持单条数据操作！")
      this.enCode = enCode
      this.fullName = '装配单'
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(enCode)
      })
    },
    // 打印 流转卡
    printFlowCard(enCode) {
      if (!this.selectArr.length) return this.$message.error("请选择您要打印的数据!")
      if (this.selectArr.length > 1) return this.$message.error("打印只支持单条数据操作！")
      this.workOrderVisible = true
      // this.workOrderForm.enCode = enCode
      this.fullName = '装配流转卡'
      this.workOrderForm.productionQuantity = this.selectArr[0].productionQuantity
      detailordershengchan(this.selectArr[0].productionOrderId).then(res => {
        res.data.workOrderList.forEach(item => {
          item.selectFlag = false
        })
        this.workOrderData = res.data.workOrderList
      })
      getPrintList(this.printQuery).then(res => {
        if (res.data) {
          if (res.data.hasOwnProperty(enCode)) {
            this.printList = res.data[enCode]
            this.printList && this.printList.forEach(item => {
              if (item.enabledMark) {
                this.workOrderForm.enCode = item.id
              }
            })
          }
        }
      }).catch(() => {
      })
    },
    closeForm(isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
    },
    printSubmit() {
      if (!this.selectWorkOrder.length) return this.$message.error("请选择您要打印的数据!")
      if (this.selectWorkOrder.length > 1) return this.$message.error("打印只支持单条数据操作！")
      getPrintBusInfo(this.workOrderForm.enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.formId = this.selectWorkOrder[0].id
          this.printBrowseVisible = true
        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },
    closeFun() {
      this.inspectionDetailVisible = false
      this.initData()
    },
    viewFun(id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, 'look')
      })
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.isProjectSwitchFlag = true
      } catch (error) {
      }
    },
    // 撤回
    withdrawFun(data) {
      this.$confirm("您确定撤回该报工数据吗?", "提示", {
        type: 'warning'
      }).then(() => {
        revokeDeclared(data.id).then(res => {
          this.$message.success("撤回成功")
          this.initData()
        })
      }).catch(() => {

      })

    },
    editHandle(row) {
      this.dataForm = { ...row }
      this.analyseDialog = true
    },
    // 选择生产人
    hangleSelectSales(e, r) {
      this.dataForm.producerId = e
    },
    reportingTimeChange(e) {
      this.dataForm.reportingTime = e + ' 00:00:00'
    },
    async dataFormSubmit() {
      this.btnLoading = true
      let submitFlag = true

      const form_1 = this.$refs.elForm
      const valid_1 = await form_1.validate().catch((err) => false)
      if (!valid_1 && submitFlag) {
        submitFlag = false
        this.btnLoading = false
        this.jnpf.focusErrValidItem(form_1.fields)
      }
      if (submitFlag) {
        console.log(this.dataForm.reportingTime, '是是是')
        // 不合格数量 = 料废数量 + 责废数量
        this.dataForm.unqualifiedQuantity = Number(this.dataForm.responsibilityWasteQuantity) + Number(this.dataForm.materialWasteQuantity)
        // 报工数量 = 合格数量 + 不合格数量
        this.dataForm.reportingQuantity = Number(this.dataForm.qualifiedQuantity) + Number(this.dataForm.unqualifiedQuantity)
        updateReport(this.dataForm).then(res => {
          this.analyseDialog = false
          this.btnLoading = false
          this.$message.success("修改成功")
          this.initData()
        }).catch(e => {
          this.btnLoading = false
        })
      }

    },
    // 获取打字内容等
    getProductClassFun() {
      this.requestArr.forEach((item, index) => {
        let obj1 = {
          pageNum: -1,
          pageSize: 20,
          typeCode: item.typeCode,
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
          res.data.records.forEach(items => {
            let obj = {
              label: items.name,
              value: items.name,
            }
            arr.push(obj)
          });
          let oilObj = this.superQueryJson.find(rs => rs.prop === item.prop);
          if (oilObj) {
            // 将options赋值为5
            oilObj.options = JSON.parse(JSON.stringify(arr));
          }
        })
      })
    },
    initData(listQuery) {
      if (listQuery) this.orderForm = listQuery;
      if (!this.orderForm?.pageSize) return this.$message.error('请先等待视图加载完成！');
      const listLoadKey = this.listLoadKey = +new Date();

      this.listLoading = true

      if (this.reportDate && this.reportDate.length) {
        this.orderForm.reportStartDate = this.reportDate[0]
        this.orderForm.reportEndDate = this.reportDate[1]
      } else {
        this.orderForm.reportStartDate = ""
        this.orderForm.reportEndDate = ""
      }

      getDeclaredList(this.orderForm).then(res => {
        if (listLoadKey !== this.listLoadKey) return; // 请求过期
        console.log("报工记录", res);
        // res.data.records.forEach(item => {
        //   item.selectFlag = false
        // })
        this.tableData = res.data.records
        this.total = res.data.total
        this.totalData = res.data.total ? res.data.total : {}
        this.apiTotalData = res.data.total ? res.data.total : {}
        this.listLoading = false
      }).catch(() => {
        if (listLoadKey !== this.listLoadKey) return; // 请求过期
        this.listLoading = false
      })
    },
    // 选中列表的数据 将其带到生成订单下面表单表格中
    handeleProductInfoData(val) {
      console.log(val)
      this.selectData = val
      this.selectArr = val
      this.totalQualifiedQuantity = this.selectData.reduce((sum, e) => sum + Number(e.qualifiedQuantity || 0), 0)
    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 导出
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => {
        return { label: item.label, prop: item.prop }
      })
      this.$nextTick(() => {
        this.$refs.exportForm.init(columnList)
      })
    },
    handlePrint(row) {
      this.$refs.PrintDialogPro.init({
        enCode: 'p049',
        formId: row.id,
        fullName: '报关单'
      })
    },
    download(data) {
      this.exportFormVisible = false
      let includeFieldMap = {}
      for (let i = 0; i < data.selectKey.length; i++) {
        includeFieldMap[data.selectKey[i]] = data.selectVal[i];
      }
      const targetListQuery = this.orderForm
      let _data = {
        ...targetListQuery,
        exportType: "1020",
        exportName: '报工记录',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    }
  }
}
</script>
<style scoped>
::v-deep .all-select .cell .el-checkbox__inner {
  display: none;
}

.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;

  margin-bottom: 5px;
}
</style>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
