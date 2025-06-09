<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
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
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="JNPF-common-head">
          <topOpts @add="addSupplier('', 'add')"></topOpts>

          <div class="JNPF-common-head-right">
            <el-tooltip content="高级查询" placement="top" v-if="true">
              <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                @click="superQueryVisible = true" />
            </el-tooltip>
            <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
              <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false" @click="columnSetFun()" />
            </el-tooltip>

            <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
              <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false" @click="initData()" />
            </el-tooltip>
          </div>
        </div>
        <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" border :setColumnDisplayList="columnList"
        :hasC="['btn_print_merge','btn_withdraw']" :checkSelectable="checkSelectable" @selection-change="handleSelectionChange" :fixedNO="true"
          @sort-change="sortChange" custom-column customKey="JNPFTableKey_962568">
        
          <el-table-column prop="cooperativePartnerName" label="供应商名称" sortable="custom" min-width="160" >
          </el-table-column>
          <!-- <el-table-column prop="partnerCode" label="供应商编码" sortable="custom" min-width="180" ></el-table-column> -->
      
          <el-table-column prop="calcType" label="计算类型" min-width="120">
            <template slot-scope="scope">
              <div  v-if="scope.row.calcType == 'number'"> 按数量计算</div>
              <div  v-else-if="scope.row.calcType == 'weight'">按重量计算</div>
            </template>
          </el-table-column>
          <el-table-column prop="processName" label="工序名称" min-width="180" />
          <!-- <el-table-column prop="processCode" label="工序编码" min-width="180" /> -->
          <el-table-column prop="price" label="单价" min-width="180" />
          <el-table-column prop="upper" label="上限" min-width="180" />
          <el-table-column prop="lower" label="下限" min-width="180" />
          <el-table-column prop="remark" label="备注" min-width="180" />
          <el-table-column prop="createTime" label="创建时间" sortable="custom" min-width="180" />
          <el-table-column label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <tableOpts :isJudgePer="true" :editPerCode="'btn_edit'" :delPerCode="'btn_remove'"
                :delDisabled="scope.row.documentStatus == 'submit'"
                :editDisabled="scope.row.documentStatus == 'submit' || scope.row.documentStatus == 'back'"
                @edit="addSupplier(scope.row, 'edit')" @del="handleDel(scope.row.id)">
             
              </tableOpts>
            </template>
          </el-table-column>
        </JNPF-table>
        <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
          @pagination="initData">
        </pagination>
      </div>
    </div>

    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
    <el-dialog :title="title" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="addOrderVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
      <el-row :gutter="20">
        <el-form ref="diaForm" :model="dataForm" :rules="dataRule" label-width="120px" label-position="left">
          <el-col :span="24">
            <el-form-item label="外协供应商名称" prop="cooperativePartnerName">
             <ComSelect-page :clearable="type !== 'look'" :isdisabled="btnType=='look'"
                            :treeNodeClick="treeNodeClick" v-model="dataForm.cooperativePartnerName"
                            :beforeSubmit="beforeSubmit" ref="ComSelect-page" @change="supplierdata"
                            :tableItems="PartnerTableItems" :placeholder="'请选择供应商名称'" title="选择供应商" treeTitle="供应商分类"
                            :methodArr="PartnerMethodArr" :listMethod="getCooperativeData"
                            :listRequestObj="PartnerListRequestObj" :paramsObj="{ oldData }"
                            :searchList="PartnerTableSearchList" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工序名称" prop="processName">
              <el-input v-model="dataForm.processName" placeholder="工序名称" :disabled="btnType=='look'" readonly  @focus="selectProcessFocus"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="计算类型" prop="calcType">
             <el-select v-model="dataForm.calcType" placeholder="计算类型"  :clearable="btnType=='look'"   :disabled="btnType=='look'">
                  <el-option v-for="(item2, index2) in calcTypeList" :key="index2" :label="item2.label"
                    :value="item2.value"></el-option>
                </el-select>
              
            </el-form-item>
          </el-col>
     
           <el-col :span="24" v-if="dataForm.calcType=='weight'">
            <el-form-item label="重量下限" prop="lower">
              <el-input v-model="dataForm.lower" placeholder="重量下限" :disabled="btnType=='look'" />
            </el-form-item>
          </el-col>
          <el-col :span="24"  v-if="dataForm.calcType=='weight'">
            <el-form-item label="重量上限" prop="upper">
              <el-input v-model="dataForm.upper" placeholder="重量上限" :disabled="btnType=='look'" />
            </el-form-item>
          </el-col>
            <el-col :span="24">
            <el-form-item label="单价" prop="price">
              <el-input v-model="dataForm.price"   placeholder="单价" :disabled="btnType=='look'"/>
            </el-form-item>
          </el-col>
           <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="dataForm.remark" type="textarea" :row="2"  placeholder="单价" :disabled="btnType=='look'" maxlength="200"/>
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
    <ProcessForm ref="ProcessForm" v-if='ProcessFormVisible' @selectFun="selectProcessFun"></ProcessForm>
  </div>
</template>

<script>
import { purOutProcessPriceAdd,purOutProcessPriceDel,purOutProcessPriceUpdate,purOutProcessPriceList } from '@/api/purchasingManagement/purchaseInquirySheet'
import { getCooperativeData  } from '@/api/basicData/index'
import { getcategoryTrees } from '@/api/salesManagement/assemblyOrders'


import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import tenantMinix from "@/mixins/generator/TenantMinix";
import ProcessForm from './processForm.vue'
export default {
  name: 'outPriceConfig',
  components: {ProcessForm},
  mixins: [getProjectList,tenantMinix],

  props: {
    warehouseCode: "",
  },
  data() {
    return {
      addOrderVisible:false,
      btnLoading:false,
      btnType:"",
      ProcessFormVisible:false,
      dataForm:{
        cooperativePartnerCode:"",
        cooperativePartnerId:"",
        cooperativePartnerName:"",
        calcType:"",
        lower:"",
        upper:"",
        price:"",
        remark:"",
        processName:"",
        processCode:"",
        processId:"",
      },
      calcTypeList:[
        {label:"按数量计算",value:"number",},
        {label:"按重量计算",value:"weight",}
      ],
      title:"",
      takingAdjustVisible: false,
      printVisible: false,
      isPrintNBWSwitch: '',
      printBrowseVisible: false,
      inboundReturnVisible: false,
      outboundUseVisible: false,
      superQuery: {},
      superForm: {},
      basicQuery: {},
      searchList: [
        { field: 'cooperativePartnerName', fieldValue: '', label: '供应商名称', symbol: 'like', searchType: 1, width: 120 },
        { field: 'processName', fieldValue: '', label: '工序名称', symbol: 'like', searchType: 1, width: 120 },
      ],
     

      columnList: [],

      exportFormVisible: false,
      visible: false,
      tableData: [],
      listLoading: false,

  
      superQueryVisible: false,

      initListQuery: {  
        pageNum: 1,
        cooperativePartnerName: "",
        processName:"",
        pageSize: 20,
        projectId: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: ""
        }],
      },
      listQuery: {},
      total: 0,
      formVisible: false,
      selectData: [],
      totalList: [],
      superQueryJson: [{
        prop: 'cooperativePartnerName',
        label: "供应商名称",
        type: 'input'
      },
      // {
      //   prop: 'orderNo',
      //   label: "供应商编码",
      //   type: 'input'
      // },
      {
        prop: 'processName',
        label: "工序名称",
        type: 'input'
      },
      // {
      //   prop: 'processCode',
      //   label: "工序编码",
      //   type: 'input'
      // },
 
      {
        prop: 'calcType',
        label: "计算类型",
        type: 'select',
        options: [
          { label: "按数量计算", value: "number" },
          { label: "按重量计算", value: "weight" },
        ]
      },
      ],
      classAttributeList: [],
      selectArr: [],
 
      enCode: "",
      isProjectSwitch: '',
      oldData:[],
       //  供应商 树请求
      getCooperativeData,
      PartnerMethodArr: { method: getcategoryTrees, requestObj: { type: 'outsourcing_suppliers' } },
      // 供应商 列表
      PartnerTableItems: [
        { prop: 'code', label: '供应商编码' },
        { prop: 'name', label: '供应商名称' },
        { prop: 'nameEn', label: '英文名称' },
        { prop: 'taxId', label: '税号' }
      ],
      // 供应商搜索条件
      PartnerTableSearchList: [
        { prop: 'code', label: '供应商编码', type: 'input' },
        { prop: 'name', label: '供应商名称', type: 'input' }
      ],
      // 供应商请求参数
      PartnerListRequestObj: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'outsourcing_suppliers'
      },
       dataRule: {
        cooperativePartnerName: [{ required: true, message: '请选择供应商名称', trigger: ['change'] }],
        processName: [{ required: true, message: '请选择工序名称', trigger: ['change'] }],
        calcType: [{ required: true, message: '请选择计算类型', trigger: ['change'] }],
        lower: [
          { required: true, trigger: 'blur' },
          { validator: this.formValidate({ type: 'noEmtry', params: ["重量下限不能为空", (errMsg) => { this.$message.error(`${errMsg}`) }] }), trigger: 'blur' },
          { validator: this.formValidate({type: 'decimal', params: [20,4,'', (errMsg,index) => { this.$message.error(`重量下限：` + errMsg) }]}),  trigger: 'blur'},
        ],
        upper: [ 
          { required: true, trigger: 'blur' },
           { validator: this.formValidate({ type: 'noEmtry', params: ["重量上限不能为空", (errMsg) => { this.$message.error(`${errMsg}`) }] }), trigger: 'blur' },
          { validator: this.formValidate({type: 'decimal', params: [20,4,'', (errMsg,index) => { this.$message.error(`重量上限：` + errMsg) }]}),  trigger: 'blur'},
        ],
        price: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["单价：不能为空", (errMsg) => { this.$message.error(`${errMsg}`) }] }), trigger: 'blur' },
          { validator: this.formValidate({type: 'decimal', params: [20,4,'', (errMsg,index) => { this.$message.error(`单价：` + errMsg) }]}),  trigger: 'blur'},
          { required: true, trigger: 'blur' },
        ]
      },
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },

  async created() {

    this.superForm = this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
    this.search('basic')
  },
  methods: {
    submitFun () {
      this.$refs['diaForm'].validate((valid) => {
        if (valid) {
          this.btnLoading=true
          purOutProcessPriceAdd(this.dataForm).then(res=>{
            this.btnLoading=false
            this.addOrderVisible=false
            this.search('basic')
          }).catch(error=>{
            this.btnLoading=false
          })
        }

      })
    },
    selectProcessFocus(){
      this.ProcessFormVisible=true
      this.$nextTick(()=>{
        this.$refs.ProcessForm.init()
      })
    },
    // 所选得工序信息
    selectProcessFun(row){
      this.dataForm.processName=row.name
      this.dataForm.processCode=row.code
      this.dataForm.processId=row.id
    },
  // 弹窗节点的点击
    treeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      listQuery.classAttribute = data.classAttribute
      return listQuery
    },
     supplierdata(id, data) {
      console.log(data, 'd')
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('cooperativePartnerName')
      })
      if (data.length === 0) {
        this.dataForm.cooperativePartnerName = ''
        this.dataForm.cooperativePartnerCode = ''
        this.dataForm.cooperativePartnerId = ''
        this.oldData = []
      } else {
        if (this.oldData.length) {
        } else {
          this.oldData.push(data)
        }
        this.dataForm.cooperativePartnerName = data[0].all.name
        this.dataForm.cooperativePartnerCode = data[0].all.code
        this.dataForm.cooperativePartnerId = data[0].all.id
        console.log(this.dataForm, 'fo')
      }
    },
 

 


 
    superQuerySearch(query) {
      this.listQuery.superQuery = query
      this.superQueryVisible = false
      this.search()
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
     
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
  
    addSupplier(row,type) {
      this.btnType=type
      if(row) this.dataForm=row
      this.addOrderVisible = true
    },
 
  









getOutProcessFun(){
  purOutProcessPriceList(this.listQuery).then(res=>{
    console.log("res=>",res);
    this.tableData=res.data.records
    this.total=res.data.total
  })
},
    
    columnSetFun() {
      console.log("this.$refs.dataTable", this.$refs.dataTable);
      this.$refs.dataTable.showDrawer()
    },
    handeleInfoData(val) {
      this.selectData = val
    },
    initData() {
      this.getOutProcessFun()
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop == 'cooperativePartnerName' || prop == 'partnerCode') {
        newProp = prop
      } else {

        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.listQuery.orderItems[0].asc = order === 'ascending'
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },


    search(type) {
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
      this.superForm = this.listQuery = JSON.parse(JSON.stringify(this.initListQuery))
      this.$refs.SuperQuery.conditionList = []
      this.searchList = [
        { field: 'orderNo', fieldValue: '', label: '单号', symbol: 'like', searchType: 1, width: 120 },
        { field: 'cooperativePartnerName', fieldValue: '', label: '客户/供应商', symbol: 'like', searchType: 1, width: 120 },
      ],
        this.initData()
    },



    handleDel(id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        purOutProcessPriceDel(id).then(res => {
          this.initData()
          this.$message({
            type: 'success',
            message: "删除成功",
            duration: 1500,
          })
        })
      }).catch(() => { })
    },
 
  }
}
</script>
<style src="@/assets/scss/index-list.scss" lang="scss" scoped />
<style scoped>
.JNPF-common-search-box {
  padding: 8px 0 0 0 !important;
  margin-left: 0 !important;
  margin-bottom: 5px;
}
</style>
