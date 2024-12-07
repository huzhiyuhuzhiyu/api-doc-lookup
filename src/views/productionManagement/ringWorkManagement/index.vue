<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!formVisible">
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
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="dataForm.prodOrderStatus" placeholder="任务状态" style="width: 100%;" clearable>
                  <el-option v-for="(item, index) in list" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search('basic')">
                  {{ $t('common.search') }}</el-button>
                <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
          <div class="JNPF-common-head">
            <div>
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="reassignmentFun2()">改派</el-button>
              <el-button type="primary" size="mini" icon="el-icon-download"
                @click="exportForm('dataTable')">导出</el-button>
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
          <JNPF-table :partentOrChild="'dataTable'" ref="dataTable" :data="tableData" v-if="isProjectSwitchFlag"
            :fixedNO="true" :checkSelectable="checkSelectable" @selection-change="handleSelectionChange" hasC
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="processName" label="工序名称" min-width="120" sortable="custom"></el-table-column>
            <el-table-column prop="processCode" label="工序编码" min-width="120" sortable="custom" />
            <el-table-column prop="processingType" label="加工类型" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.processingType == 'self_produced' ? '自制' : '外协' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="planStartDate" label="计划开始日期" min-width="160" sortable="custom" />
            <el-table-column prop="planEndDate" label="计划结束日期" min-width="160" sortable="custom" />
            <el-table-column prop="mainUnit" label="单位" width="80" />
            <el-table-column prop="productionQuantity" label="生产数量" min-width="140" sortable="custom" />
            <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="140" sortable="custom" />
            <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="140" sortable="custom"> </el-table-column>
            <el-table-column prop="personName" label="人员" min-width="160" sortable="custom" />
            <el-table-column prop="workGroupName" label="班组" min-width="160" sortable="custom" />
            <el-table-column prop="equipmentName" label="设备" min-width="160" sortable="custom"></el-table-column>
            <el-table-column prop="pickingFlag" label="是否领料" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.pickingFlag == 1 ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="firstInspection" label="是否首检" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.firstInspection == 1 ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="checkFlag" label="是否检验" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.checkFlag == 1 ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="reportFlag" label="是否报工" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.reportFlag == 1 ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="stockFlag" label="是否入库" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div>{{ scope.row.pickingFlag == 1 ? '是' : '否' }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="productionOrderNo" label="生产任务单号" min-width="180"
              sortable="custom"></el-table-column>
              <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
              v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="330" sortable="custom"></el-table-column>
            <el-table-column prop="prodOrderStatus" label="任务状态" min-width="120" sortable="custom">
              <template slot-scope="scope">
                <div v-if="scope.row.prodOrderStatus == 'normal'"><el-tag>正常</el-tag> </div>
                <div v-if="scope.row.prodOrderStatus == 'suspend'"><el-tag type="info">暂停</el-tag></div>
                <div v-if="scope.row.prodOrderStatus == 'closed'"><el-tag type="danger">关闭</el-tag></div>
                <div v-if="scope.row.prodOrderStatus == 'finish'"><el-tag type="success">已完成</el-tag></div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="210" sortable="custom"></el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope">
                <el-button size="mini" type="text"
                  @click="handleUserRelation(scope.row.orderNo, 'report')">报工记录</el-button>

              </template>
            </el-table-column>
          </JNPF-table>
          <pagination :total="total" :page.sync="dataForm.pageNum" :limit.sync="dataForm.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>

    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <BatchDispatchForm v-if="BatchDispatchVisible" ref="BatchDispatchForm" @refreshDataList="initData"
      @close="closeForm">
    </BatchDispatchForm>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>
<script>
import { detailordershengchan, getWorkList, addWorkReport } from '@/api/productOrdes/index.js'
import { UserListAll, } from '@/api/permission/user'
import Form from './Form'

import ExportForm from '@/components/no_mount/ExportBox/index'
import SuperQuery from '@/components/SuperQuery/index.vue'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import BatchDispatchForm from './batchDispatchForm.vue'

import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
// import TaskForm from './taskForm.vue'

export default {

  name: 'assemblyWorkManagement',
  components: { SuperQuery, Form, BatchDispatchForm, ExportForm },
  mixins: [getProjectList],

  data() {

    return {
      columnList: ["pickingFlag", "firstInspection", "checkFlag", "reportFlag", "stockFlag",],
      list: [
        { label: "所有", value: "" },
        { label: "进行中", value: "normal" },
        { label: "关闭", value: "closed" },
        { label: "已完成", value: "finish" },
      ],
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'productionOrderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 },
      ], 
      fullName: '',
      BatchDispatchVisible: false,


      dataFormList: {
        processName: "",
        productionOrderNo: "",
        classAttribute: "semi_finished",
        prodOrderStatus: "normal",
        pageNum: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      dataForm:{},
      addOrderVisible: false,
      superQueryVisible: false,
      btnLoading: false,
      title: "更多查询",
      tableData: [],
      listLoading: false, 
      total: 0,
      formVisible: false,
      selectArr: [],
      superQueryJson: [
        {
          prop: 'processName',
          label: "工序名称",
          type: 'input'
        },
        {
          prop: 'processCode',
          label: "工序编码",
          type: 'input',
           
        },
        {
          prop: 'processingType',
          label: "加工类型",
          type: 'select',
          options: [
          { label: "自制", value: "self_produced" },
          { label: "外协", value: "external_production" },
          ]
        },
         
        {
          prop: 'planStartDate',
          label: '计划开始日期',
          type: 'date',
          valueFormat: "yyyy-MM-dd",

        },
        {
          prop: 'planEndDate',
          label: '计划结束日期',
          type: 'date',
          valueFormat: "yyyy-MM-dd",
        },
        {
          prop: 'mainUnit',
          label: "单位",
          type: 'input'
        },
        {
          prop: 'personName',
          label: "人员",
          type: 'input'
        },
        {
          prop: 'workGroupName',
          label: "班组",
          type: 'input'
        },
        {
          prop: 'equipmentName',
          label: "设备",
          type: 'input'
        },
        {
          prop: 'pickingFlag',
          label: "是否领料",
          type: 'select',
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ]
        },
        {
          prop: 'firstInspection',
          label: "是否首检",
          type: 'select',
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ]
        },
        {
          prop: 'checkFlag',
          label: "是否检验",
          type: 'select',
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ]
        },
        {
          prop: 'reportFlag',
          label: "是否报工",
          type: 'select',
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ]
        },
        {
          prop: 'stockFlag',
          label: "是否入库",
          type: 'select',
          options: [
            { label: "是", value: true },
            { label: "否", value: false },
          ]
        },
        {
          prop: 'productionOrderNo',
          label: "生产任务单号",
          type: 'input'
        },
        {
          prop: 'productDrawingNo',
          label: "品名规格",
          type: 'input'
        },
     
        {
          prop: 'prodOrderStatus',
          label: "任务状态",
          type: 'select',
          options: [
            { label: "正常", value: 'normal' },
            { label: "暂停", value: 'suspend' },
            { label: "关闭", value: 'closed' },
            { label: "已完成", value: 'finish' },
          ]
        },


        {
          prop: 'createTime',
          label: '创建时间',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },

      ],
      workOrderData: [],
      selectWorkOrder: [],


      enCode: '',
      printList: [],
      isProjectSwitch: '',
      isProjectSwitchFlag: false,
      exportFormVisible:false,
      isProductNameSwitch:"",

    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project') 
    await this.getProductNameSwitch('product', 'enable_productName')
    if (this.isProductNameSwitch == 1) {
      this.superQueryJson.splice(15, 0, {
        prop: 'productName',
        label: '产品名称',
        type: 'input'
      })
    }
    this.superForm = this.dataForm = JSON.parse(JSON.stringify(this.dataFormList))
    this.search('basic')
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
  },
  methods: {
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.isProjectSwitchFlag = true
      } catch (error) { }
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
      const targetListQuery = this.dataForm
      let _data = {
        ...targetListQuery,
        exportType: '1018',
        exportName: '装配工单管理',
        includeFieldMap,
        pageSize: data.dataType == 0 ? targetListQuery.pageSize : -1
      }
      excelExport(_data).then(res => {
        this.exportFormVisible = false
        if (!res.data.url) return
        this.jnpf.downloadFile(res.data.url, res.data.name)
      })
    },
   
    addition1(data) {
      this.form = data
      this.addOrderVisible = true
    },


    // 改派
    reassignmentFun2() {
      console.log(this.selectArr);
      if (!this.selectArr.length) return this.$message.error("请选择您要改派的数据!")
      if (this.selectArr.length > 1) return this.$message.error("改派只支持单条数据操作")
      if (this.selectArr[0].taskMethod != 'appoint') return this.$message.error("改派只支持编排方式为指定加工对象的数据")
      this.BatchDispatchVisible = true

      this.$nextTick(() => {

        this.$refs.BatchDispatchForm.init(this.selectArr[0].id)

      })

    },

 



    // 多选

    handleSelectionChange(val) {

      this.selectArr = val

    },

    //禁用复选框

    checkSelectable(row) {
      if (row.prodOrderStatus !== 'normal' || row.prodOrderStatus == 'suspend' || row.documentStatus == 'draft') {
        return false
      } else {
        return true
      }
    },


    superQuerySearch(query) {

      this.superQuery = query

      this.superQueryVisible = false

      this.search('super')

    },
    sortChange({ prop, order }) {

      let newProp;

      if (prop === 'processName'||prop=='productName' ||prop=='prodOrderStatus'|| prop == 'projectName' || prop === 'processCode' || prop === 'personName' || prop === 'workGroupName' || prop == 'equipmentName' || prop == 'productDrawingNo' || prop == 'routingName' || prop == 'routingCode') {

        if (prop === 'createByName') {

          newProp = 'create_by'

        } else {

          newProp = prop

        }

      } else {

        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());

      }

      this.dataForm.orderItems[0].asc = order !== "descending"

      this.dataForm.orderItems[0].column = order === null ? "" : newProp



      this.initData()

    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false 
      this.BatchDispatchVisible = false
      this.search()
    },
    initData() {
      this.listLoading = true
      this.dataForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getWorkList(this.dataForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search(type) {
      Object.keys(this.dataForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.dataForm[key]
        this.dataForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.dataForm.pageNum = 1 // 重置页码
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
      this.superForm = this.dataForm = JSON.parse(JSON.stringify(this.dataFormList))
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 }, 
        { field: 'orderNo', fieldValue: '', label: '生产任务单号', symbol: 'like', searchType: 1, width: 120 }, 
      ],
        this.search('basic')
    },
    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        deleteQuotationsendlist(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
    handleUserRelation(id, btnType) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType)
      })
    },
 
    columnSetFun() {

      this.$refs.dataTable.showDrawer()

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

  }
}
</script>
<style scoped>
.JNPF-common-search-box {
  padding: 8px 0 !important;
  margin-left: 0 !important;
  margin-bottom: 5px;
}
</style>

<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px !important;
}
</style>
