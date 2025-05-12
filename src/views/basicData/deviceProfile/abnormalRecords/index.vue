<!-- 异常记录 --> 
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
            </div>
            <div class="JNPF-common-head-right">
              <el-tooltip content="高级查询" placement="top" v-if="true">
                <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false" @click="advanceFun" />
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
          <JNPF-table :partentOrChild="'dataTable'" ref="dataTable" :data="tableData"
            :fixedNO="true"  @selection-change="handleSelectionChange" hasC
            @sort-change="sortChange" custom-column :setColumnDisplayList="columnList">
            <el-table-column prop="name" label="异常单号" min-width="180" sortable="custom" />
            <el-table-column prop="name" label="设备名称" min-width="180" sortable="custom" />
            <el-table-column prop="name" label="设备编码" min-width="180" sortable="custom" />
            <el-table-column prop="name" label="异常状态" min-width="180" sortable="custom" />
            <el-table-column prop="code" label="上报人" min-width="180" sortable="custom" />
            <el-table-column prop="code" label="上报时间" min-width="180" sortable="custom" />
            <el-table-column prop="code" label="异常描述" min-width="180" sortable="custom" />
            <el-table-column prop="code" label="完成时间" min-width="180" sortable="custom" />
          </JNPF-table>
          <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
            @pagination="initData" />
        </div>
      </div>
    </div>
    <el-dialog :title="taskSetTitle" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="addOrderVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="left">
          <el-col :span="24" v-if="taskKey=='maintain'">
            <el-form-item label="保养配置是否开启" prop="maintenanceSettingsFlag">
              <el-select v-model="dataForm.maintenanceSettingsFlag" placeholder="请选择" style="width: 100%;" >
                <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" 
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24"  v-if="taskKey=='maintain'">
            <el-form-item label="保养开始日期" prop="maintenancePlanDate">
              <el-date-picker v-model="dataForm.maintenancePlanDate" type="date" value-format="yyyy-MM-dd"
                style="width: 100%;" :picker-options="pickerOptions" placeholder="请选择保养开始日期" >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24"  v-if="taskKey=='maintain'">
            <el-form-item label="保养间隔天数" prop="maintenanceIntervalNum">
              <el-input v-model="dataForm.maintenanceIntervalNum" placeholder="保养间隔天数"  />
            </el-form-item>
          </el-col>

          <el-col :span="24"  v-if="taskKey=='spotCheck'">
            <el-form-item label="点检配置是否开启" prop="inspectionSettingsFlag">
              <el-select v-model="dataForm.inspectionSettingsFlag" placeholder="请选择" style="width: 100%;" >
                <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" 
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24"  v-if="taskKey=='spotCheck'">
            <el-form-item label="点检开始日期" prop="inspectionPlanDate">
              <el-date-picker v-model="dataForm.inspectionPlanDate" type="date" value-format="yyyy-MM-dd"
                style="width: 100%;" :picker-options="pickerOptions" placeholder="请选择点检开始日期" >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24"  v-if="taskKey=='spotCheck'">
              <el-form-item label="点检间隔天数" prop="inspectionIntervalNum">
                <el-input v-model="dataForm.inspectionIntervalNum" placeholder="点检间隔天数"  />
              </el-form-item>
            </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrderVisible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="submitFun()">
          提交</el-button>
      </span>
    </el-dialog>
    <!-- 高级查询 -->
    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
  
  </div>
</template>
<script>
import SuperQuery from '@/components/SuperQuery/index.vue'
import {  getEquEquipmentList,batchEquTaskSettings  } from '@/api/basicData/index'

import { mapGetters, mapState } from 'vuex'
export default {
  name: 'taskConfig',
  components: {  SuperQuery },
  data() {
    return {
      addOrderVisible: false,
      superQueryVisible: false,
      columnList: [],
      superQuery: {},
      superForm: {},
      taskSetTitle:"",
      statusList:[
      { label: "是", value: true },
      { label: "否", value: false},
      ],

 
   
      basicQuery: {},
      searchList: [
        { field: 'name', fieldValue: '', label: '设备名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'code', fieldValue: '', label: '设备编码', symbol: 'like', searchType: 1, width: 120 },
      ],
      taskKey:"",
      dataForm: {
        maintenanceSettingsFlag:"",
          inspectionSettingsFlag:"",
          maintenancePlanDate:"",
          inspectionPlanDate:"",
          maintenanceIntervalNum:"",
          inspectionIntervalNum:"",
      },
      reworkVisible: false,
      btnLoading: false,
      title: "更多查询",
      tableData: [],
      listLoading: false,
      detailFlag: false,
      orderForm: {},
      orderFormlist: {
        classAttribute:"equipment",
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
      total: 0,
      formVisible: false,
      selectArr: [],
      superQueryJson: [
        {
          prop: 'name',
          label: "设备名称",
          type: 'input'
        },
        {
          prop: 'code',
          label: "设备编码",
          type: 'input'
        },
        {
          prop: 'maintenancePlanDate',
          label: '保养开始日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'maintenanceSettingsFlag',
          label: "保养配置状态",
          type: 'select',
          options: [
            { label: "是", value: true },
            { label: "否", value: false},
          ]
        },
        {
          prop: 'inspectionPlanDate',
          label: '点检开始日期',
          type: 'daterange',
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
        },
        {
          prop: 'inspectionSettingsFlag',
          label: "点检配置状态",
          type: 'select',
          options: [
            { label: "是", value: true },
            { label: "否", value: false},
          ]
        },
      ],
      list:[],
      dataRule: {
        maintenancePlanDate: [
        { required: true, message: '保养开始日期不能为空', trigger: 'change' }
        ],
        inspectionPlanDate: [
        { required: true, message: '点检开始日期不能为空', trigger: 'change' }
        ],
        maintenanceIntervalNum: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["保养间隔天数不能为空", (errMsg, index) => { this.$message.error(`保养间隔天数${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('bigInt'), trigger: 'blur' }
        ],
        inspectionIntervalNum: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["点检间隔天数不能为空", (errMsg, index) => { this.$message.error(`点检间隔天数${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('bigInt'), trigger: 'blur' }
        ],
      
       
       
      },
 
 
   
    }
  },
  async created() {


    this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
    this.search('basic')
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
  },
  methods: {
    batchSet(key){
      this.taskKey=key 
      this.$nextTick(()=>{
        this.taskSetTitle=key=='spotCheck'?'批量设置点检任务':'批量设置保养任务'
        console.log("key",key);
        if(key=='spotCheck') {
          if(!this.selectArr.length)return this.$message.error("请选择你要批量设置点检任务的数据")
          this.dataForm.inspectionSettingsFlag=true
          this.dataForm.inspectionPlanDate= this.jnpf.getToday()
        }
        if(key=='maintain') {
          if(!this.selectArr.length)return this.$message.error("请选择你要批量设置保养任务的数据")
          this.dataForm.maintenancePlanDate= this.jnpf.getToday()
          this.dataForm.maintenanceSettingsFlag=true
        }
      this.addOrderVisible=true
      })
      
      console.log(this.dataForm);
    },
    // 追加生产数量 提交
    submitFun() {
      this.$refs['diaForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.$set(this.dataForm,'ids',this.selectArr.map(item => item.id))
          batchEquTaskSettings(this.dataForm).then(res => {
            this.addOrderVisible = false
            this.btnLoading = false
            this.search('basic')
            this.dataForm={
        maintenanceSettingsFlag:"",
          inspectionSettingsFlag:"",
          maintenancePlanDate:"",
          inspectionPlanDate:"",
          maintenanceIntervalNum:"",
          inspectionIntervalNum:"",
      }
          }).catch(error => {
            this.btnLoading = false
          })
        }
      })
    },
    // 多选
    handleSelectionChange(val) {
      this.selectArr = val
    },
    superQuerySearch(query) {
      this.orderForm.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'partnerCode' ||prop=='productionLineNmae'|| prop == 'pairingModeName' || prop == 'productName' || prop == 'projectName' || prop === 'partnerName' || prop === 'shipperName' || prop === 'createByName' || prop == 'productDrawingNo' || prop == 'productCode' || prop == 'routingName' || prop == 'routingCode') {
        if (prop === 'createByName') {
          newProp = 'create_by'
        } else {
          newProp = prop
        }
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order !== "descending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
   
    initData() {
      this.listLoading = true
      getEquEquipmentList(this.orderForm).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    search(type) {
      Object.keys(this.orderForm).forEach(key => { // 清除搜索条件两端空格
        let item = this.orderForm[key]
        this.orderForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.orderForm.pageNum = 1 // 重置页码
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
      this.superForm = this.orderForm = JSON.parse(JSON.stringify(this.orderFormlist))
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
      { field: 'name', fieldValue: '', label: '设备名称', symbol: 'like', searchType: 1, width: 120 },
      { field: 'code', fieldValue: '', label: '设备编码', symbol: 'like', searchType: 1, width: 120 },
      ],
        this.search('basic')
    },

    columnSetFun() {
      this.$refs.dataTable.showDrawer()
    },
    closePrint() {
      this.printVisible = false
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
::v-deep #qrcode img{
  margin: 0 auto;
}
</style>
