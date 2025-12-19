<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div class="JNPF-common-layout-center JNPF-flex-main">
        <JNPF-tableQuery :listQuery="orderForm" :systemSearchView="systemSearchView" tableRef="dataTable" />
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <div>
              <el-button size="mini" type="primary" icon="el-icon-printer"
                @click="printFlowCard('p020')">打印流转卡</el-button>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click.native="exportForm('dataTable')">
                导出
              </el-button>
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
          <JNPF-table ref="dataTable"  :data="tableData" :fixedNO="true"  v-if="isProjectSwitchFlag" custom-column @selection-change="handleSelectionChange" hasC
            :setColumnDisplayList="columnList" customKey="JNPFTableKey_620215" show-summary :summary-method="getSummaries" :listQuery="orderForm" @queryChange="initData" :queryJson="superQueryJson">
            <el-table-column prop="productionOrderNo" label="生产任务单号" min-width="220" />
            <el-table-column prop="workNo" label="工单单号" min-width="220"></el-table-column>
            <el-table-column prop="orderNo" label="报工单号" min-width="220"></el-table-column>
            <el-table-column prop="productCode" label="产品编码" min-width="140" />
            <el-table-column prop="productName" label="产品名称" width="160"
            v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="300"></el-table-column>
            <el-table-column prop="projectName" label="所属项目" min-width="120"
            v-if="isProjectSwitch == 1" />
            <el-table-column prop="productCategoryName" label="产品分类" min-width="120" />
            <el-table-column prop="processName" label="工序名称" width="160" />
            <el-table-column prop="reportingTime" label="报工时间" min-width="180" />
            <el-table-column prop="producerName" label="生产人" min-width="120" />
            <el-table-column prop="mainUnit" label="单位" min-width="80" />
            <el-table-column prop="reportingQuantity" label="报工数量" min-width="120" />
            <!-- <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="120" sortable="custom" />
            <el-table-column prop="responsibilityWasteQuantity" label="责废数量" min-width="120" sortable="custom" />
            <el-table-column prop="materialWasteQuantity" label="料废数量" min-width="120" sortable="custom" /> -->
            <!-- <el-table-column prop="reworkQuantity" label="返工数量" min-width="120" sortable="custom" /> -->
            <el-table-column prop="actualQualifiedQuantity" label="实际合格数量" min-width="170" />
            <el-table-column prop="responsibilityWasteQuantity" label="责废数量" min-width="120" />
            <el-table-column prop="actualResponsibilityWasteQuantity" label="实际责废数量" min-width="170" />
            <el-table-column prop="materialWasteQuantity" label="料废数量" min-width="120" />
            <el-table-column prop="actualMaterialQuantity" label="实际料废数量" min-width="170" />
            <el-table-column prop="actualReworkQuantity" label="实际返工数量" min-width="170" />
            <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" />
            <el-table-column prop="packagingMethod" label="包装方式" min-width="120" />
            <el-table-column prop="oil" label="注脂方式" min-width="120" />
            <el-table-column prop="markingMethod" label="打标记" min-width="120" />
            <el-table-column prop="sealingCoverTyping" :label="$store.getters.sealingCoverTyping"  min-width="120" />
            <el-table-column prop="orderStatus" label="任务状态" min-width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.orderStatus == 'finish'"><el-tag type="success">已完成</el-tag></div>
                <div v-else-if="scope.row.orderStatus == 'normal'"><el-tag>进行中</el-tag></div>
                <div v-else-if="scope.row.orderStatus == 'closed'"><el-tag type="danger">已关闭</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="createByName" label="创建人" min-width="140"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column>
            <el-table-column label="操作" width="200" fixed="right">

              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="withdrawFun(scope.row)"  :disabled="scope.row.orderStatus!='normal'">撤回</el-button>
                <!-- <el-button size="mini" type="text" @click="editHandle(scope.row)" :disabled="scope.row.lastFlag">修改</el-button> -->
                <el-button size="mini"  v-if="$store.getters.configData.inspect.work_report_inspect" type="text" @click="viewFun(scope.row.inspectionId)"  :disabled="scope.row.inspectionStatus!='inspected'||!scope.row.inspectionId">查看检验记录</el-button>

              </template>
            </el-table-column>

          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize" @pagination="initData()" >
            <span style="font-weight:500;margin-right:10px">报工数量总计：{{ totalData.reportingQuantity }}</span>
          </pagination>
        </div>
      </div>

    </div>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
    <!-- 报工记录修改 -->
    <el-dialog v-if="analyseDialog" title="报工记录修改" :close-on-click-modal="false" append-to-body
      :visible.sync="analyseDialog" class="JNPF-dialog JNPF-dialog_center" lock-scroll width="400px">
      <el-row :gutter="15" style="margin-top: 0px;">
        <el-form ref="elForm" :model="dataForm" label-position="top" :rules="dataFormRules">
          <el-row :gutter="30">
              <el-col :sm="12">
                <el-form-item prop="producerId" label="生产人">
                  <user-select v-model="dataForm.producerId" placeholder="生产人" clearable style="width: 100%;"
                        class="ipt" @change="hangleSelectSales">
                      </user-select>
                </el-form-item>
              </el-col>
              <el-col :sm="12">
                <el-form-item prop="qualifiedQuantity" label="合格数量">
                  <el-input v-model="dataForm.qualifiedQuantity" placeholder="请输入合格数量" />
                </el-form-item>
              </el-col>
              <el-col :sm="12">
                <el-form-item prop="responsibilityWasteQuantity" label="责废数量">
                  <el-input v-model="dataForm.responsibilityWasteQuantity" placeholder="请输入责废数量" />
                </el-form-item>
              </el-col>
              <el-col :sm="12">
                <el-form-item prop="materialWasteQuantity" label="料废数量">
                  <el-input v-model="dataForm.materialWasteQuantity" placeholder="请输入料废数量" />
                </el-form-item>
              </el-col>
              <el-col :sm="24">
                <el-form-item label="报工时间" prop="reportingTime">
                  <el-date-picker v-model="dataForm.reportingTime" value-format="yyyy-MM-dd"
                        @change="reportingTimeChange" class="ipt" type="date" style="width: 100%;" placeholder="选择报工时间">
                      </el-date-picker>
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
    <InspectionDetail v-if="inspectionDetailVisible" ref="inspectionDetailRef" @close="closeFun"></InspectionDetail>
       <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" :params="workOrderForm"
      :fullName="fullName" ref="printForm" />
         <!-- 选择打印模版弹窗 -->
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printOrder"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" />
       <!-- 打印流转卡弹窗选择工单数据 -->
    <el-dialog title="工单信息" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="workOrderVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20">
        <el-form ref="workOrderForm" :rules='workOrderRule' :model="workOrderForm" label-width="120px"
          label-position="left">
          <el-col :span="12">
            <el-form-item label="生产数量：" prop="productionQuantity">
              <el-input v-model="workOrderForm.productionQuantity" placeholder="生产数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="打印模版：" prop="enCode">
              <el-select v-model="workOrderForm.enCode" placeholder="选择打印模版">
                <el-option :key="item.id" :label="item.fullName" :value="item.id" v-for="item in printList" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <JNPF-table ref="work" :data="workOrderData" hasC @selection-change="handleSelectWork" fixedNo
        v-loading="tableloading" border :checkSelectable="row => !row.selectFlag" customKey="JNPFTableKey_643502">
        <el-table-column prop="orderNo" label="工单号" min-width="160" />
        <el-table-column prop="processName" label="工序名称" min-width="120" />
        <el-table-column prop="processCode" label="工序编码" min-width="120"></el-table-column>
        <el-table-column prop="planStartDate" label="计划开始日期" min-width="150"></el-table-column>
        <el-table-column prop="planEndDate" label="计划结束日期" min-width="150"></el-table-column>
        <el-table-column prop="mainUnit" label="单位" min-width="80"></el-table-column>
        <el-table-column prop="productionQuantity" label="生产数量" min-width="100"></el-table-column>
        <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="100"></el-table-column>
        <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="130"></el-table-column>
      </JNPF-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="workOrderVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="printSubmit()">
          打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getWorkReportList, revokeReport, updateReport,detailordershengchan } from "@/api/productOrdes/index.js"
import ExportForm from '@/components/no_mount/ExportBox/index'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getPrintList } from '@/api/system/printDev'
import { getPrintBusInfo } from '@/api/system/printDev'

import  InspectionDetail from '../../inspectionManagement/reportWorkInspection/inspectionFormManagementDetail.vue'
import { excelExport } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { getSalaryDetailList} from '@/api/salaryManagement'
import userTransfer from '@/components/JNPF-userTransfer'
import { getSummaries } from "@/utils";
export default {
  name: 'assemblyplanManagement',
  components: { ExportForm,userTransfer,InspectionDetail,PrintBrowse,PrintDialog},
  mixins: [getProjectList],
  props:{
    queryParams:{
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
              prop: 'productionOrderNo',
              symbol: 'like',
              fixed: true
            },
            {
              prop: 'orderNo',
              symbol: 'like',
              fixed: true
            },
            {
              prop: 'processName',
              symbol: 'like',
              fixed: true
            },
            {
              prop: 'producerName',
              symbol: 'like',
              fixed: true
            }
          ],
          keywordQuery: this.jnpf.getKeywordQuery('product'), // 带有产品信息的表使用此预设
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
      summaryMapping:{},
      workOrderData: [],
      printList: [],
      printVisible: false,
      workOrderVisible:false,
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
      inspectionDetailVisible:false,
      columnList: ["productsCode",],
      superQueryVisible: false,
      exportFormVisible: false,
      analyseDialog: false,
      dataForm:{
        producerId:'',
        qualifiedQuantity:null,
        responsibilityWasteQuantity:null,
        materialWasteQuantity:null,
        unqualifiedQuantity:null,
        reportingQuantity:null
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

      orderForm: {
        ...this.queryParams,
        reportingType: 'normal',
        classAttribute: "finish_product",
      },
      totalData:{},
      total: 0,
      formVisible: false,
      selectArr: [],
      superQueryJson: [
        {
          prop: 'vibrationLevel',
          label: "振动等级",
          type: 'select',
          options: []
        },
        {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: this.getDictDataSync('packaging'),
        },
        {
          prop: 'orderStatus',
          label: '任务状态',
          type: 'select',
          options: this.global.orderStatus,
        }
      ],
      requestArr: [
        {
          prop: "vibrationLevel",
          typeCode: "pa005"
        },
        {
          prop: "sealingCoverTyping",
          typeCode: "pa007"
        },
        {
          prop: "oil",
          typeCode: "pa002"
        },
        {
          prop: "packagingMethod",
          typeCode: "pa015"
        },
         {
          prop: "markingMethod",
          typeCode: "pa014"
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
    if (this.isProductNameSwitch == 1) {
      this.superQueryJson.splice(3, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
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
     // 多选
    handleSelectionChange(val) {
      this.selectArr = val
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
      }).catch(() => { })
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
    closeFun(){
      this.inspectionDetailVisible=false
      this.initData()
    },
    viewFun(id){
      this.inspectionDetailVisible=true
      this.$nextTick(()=>{
        this.$refs.inspectionDetailRef.init(id,'','','look')
      })
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.isProjectSwitchFlag = true
      } catch (error) { }
    },
    // 撤回
    withdrawFun(data) {
      this.$confirm("您确定撤回该报工数据吗?", "提示", {
        type: 'warning'
      }).then(() => {
        revokeReport(data.id).then(res => {
          this.$message.success("撤回成功")
          this.initData()
        })
      }).catch(() => {

      })

    },
    editHandle(row){
      this.dataForm = {...row}
      this.analyseDialog = true
    },
     // 选择生产人
    hangleSelectSales(e, r) {
      this.dataForm.producerId = e
    },
    reportingTimeChange(e) {
      this.dataForm.reportingTime = e + ' 00:00:00'
    },
    async dataFormSubmit(){
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
        console.log(this.dataForm.reportingTime,'是是是')
        // 不合格数量 = 料废数量 + 责废数量
        this.dataForm.unqualifiedQuantity = Number(this.dataForm.responsibilityWasteQuantity) + Number(this.dataForm.materialWasteQuantity)
        // 报工数量 = 合格数量 + 不合格数量
        this.dataForm.reportingQuantity = Number(this.dataForm.qualifiedQuantity) + Number(this.dataForm.unqualifiedQuantity)
        updateReport(this.dataForm).then(res=>{
          this.analyseDialog = false
          this.btnLoading = false
          this.$message.success("修改成功")
          this.initData()
        }).catch(e=>{
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
      if (listLoadKey !== this.listLoadKey) return; // 请求过期

      this.listLoading = true

      // if (this.reportDate && this.reportDate.length) {
      //   this.orderForm.reportStartDate = this.reportDate[0]
      //   this.orderForm.reportEndDate = this.reportDate[1]
      // } else {
      //   this.orderForm.reportStartDate = ""
      //   this.orderForm.reportEndDate = ""
      // }
     this.orderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
     getSalaryDetailList(this.orderForm).then(res => {
        console.log("报工记录", res);
        // res.data.records.forEach(item => {
        //   item.selectFlag = false
        // })
        this.tableData = res.data.page.records
        this.total = res.data.page.total
        this.totalData = res.data.total ? res.data.total : {}
        this.apiTotalData = res.data.total ? res.data.total : {}
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })

    },
    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    // 导出
    exportForm(exportTableRef) {
      this.exportTableRef = exportTableRef
      this.exportFormVisible = true
      let columnList = this.$refs[exportTableRef].columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
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
